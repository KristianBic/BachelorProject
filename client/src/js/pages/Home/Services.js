import React from "react";

import vrtnePrace from "../../assets/image/images/analyza.jpg";
import stavebnePrace from "../../assets/image/images/diagnoza.jpg";
import vykopovePrace from "../../assets/image/images/brain_tumor.jpg";
import { ServiceCard } from "./ServiceCard";

const Services = () => {
	return (
		<div className="services">
			<h2>Detekcia objektov na medicínskych snímkach</h2>
			<div className="services-container">
				<ServiceCard
					link="/"
					imageSrc={vrtnePrace}
					imageAlt="Vŕtanie studne"
					heading="Analýza a diagnostika obrazu"
					description="Naše pokročilé algoritmy analyzuju medicínske obrazy pri asistovaní diagnózy"
				/>
				<ServiceCard
					link="/"
					imageSrc={stavebnePrace}
					imageAlt="Stavebné práce"
					heading="Precizia diagnózy"
					description="Ponúkame preciznú diagnózu medicínskych snímok."
				/>
				<ServiceCard
					link="/"
					imageSrc={vykopovePrace}
					imageAlt="Výkopové práce"
					heading="Detekcia tumoru na mozgu"
					description="Pouzívanie technológie neuronových sieti na detekciu nádorov."
				/>
			</div>
		</div>
	);
};

export default Services;
