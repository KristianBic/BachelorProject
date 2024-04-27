import React, { Component } from "react";
import { Link } from "react-router-dom";

export class ServiceCard extends Component {
	render() {
		return (
			<div className="service-card">
				<Link className="service-card-link" to={this.props.link}>
					<div className="img-overlay">
						<img src={this.props.imageSrc} alt={this.props.imageAlt} />
					</div>
					<h3>{this.props.heading}</h3>
					<p>{this.props.description}</p>
					<div className="button">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M2 8.66667H11.4467L9.06 11.06L10 12L14 8L10 4L9.06 4.94L11.4467 7.33333H2V8.66667Z"
								fill="#2E74FF"
							/>
						</svg>
						Zisti viac
					</div>
				</Link>
			</div>
		);
	}
}

export default ServiceCard;
