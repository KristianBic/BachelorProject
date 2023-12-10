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
		if (predictions.length > 0 && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");

			// Clear previous drawings
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw bounding boxes
			predictions.forEach((bbox) => {
				const [x, y, width, height] = bbox;

				// Convert relative coordinates to absolute pixel values
				const absX = x * canvas.width;
				const absY = y * canvas.height;
				const absWidth = width * canvas.width;
				const absHeight = height * canvas.height;

				ctx.strokeStyle = "red";
				ctx.lineWidth = 2;
				ctx.strokeRect(absX, absY, absWidth, absHeight);
			});
		}
	}, [predictions]);

	const renderBoundingBoxes = () => {
		if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
			return null; // No predictions to render
		}

		return (
			<canvas
				ref={canvasRef}
				width={image.width}
				height={image.height}
				style={{ border: "2px solid red", position: "relative", width: "300px" }}
			></canvas>
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
