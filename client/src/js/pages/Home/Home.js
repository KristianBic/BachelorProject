import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import MainHero from "../../layout/Main_Hero";
import Services from "./Services";
import Statistics from "./Statistics";
import ContactUS from "../../layout/ContactUS";
import "../../../css/Home_style.scss";

const Home = () => {
	return (
		<div>
			<Helmet>
				<title>Home</title>
				<meta name="description" content="This page explains everything about our react app." />
			</Helmet>
			<Navbar />
			<div className="body">
				<MainHero />
				<Services />
				<Statistics />
				<ContactUS />
			</div>
			<Footer />
		</div>
	);
};

export default Home;
