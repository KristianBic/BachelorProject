"use strict";
const express = require("express");

const PORT = process.env.PORT || 3001;
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "../client/build"))); //Updating the Node.js runtime to serve the React App

app.get("/home", (req, res) => {
	res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
	console.log("Press Ctrl+C to quit.");
});
