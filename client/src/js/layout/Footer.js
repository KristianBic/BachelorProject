import React from "react";
import { Link } from "react-router-dom";
import mainLogo from "../assets/image/images/marpal_png.png";

import "../../css/Footer_style.scss";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer-container">
				<div className="footer-columnOfLinks">
					<h4>Odkazy</h4>
					<ul>
						<li>
							<Link className="link" to="/galeria">
								Galéria
							</Link>
						</li>

						<li>
							<Link className="link" to="/kontakt">
								Kontakt
							</Link>
						</li>

						<li>
							<Link className="link" to="/login">
								Prihlásenie
							</Link>
						</li>
					</ul>
				</div>
				<div className="footer-columnOfLinks">
					<h4>Naše služby</h4>
					<ul>
						<li>
							<Link className="link" to="/detekcia">
								Detekcia nádoru na mozgu
							</Link>
						</li>
					</ul>
				</div>
				<div className="footer-columnOfLinks">
					<h4>Sociálne siete</h4>
					<ul>
						<li>
							<a className="link" href="https://www.instagram.com/kristian_bicanovsky/">
								Instagram
							</a>
						</li>
						<li>
							<a className="link" href="https://www.facebook.com/kristian.bicanovsky/">
								Facebook
							</a>
						</li>
					</ul>
				</div>
				<div className="footer-copyright">
					<p>2024 Kristian Bicanovsky © Všetky práva vyhradené.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
