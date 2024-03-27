import React, { useState } from "react";
import { Link } from "react-router-dom";
//import { FaBars } from "react-icons/fa";
//import { GrClose } from "react-icons/gr";
//import logo from "../assets/image/svgs/Logo.svg";

import "../assets/style/Navbar_style.css";

const Navbar = () => {
	const [click, setClick] = useState(false);
	const handleClick = () => setClick(!click);

	const [sticky, setSticky] = useState(false);
	const handleSticky = () => {
		if (window.scrollY >= 300) {
			setSticky(true);
		} else {
			setSticky(false);
		}
	};
	window.addEventListener("scroll", handleSticky);

	return (
		<header className={sticky ? "header flex sticky header-scrolled" : "header flex"}>
			<Link to={"/"}>
				Home
				{
					//<img className="header-logo" src={logo} alt="SVG logo image" />
				}
			</Link>
			<nav className={click ? "open" : ""}>
				<div className="mobile-nav-open" onClick={handleClick}>
					{
						//{click ? <GrClose size={30} /> : <FaBars size={30} />}
					}
				</div>
				<ul id="primary-navigation" className="primary-navigation flex">
					<li id="nav_services" className="nav-services">
						<a>Služby</a>
						<ul className="dropdown-content">
							<li>
								<Link to={"/"}>Detekcia nadoru na mozgu</Link>
							</li>
						</ul>
					</li>
					<li>
						<Link to={"/galeria"}>Galéria</Link>
					</li>
					<li className="nav-kontakt">
						<Link to={"/kontakt"}>Kontakt</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Navbar;
