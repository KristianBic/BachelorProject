import React from "react";

const Map = () => {
	return (
		<div className="map">
			<div className="map-container">
				<iframe
					height="300"
					id="gmap_canvas"
					src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=%C5%A0t%C3%BArov%C3%A1%201211/63%20kysucke%20nove%20mesto+()&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
				></iframe>
			</div>
		</div>
	);
};

export default Map;
