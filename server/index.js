"use strict";
const express = require("express");
const PORT = process.env.PORT || 8080;
const path = require("path");
const app = express();
const tf = require("@tensorflow/tfjs-node");

//aby ked prepiname medzi /home /about ... aby to fungovalo s reactom
// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
/*
app.use((req, res, next) => {
	if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
		next();
	} else {
		res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
		res.header("Expires", "-1");
		res.header("Pragma", "no-cache");
		res.sendFile(path.join(__dirname, "../client/build", "index.html"));
	}
});
*/
app.get("/api", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.use(express.static(path.join(__dirname, "../client/build"))); //Updating the Node.js runtime to serve the React App

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
	console.log("Press Ctrl+C to quit.");
});
