const express = require("express");
const router = express.Router();
const objectIdentificationController = require("../controllers/objectIdentificationController");

router.post("/identifyObject", objectIdentificationController.identifyObject);

module.exports = router;
