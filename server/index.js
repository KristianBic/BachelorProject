"use strict";
const express = require("express");
const PORT = process.env.PORT || 8080;
const path = require("path");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api");
const cors = require("cors");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const tf1 = require("@tensorflow/tfjs-node");

const { createCanvas, loadImage } = require("canvas");
const { loadLayersModel } = require("@tensorflow/tfjs-node");
const fs = require("fs").promises;
const tfconv = require("@tensorflow/tfjs-converter");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//https://raw.githubusercontent.com/hugozanini/TFJS-object-detection/master/models/kangaroo-detector/model.json

let model; // Define model globally

const loadModel = async () => {
	try {
		console.log("Model loading...");
		// Load a pre-trained object detection model (EfficientDet)
		model = await tfconv.loadGraphModel("file://./models/vehicle_model_classes/model.json");
		/*
		model = await tfconv.loadGraphModel(
			"https://raw.githubusercontent.com/hugozanini/TFJS-object-detection/master/models/kangaroo-detector/model.json"
		);
*/
		console.log("Model loaded successfully");
		return model;
	} catch (error) {
		console.error("Error loading the model:", error);
	}
};

loadModel();

app.post("/api/identify-object", upload.single("image"), async (req, res) => {
	try {
		const buffer = req.file.buffer;

		// Save the uploaded image to a file
		const imagePath = "uploads/image.jpg";
		await fs.writeFile(imagePath, buffer);

		// Load the image
		const img = await loadImage(imagePath);
		const canvas = createCanvas(img.width, img.height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		// Convert the image to a TensorFlow tensor
		const tensor = tf.browser.fromPixels(canvas).expandDims();

		//const resizedTensor = tf.image.resizeBilinear(tensor, [416, 416]);

		// Perform object detection using the loaded model
		if (!model) {
			console.error("Model is not loaded");
			res.status(500).json({ success: false, message: "Error identifying object" });
			return;
		}

		const predictions = await model.executeAsync(tensor);

		const boundingBoxesTensor = predictions[2];
		const boundingBoxes = await boundingBoxesTensor.arraySync();

		const confidenceScoresTensor = predictions[1];
		const confidenceScores = confidenceScoresTensor.arraySync();
		const confidenceThreshold = 0.3;

		//const classesTensor = predictions[1];
		//const classes = classesTensor.dataSync();
		const classLabels = ["Class 1", "Ambulance", "Bus", "Car", "Motorcycle", "Truck"];

		const filteredBoundingBoxes = [];
		const filteredCasslabels = [];
		const filteredConfidenceScore = [];

		const confidenceScoresSingles = confidenceScores[0];
		for (let i = 0; i < confidenceScoresSingles.length; i++) {
			for (let j = 0; j < classLabels.length; j++) {
				//console.log(confidenceScoresSingles[i][j]);

				if (confidenceScoresSingles[i][j] >= confidenceThreshold) {
					//console.log("Correct:" + confidenceScoresSingles[i][j]);
					filteredCasslabels.push(classLabels[j]);
					filteredBoundingBoxes.push(boundingBoxes[0][i]);
					filteredConfidenceScore.push(confidenceScoresSingles[i][j]);
				}
			}
		}

		//console.log(filteredBoundingBoxes);
		console.log(filteredConfidenceScore);
		console.log(filteredCasslabels);
		//console.log(classLabels.length);

		if (filteredBoundingBoxes.length > 0) {
			console.log("Uspech!!!!!!!!!!!!!!!!");
			res.json({ success: true, filteredBoundingBoxes });
		} else {
			console.log("Zhoda sa nenasla");
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Error identifying object" });
	}
});
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

app.use("/api", apiRoutes);

app.use(express.static(path.join(__dirname, "../client/build"))); //Updating the Node.js runtime to serve the React App

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
	console.log("Press Ctrl+C to quit.");
});
