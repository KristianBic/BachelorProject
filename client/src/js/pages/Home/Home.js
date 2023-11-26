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

			const response = await fetch("/api/identify-object", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();
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
			<h1>Home Pageee</h1>

			<h1>Image Classification</h1>
			<input type="file" accept="image/*" onChange={handleImageChange} />
			<button onClick={handleImageSubmit}>Classify Image</button>

			{predictions.length > 0 && (
				<div>
					<h2>Predictions:</h2>
					<ul>
						{predictions.map((prediction, index) => (
							<li key={index}>
								Class {prediction.class}: {Number(prediction.probability).toFixed(4)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
export default Home;
