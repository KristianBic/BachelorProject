import React, { Component } from "react";
import { Link } from "react-router-dom";
import mainLogo from "../assets/image/images/marpal_png.png";

export class SimpleHero extends Component {
	render() {
		return (
			<div className="hero-simple">
				<div className="hero-container">
					<h2>{this.props.title}</h2>
					<p>{this.props.description}</p>
				</div>
			</div>
		);
	}
}

export default SimpleHero;
