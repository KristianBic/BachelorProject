import React from "react";
import galleryBackgroundImage from "../../assets/image/images/mri.jpg";
import EmptyGallery from "../../assets/image/icons/noImages.svg";

const Gallery = () => {
	return (
		<div className="gallery">
			<div className="gallery-image">
				<img src={galleryBackgroundImage} alt="Sídlo Marpalu" />
				<h2>Diagnostika pomocou technológie detekcie objektov</h2>
				<p>
					V medicínskom oblasti sa detekcia objektov na základe hĺbkého učenia stala nevyhnutným nástrojom. Tento nástroj značne podporuje
					zdravotníckych pracovníkov pri identifikácii nezrovnalostí na röntgenových snímkach, MRI skenoch a ďalších lekárskych obrazových
					materiáloch
				</p>
			</div>
		</div>
	);
};

export default Gallery;
