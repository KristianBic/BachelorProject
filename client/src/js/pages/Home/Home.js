import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

const Home = () => {
	const [image, setImage] = useState(null);
	const [predictions, setPredictions] = useState([]);
	const canvasRef = useRef(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		// Ensure that the file is a Blob or File
		if (file instanceof Blob) {
			setImage({
				file: file,
				width: 0, // Set a default value or retrieve the dimensions using another method
				height: 0,
			});

			// Use FileReader to read the image dimensions
			const reader = new FileReader();
			reader.onload = (event) => {
				const img = new Image();
				img.onload = () => {
					// Update the image dimensions
					setImage((prevImage) => ({
						...prevImage,
						width: img.width,
						height: img.height,
					}));
				};
				img.src = event.target.result;
			};

			reader.readAsDataURL(file);
		} else {
			console.error("Please select a valid image");
		}

		setPredictions([]); // Clear previous predictions when a new image is selected
	};

	const handleImageSubmit = async () => {
		try {
			if (!image) {
				console.error("Please select an image");
				return;
			}

			const formData = new FormData();
			formData.append("image", image.file);

			const response = await axios.post("/api/identify-object", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			const data = response.data;
			console.log("works");

			// Update state with the predictions

			setPredictions([data.filteredBoundingBoxes] || []);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (predictions.length > 0 && image) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");

			// Ensure canvas dimensions match the image dimensions
			canvas.width = image.width;
			canvas.height = image.height;

			// Clear previous drawings
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw bounding boxes
			predictions.forEach((bbox, index) => {
				let yMin, xMin, yMax, xMax;
				// Check if bbox is an array or a single value
				if (Array.isArray(bbox)) {
					[yMin, xMin, yMax, xMax] = bbox;
				} else {
					({ yMin, xMin, yMax, xMax } = bbox); // Destructure object properties
				}

				// Convert relative coordinates to absolute pixel values
				const absX = yMin[0] * image.width;
				const absY = yMin[1] * image.height;
				const absWidth = (yMin[2] - yMin[0]) * image.width;
				const absHeight = (yMin[3] - yMin[1]) * image.height;

				// Draw bounding box directly on the image
				ctx.strokeStyle = "red";
				ctx.lineWidth = 2;
				ctx.strokeRect(absX, absY, absWidth, absHeight);
				//console.log(`Object ${index + 1}: BoundingBox [${yMin}, ${xMin}, ${yMax}, ${xMax}]`);
			});
		}
	}, [predictions, image]);

	const renderBoundingBoxes = () => {
		if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
			console.log("No predictions to render");
			return null; // No predictions to render
		}
		console.log("Rendering prediction");

		return (
			<div style={{ position: "relative", display: "inline-block" }}>
				<img src={URL.createObjectURL(image.file)} alt="Selected" width={image.width} style={{ display: "block" }} />
				<canvas
					ref={canvasRef}
					width={image.width}
					height={image.height}
					style={{ position: "absolute", top: 0, left: 0, border: "2px solid black" }}
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
					<img src={URL.createObjectURL(image.file)} alt="Selected" width={image.width} />
					{renderBoundingBoxes()}
				</div>
			)}

			{predictions.length > 0 && (
				<div>
					<h2>Detection Results:</h2>
					<ul>
						{/* 
						{predictions.map((boxes, index) => (
							<li key={index}>
								Object {index + 1}:<br />
								BoundingBox: {boxes.map((coord) => coord).join(" | ")}
							</li>
						))}
						*/}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Home;
