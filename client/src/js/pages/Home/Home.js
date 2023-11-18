import React from "react";

const Home = () => {
	const [data, setData] = React.useState(null);
	React.useEffect(() => {
		fetch("/api")
			.then((res) => res.json())
			.then((data) => setData(data.message));
	}, []);
	return (
		<div>
			<h1>Home Pageee5</h1>
			<p>{!data ? "Loading..." : data}</p>
			<p>Hell</p>
		</div>
	);
};
export default Home;
