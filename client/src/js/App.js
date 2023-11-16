import React from "react";
import { Routes, Route } from "react-router-dom";

import NotFound from "../js/pages/NotFound";
import Home from "../js/pages/Home/Home";
import ScrollToTop from "../js/ui/ScrollToTop";
function App() {
	return (
		<div>
			<ScrollToTop>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/*" element={<NotFound />} />
				</Routes>
			</ScrollToTop>
		</div>
	);
}

export default App;
