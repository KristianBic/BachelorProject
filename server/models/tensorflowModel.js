// backend/src/models/tensorflowModel.js
const tf = require("@tensorflow/tfjs-node");

const loadModel = async () => {
	try {
		console.log("Loading TensorFlow model...");
		const model = await tf.loadLayersModel("https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json");
		console.log("TensorFlow model loaded successfully.");
		return model;
	} catch (error) {
		console.error("Error loading TensorFlow model:", error);
		throw error;
	}
};

const identifyObject = async (imageData) => {
	try {
		console.log("Identifying object...");
		console.log("Image Data:", imageData);

		const model = await loadModel();

		if (imageData === undefined) {
			throw new Error("Image data is undefined");
		}

		const dataArray = Array.from(imageData);
		const inputTensor = tf.tensor(dataArray);

		const result = model.predict(inputTensor);
		console.log("Prediction Result:", result);

		return result;
	} catch (error) {
		console.error("Error in identifyObject:", error);
		throw error;
	}
};

module.exports = {
	identifyObject,
};
