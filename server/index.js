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
		// Load a pre-trained object detection model (EfficientDet)
		model = await tfconv.loadGraphModel("file://./models/model/model.json");

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

		const resizedTensor = tf.image.resizeBilinear(tensor, [416, 416]);

		// Perform object detection using the loaded model
		if (!model) {
			console.error("Model is not loaded");
			res.status(500).json({ success: false, message: "Error identifying object" });
			return;
		}

		// Perform object detection using the executeAsync() method
		const predictions = await model.executeAsync(resizedTensor);

		// Log the object detection results
		console.log(predictions);
		// Send a response with the object detection results
		res.json({ success: true, predictions });
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
