import React from "react";
import { Routes, Route } from "react-router-dom";

import NotFound from "../js/pages/NotFound";
import Home from "../js/pages/Home/Home";
import Detection from "../js/pages/Detection/Detection";
import ScrollToTop from "../js/ui/ScrollToTop";
import Login from "../js/pages/Login/Login";
import Gallery from "../js/pages/Galery/References";
import Contact from "../js/pages/Contact/Contact";
function App() {
	return (
		<div>
			<ScrollToTop>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/*" element={<NotFound />} />
					<Route path="/login" element={<Login />} />
					<Route path="/detection" element={<Detection />} />
					<Route path="/galeria" element={<Gallery />} />
					<Route path="/kontakt" element={<Contact />} />
				</Routes>
			</ScrollToTop>
		</div>
	);
}

export default App;
