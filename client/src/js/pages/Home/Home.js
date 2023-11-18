import React from "react";
import { Helmet } from "react-helmet";

const Home = () => {
	const [data, setData] = React.useState(null);
	React.useEffect(() => {
		fetch("/api")
			.then((res) => res.json())
			.then((data) => setData(data.message));
	}, []);
	return (
		<div>
			<Helmet>
				<title>Home</title>
				<meta name="description" content="This page explains everything about our react app." />
			</Helmet>
			<h1>Home Pageee5</h1>
			<p>{!data ? "Loading..." : data}</p>
			<p>Hell</p>
		</div>
	);
};
export default Home;
