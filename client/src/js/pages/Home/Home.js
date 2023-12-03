import React, { useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

const Home = () => {
	const [image, setImage] = useState(null);
	const [predictions, setPredictions] = useState([]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
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
			setPredictions(data.predictions || []);
		} catch (error) {
			console.error(error);
		}
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

			{predictions.length > 0 && (
				<div>
					<h2>Detection Results:</h2>
					<ul>
						{predictions.map((prediction, index) => (
							<li key={index}>
								Object {index + 1}:<br />
								BoundingBox: {prediction[0] ? prediction[0].join(", ") : "N/A"}
								<br />
								Score: {Number(prediction["scopeId"]).toFixed(4)}
								<br />
								Class Index: {prediction["id"]}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Home;
