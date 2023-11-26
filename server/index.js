"use strict";
const express = require("express");
const PORT = process.env.PORT || 8080;
const path = require("path");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api");
const cors = require("cors");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const { createCanvas, loadImage } = require("canvas");
const { loadLayersModel } = require("@tensorflow/tfjs-node");
const fs = require("fs").promises;
const tfconv = require("@tensorflow/tfjs-converter");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let model;

const loadModel = async () => {
	try {
		const modelUrl = "https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/2";
		model = await tfconv.loadGraphModel(modelUrl, { fromTFHub: true });
		console.log("Model loaded successfully");
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
		const tensor = tf.browser.fromPixels(canvas).resizeNearestNeighbor([224, 224]).expandDims();

		// Preprocess the image (normalize pixel values)
		const meanImageNetRGB = tf.tensor1d([123.68, 116.779, 103.939]);
		const processedTensor = tensor.sub(meanImageNetRGB).div(255);

		// Perform image classification using MobileNetV2
		if (!model) {
			console.error("Model is not loaded");
			res.status(500).json({ success: false, message: "Error identifying object" });
			return;
		}

		const predictions = model.predict(processedTensor);

		// Get the top 3 predictions
		const topPredictions = Array.from(predictions.dataSync())
			.map((probability, index) => ({ class: index, probability }))
			.sort((a, b) => b.probability - a.probability)
			.slice(0, 3);

		// Log the top predictions
		console.log(topPredictions);

		// Send a response with the top predictions
		res.json({ success: true, predictions: topPredictions });

		// Perform image classification using MobileNetV2
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
