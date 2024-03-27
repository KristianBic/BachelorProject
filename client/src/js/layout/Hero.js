import React from "react";
import videoVrtnePrace from "../assets/image/images/brain.jpg";
import mainLogo from "../assets/image/images/marpal_png.png";
import { Link } from "react-router-dom";
import Rectangle from "../assets/image/svgs/HeroRectangleBigger.svg";

export default () => {
	return (
		<div className="hero">
			<div className="hero-container">
				<div className="swiper">
					<div className="swiper-wrapper">
						<div className="swiper-slide vrty">
							<div className="mediaContainer">
								<img id="firstVid" className="hero-backgroundImage" src={videoVrtnePrace} alt="Marpal logo" />
								{/*
								<video id="firstVid" className="hero-backgroundImage" autoPlay={true} loop muted>
									<source src={videoVrtnePrace} type="video/mp4" />
								</video>
							
							*/}
							</div>
						</div>
					</div>
					<img className="hero-rectangle" src={Rectangle} alt="Rectangle" />
					<div className="text-Container">
						<div className="text" data-slide_number="1">
							<h1>Detekcia nádoru na mozgu</h1>
							<p>Poskytujeme prvotriednu a profesionálnu detekciu medicínskych snímok pre maximálnu spokojnosť zákazníka.</p>
							<Link className="button" to="/">
								Zisti viac
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
