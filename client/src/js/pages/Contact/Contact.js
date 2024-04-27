import React from "react";
import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import { SimpleHero } from "../../layout/SimpleHero";
import ContactForm from "./ContactForm";
import Map from "./Map";

import "../../../css/Contact_style.scss";

const Contact = () => {
	return (
		<div>
			<Navbar />
			<div className="body">
				<SimpleHero
					title="Kontaktujte nás"
					description="Ak máte záujem o niektorú z našich služieb, neváhajte využiť náš kontaktný formulár a napíšte nám správu."
				/>
				<ContactForm />
				{/*<Map />*/}
			</div>
			<Footer />
		</div>
	);
};

export default Contact;
