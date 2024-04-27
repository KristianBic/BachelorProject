import React from "react";
import starIcon from "../../assets/image/svgs/star.svg";
import machineIcon from "../../assets/image/svgs/machines.svg";
import peopleImage from "../../assets/image/svgs/people.svg";

const Statistics = () => {
	return (
		<div className="statistics">
			<div className="statistics-container">
				<div className="single-stat one">
					<div className="single-stat-text">
						<h2>13+</h2>
						<p>Rokov skúsenosti</p>
					</div>
				</div>
				<div className="single-stat">
					<div className="single-stat-text">
						<h2>20</h2>
						<p>Profesionálnych zamestnancov</p>
					</div>
				</div>
				<div className="single-stat three">
					<div className="single-stat-text">
						<h2 className="counter">1000+</h2>
						<p>Spokojných zákaznikov</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Statistics;
