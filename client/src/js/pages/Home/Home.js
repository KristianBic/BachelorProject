import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

const Home = () => {
	const [image, setImage] = useState(null);
	const [predictions, setPredictions] = useState([]);
	const [confidence, setConfidence] = useState([]);
	const [label, setLabel] = useState([]);
	const canvasRef = useRef(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		// Ensure that the file is a Blob or File
		if (file instanceof Blob) {
			// Resize the image to 640x640
			resizeImage(file, 640, 640, (resizedImage) => {
				setImage({
					file: resizedImage,
					width: 640,
					height: 640,
				});
			});
		} else {
			console.error("Please select a valid image");
		}

		setPredictions([]); // Clear previous predictions when a new image is selected
		setConfidence([]);
		setLabel([]);
	};
	const resizeImage = (file, maxWidth, maxHeight, callback) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let width = img.width;
				let height = img.height;

				if (width > height) {
					if (width > maxWidth) {
						height *= maxWidth / width;
						width = maxWidth;
					}
				} else {
					if (height > maxHeight) {
						width *= maxHeight / height;
						height = maxHeight;
					}
				}

				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, width, height);

				canvas.toBlob((blob) => {
					callback(blob);
				}, file.type);
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(file);
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

			// Update state with the predictions
			setPredictions([data.uniqueBoundingBoxes] || []);
			setConfidence([data.uniqueConfidenceScores] || []);
			setLabel([data.uniqueLabels] || []);
		} catch (error) {
			console.error(error);
		}
	};

	const saveImage = () => {
		const canvas = canvasRef.current;
		const link = document.createElement("a");
		link.download = "image_with_boxes.png";
		link.href = canvas.toDataURL();
		link.click();
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

			// Draw the original image on the canvas
			const img = new Image();
			img.onload = () => {
				ctx.drawImage(img, 0, 0, image.width, image.height);

				// Draw bounding boxes
				predictions[0].forEach((bbox, index) => {
					let yMin, xMin, yMax, xMax;
					// Check if bbox is an array or a single value
					if (Array.isArray(bbox)) {
						[yMin, xMin, yMax, xMax] = bbox;
					} else {
						({ yMin, xMin, yMax, xMax } = bbox); // Destructure object properties
					}

					const absY = yMin * image.width;
					const absX = xMin * image.height;
					const absHeight = (yMax - yMin) * image.width;
					const absWidth = (xMax - xMin) * image.height;

					// Draw bounding box directly on the image
					ctx.strokeStyle = "red";
					ctx.lineWidth = 2;
					ctx.strokeRect(absX, absY, absWidth, absHeight);

					ctx.fillStyle = "red";
					ctx.font = "14px Arial";
					const confidencePercentage = (confidence[0][index] * 100).toFixed(2);
					ctx.fillText(`${label[0][index]} [ ${confidencePercentage} %]`, absX, absY - 5);
				});
			};
			img.src = URL.createObjectURL(image.file);
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
			{predictions.length > 0 && <button onClick={saveImage}>Save Image</button>}

			{image && (
				<div>
					<h2>Selected Image:</h2>
					<img src={URL.createObjectURL(image.file)} alt="Selected" width={image.width} />
					{renderBoundingBoxes()}
				</div>
			)}
		</div>
	);
};

export default Home;
