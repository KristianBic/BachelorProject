import React from "react";
import main_img from "../assets/image/images/Main_hero_img.jpg";

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
								<img id="firstVid" className="hero-backgroundImage" src={main_img} alt="Marpal logo" />
							</div>
						</div>
					</div>
					<img className="hero-rectangle" src={Rectangle} alt="Rectangle" />
					<div className="text-Container">
						<div className="text" data-slide_number="1">
							<h1>Transformujte medicínske obrazy</h1>
							<p>Poskytujeme prvotriednu a profesionálnu detekciu medicínskych snímok pre maximálnu spokojnosť zákazníka.</p>
							<Link className="button" to="/detection">
								Zisti viac
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
