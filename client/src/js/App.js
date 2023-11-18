import React from "react";
import { Routes, Route } from "react-router-dom";

import NotFound from "../js/pages/NotFound";
import Home from "../js/pages/Home/Home";
import ScrollToTop from "../js/ui/ScrollToTop";
import Login from "../js/pages/Login/Login";
function App() {
	return (
		<div>
			<ScrollToTop>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/*" element={<NotFound />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</ScrollToTop>
		</div>
	);
}

export default App;
