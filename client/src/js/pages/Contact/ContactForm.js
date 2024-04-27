import React from "react";
import mail from "../../assets/image/svgs/mail.svg";
import axios from "axios";

//import v from "../../../../../routes/api/kontakt";
class ContactForm extends React.Component {
	render() {
		return (
			<div className="contact">
				<div className="contact-container">
					<div className="contact-container-left">
						<img src={mail} className="mail one" alt="mail" />
						<img src={mail} className="mail two" alt="mail" />
						<img src={mail} className="mail three" alt="mail" />
						<img src={mail} className="mail four" alt="mail" />
						<h3>Kontaktné informácie</h3>
						<p></p>
						<ul>
							<div className="li-group one">
								<li className="li-caption">Sídlo firmy</li>
								<li>Športová 3151, 02401 KNM</li>
							</div>
							<div className="li-group one">
								<li className="li-caption">Korešpondenčná adresa</li>
								<li>Štúrová 1211/63 02404 KNM</li>
							</div>
							<div className="li-group two">
								<li className="li-caption">IBAN</li>
								<li>SK66 1100 0000 0029 2888 8969</li>
							</div>
							<div className="li-group three">
								<li className="li-caption">Konateľ firmy</li>
								<li>Kristián Bičanovský</li>
							</div>
							<div className="li-group four">
								<li className="li-caption">IČO</li>
								<li>56947035</li>
							</div>
							<div className="li-group five">
								<li className="li-caption">IČ DPH</li>
								<li>SK20237669791</li>
							</div>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

export default ContactForm;
