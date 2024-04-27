import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Navbar from "../../layout/Navbar";

import Footer from "../../layout/Footer";
import "../../../css/Home_style.scss";
import galleryBackgroundImage from "../../assets/image/images/gallery_home-page.png";
import Main_Hero from "../../layout/Main_Hero";
import Services from "./Services";
import Statistics from "./Statistics";
import Gallery from "./Gallery";
import ContactUS from "../../layout/ContactUS";

const Home = () => {
	return (
		<div>
			<Helmet>
				<title>Home</title>
				<meta name="description" content="This page explains everything about our react app." />
			</Helmet>
			<Navbar />
			<div className="body">
				<Main_Hero />
				<Services />
				<Statistics />

				<ContactUS />
			</div>
			<Footer />
		</div>
	);
};

export default Home;
