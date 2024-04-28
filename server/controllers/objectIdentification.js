"use strict";
// controllers/objectIdentification.js
const fs = require("fs").promises;
const { loadImage, createCanvas } = require("canvas");
const tf = require("@tensorflow/tfjs-node");
const tfconv = require("@tensorflow/tfjs-converter");

let model;

/**
 * Loads the TensorFlow object detection model.
 * @returns {Promise<void>} A Promise that resolves when the model is loaded successfully.
 */
const loadModel = async () => {
	try {
		console.log("Model loading...");
		model = await tfconv.loadGraphModel("file://./models/brain_MD_V1_640x640/model.json");
		console.log("Model loaded successfully");
		return model;
	} catch (error) {
		console.error("Error loading the model:", error);
	}
};

/**
 * Calculates the intersection over union (IoU) between two bounding boxes.
 * @param {number[]} boxA - Coordinates of the first bounding box: [xMin, yMin, xMax, yMax].
 * @param {number[]} boxB - Coordinates of the second bounding box: [xMin, yMin, xMax, yMax].
 * @returns {number} The IoU value.
 */
function intersectionOverUnion(boxA, boxB) {
	const xA = Math.max(boxA[0], boxB[0]);
	const yA = Math.max(boxA[1], boxB[1]);
	const xB = Math.min(boxA[2], boxB[2]);
	const yB = Math.min(boxA[3], boxB[3]);

	const intersectionArea = Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);
	const boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1);
	const boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1);

	const iou = intersectionArea / (boxAArea + boxBArea - intersectionArea);
	return iou;
}

/**
 * Applies non-maximum suppression (NMS) to filter bounding boxes.
 * @param {number[][]} boundingBoxes - Array of bounding boxes.
 * @param {number[]} confidenceScores - Confidence scores for each bounding box.
 * @param {string[]} labels - Labels for each bounding box.
 * @param {number} threshold - Threshold for IoU to determine overlapping bounding boxes.
 * @returns {number[][]} Filtered bounding boxes, conf, labels.
 */
function applyNMS(boundingBoxes, confidenceScores, labels, threshold) {
	const nmsBoundingBoxes = [];
	const nmsConfidenceScores = [];
	const nmsLabels = [];

	//console.log("Initial number of bounding boxes:", boundingBoxes.length);

	for (let i = 0; i < boundingBoxes.length; i++) {
		let keep = true;

		// Check if the current bounding box overlaps with any previously retained bounding boxes
		for (let j = 0; j < nmsBoundingBoxes.length; j++) {
			const iou = intersectionOverUnion(boundingBoxes[i], nmsBoundingBoxes[j]);
			//console.log(`Box ${i} overlaps with box ${j}. IoU: ${iou}`);
			if (iou > threshold) {
				// Check if the current box has higher confidence than the overlapping one
				if (confidenceScores[i] > nmsConfidenceScores[j]) {
					nmsBoundingBoxes[j] = boundingBoxes[i];
					nmsConfidenceScores[j] = confidenceScores[i];
					nmsLabels[j] = labels[i];
				}
				keep = false;
				break;
			}
		}

		if (keep) {
			nmsBoundingBoxes.push(boundingBoxes[i]);
			nmsConfidenceScores.push(confidenceScores[i]);
			nmsLabels.push(labels[i]);
		}
	}

	//console.log("Number of bounding boxes after NMS:", nmsBoundingBoxes.length);
	return [nmsBoundingBoxes, nmsConfidenceScores, nmsLabels];
}
/**
 * Checks if two arrays are equal.
 * @param {any[]} arr1 - First array.
 * @param {any[]} arr2 - Second array.
 * @returns {boolean} True if the arrays are equal, otherwise false.
 */
function arraysAreEqual(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}

/**
 * Removes duplicate bounding boxes.
 * @param {number[][]} array - Array of bounding boxes.
 * @param {number[]} scores - Confidence scores for each bounding box.
 * @param {string[]} labels - Labels for each bounding box.
 * @returns {number[][]} Unique bounding boxes, conf, labels.
 */
function removeDuplicates(array, scores, labels) {
	const uniqueArray = [];
	const uniqueScores = [];
	const uniqueLabels = [];
	array.forEach((item, index) => {
		const existingIndex = uniqueArray.findIndex((existingItem) => arraysAreEqual(existingItem.array, item));
		if (existingIndex === -1) {
			uniqueArray.push({ array: item, score: scores[index], label: labels[index] });
			uniqueScores.push(scores[index]);
			uniqueLabels.push(labels[index]);
		} else if (scores[index] > uniqueArray[existingIndex].score) {
			uniqueArray[existingIndex] = { array: item, score: scores[index], label: labels[index] };
			uniqueScores[existingIndex] = scores[index];
			uniqueLabels[existingIndex] = labels[index];
		}
	});
	return [uniqueArray.map((item) => item.array), uniqueScores, uniqueLabels];
}

/**
 * Handles object identification based on the uploaded image.
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
const handleObjectIdentification = async (req, res) => {
	try {
		await loadModel();
		if (!req.file) {
			throw new Error("No file uploaded");
		}
		const buffer = req.file.buffer;

		// Save the uploaded image to a file
		const imagePath = "./uploads/image.jpg";
		await fs.writeFile(imagePath, buffer);

		// Load the image
		const img = await loadImage(imagePath);
		const canvas = createCanvas(img.width, img.height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		// Convert the image to a TensorFlow tensor
		const tensor = tf.browser.fromPixels(canvas).expandDims();

		// Perform object detection using the loaded model
		if (!model) {
			console.error("Model is not loaded");
			res.status(500).json({ success: false, message: "Error identifying object" });
			return;
		}

		const predictions = await model.executeAsync(tensor);

		const boundingBoxesTensor = predictions[5]; //6
		const boundingBoxes = await boundingBoxesTensor.arraySync();

		const confidenceScoresTensor = predictions[6]; //4
		const confidenceScores = confidenceScoresTensor.arraySync();

		const sliderValue = req.body.sliderValue / 100;
		const confidenceThreshold = sliderValue;

		const classLabels = ["Other", "negative", "positive"];

		const filteredBoundingBoxes = [];
		const filteredCasslabels = [];
		const filteredConfidenceScore = [];

		const seen = {};

		const confidenceScoresSingles = confidenceScores[0];
		for (let i = 0; i < confidenceScoresSingles.length; i++) {
			for (let j = 0; j < classLabels.length; j++) {
				if (confidenceScoresSingles[i][j] >= confidenceThreshold) {
					const key = `${boundingBoxes[0][i]}_${classLabels[j]}`; // Forming a unique key based on bounding box and class label
					if (!seen[key]) {
						// Checking if the combination has been seen before
						seen[key] = true; // Marking it as seen
						filteredCasslabels.push(classLabels[j]);
						filteredBoundingBoxes.push(boundingBoxes[0][i]);
						filteredConfidenceScore.push(confidenceScoresSingles[i][j]);
					}
				}
			}
		}

		const thresholdForIOU = 0.8;
		const [uniqueBoundingBoxes, uniqueConfidenceScores, uniqueLabels] = applyNMS(
			filteredBoundingBoxes,
			filteredConfidenceScore,
			filteredCasslabels,
			thresholdForIOU
		);

		if (filteredBoundingBoxes.length > 0) {
			console.log("Uspech!");
			res.json({ success: true, uniqueBoundingBoxes, uniqueConfidenceScores, uniqueLabels });
		} else {
			console.log("Zhoda sa nenasla");
			res.status(500).json({ success: false, message: "Error identifying object" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Error identifying object" });
	}
};

module.exports = { handleObjectIdentification };
