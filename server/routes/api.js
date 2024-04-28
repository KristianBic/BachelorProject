const express = require("express");
const router = express.Router();
const { storage } = require("../controllers/objectIdentification"); // Import storage

const multer = require("multer");
const upload = multer({ storage: storage }); // Define multer storage

const { handleObjectIdentification } = require("../controllers/objectIdentification");

router.post("/identify-object", upload.single("image"), handleObjectIdentification);

module.exports = router;
