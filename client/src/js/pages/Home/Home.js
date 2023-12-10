import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

const Home = () => {
	const [image, setImage] = useState(null);
	const [predictions, setPredictions] = useState([]);
	const canvasRef = useRef(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		setPredictions([]); // Clear previous predictions when a new image is selected
	};

	const handleImageSubmit = async () => {
		try {
			if (!image) {
				console.error("Please select an image");
				return;
			}

			const formData = new FormData();
			formData.append("image", image);

			const response = await axios.post("/api/identify-object", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			const data = response.data;
			console.log(data); // Log the response to the console for debugging

			// Update state with the predictions
			setPredictions(data.boundingBoxes || []);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (predictions.length > 0 && canvasRef.current && image && image.complete) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");

			// Ensure canvas dimensions match the image dimensions
			canvas.width = image.width;
			canvas.height = image.height;

			// Clear previous drawings
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw bounding boxes
			predictions.forEach((bbox) => {
				const [yMin, xMin, yMax, xMax] = bbox;

				// Convert relative coordinates to absolute pixel values
				const absX = xMin * image.width;
				const absY = yMin * image.height;
				const absWidth = (xMax - xMin) * image.width;
				const absHeight = (yMax - yMin) * image.height;

				// Draw bounding box directly on the image
				ctx.strokeStyle = "red";
				ctx.lineWidth = 2;
				ctx.strokeRect(absX, absY, absWidth, absHeight);
			});
			console.log("Bounding Boxes:", predictions);
		}
	}, [predictions, image]);

	const renderBoundingBoxes = () => {
		if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
			return null; // No predictions to render
		}

		return (
			<div style={{ position: "relative", display: "inline-block" }}>
				<img src={URL.createObjectURL(image)} alt="Selected" width="300" style={{ display: "block" }} />
				<canvas
					ref={canvasRef}
					width={image.width}
					height={image.height}
					style={{ position: "absolute", top: 0, left: 0, border: "2px solid red" }}
				></canvas>
			</div>
		);
	};

	return (
		<div>
			<Helmet>
				<title>Home</title>
				<meta name="description" content="This page explains everything about our react app." />
			</Helmet>
			<h1>Home Page</h1>

			<h1>Object Detection</h1>
			<input type="file" accept="image/*" onChange={handleImageChange} />
			<button onClick={handleImageSubmit}>Detect Objects</button>

			{image && (
				<div>
					<h2>Selected Image:</h2>
					<img src={URL.createObjectURL(image)} alt="Selected" width="300" />
					{renderBoundingBoxes()}
				</div>
			)}

			{predictions.length > 0 && (
				<div>
					<h2>Detection Results:</h2>
					<ul>
						{predictions.map((boxes, index) => (
							<li key={index}>
								Object {index + 1}:<br />
								BoundingBox: {boxes.map((coord) => coord).join(" | ")}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Home;
