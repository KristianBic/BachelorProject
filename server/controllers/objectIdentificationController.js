const tensorflowModel = require("../models/tensorflowModel");
const multer = require("multer");

const storage = multer.memoryStorage(); // Use memory storage for handling in-memory file data
const upload = multer({ storage: storage });

exports.identifyObject = async (req, res) => {
	try {
		console.log("Identifying object...");
		const result = await tensorflowModel.identifyObject(req.body.buffer);
		console.log("Object identified:", result);

		res.json({ predictions: result });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
