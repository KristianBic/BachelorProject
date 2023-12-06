// BoundingBox.js
import React from "react";

const BoundingBox = ({ box, key }) => {
	const [x, y, width, height] = box;
	const boundingBoxStyle = {
		position: "absolute",
		border: "2px solid red",
		left: `${x * 100}%`,
		top: `${y * 100}%`,
		width: `${width * 100}%`,
		height: `${height * 100}%`,
	};

	return <div key={key} style={boundingBoxStyle}></div>;
};

export default BoundingBox;
