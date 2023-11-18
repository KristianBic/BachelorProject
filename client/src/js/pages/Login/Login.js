import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import { USER_REGEX, PWD_REGEX } from "./Regex";
import AuthContext from "../../auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Login = () => {
	const userRef = useRef();
	const errRef = useRef();
	const [user, setUser] = useState("");
	const [pwd, setPwd] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [success, setSuccess] = useState(false);
	const { setAuth } = useContext(AuthContext);

	// State events
	useEffect(() => {
		userRef.current.focus();
	}, []);
	useEffect(() => {
		setErrMsg("");
	}, [user, pwd]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		//TODO: redex prerobit
		const v1 = USER_REGEX.test(user);
		const v2 = PWD_REGEX.test(pwd);
		if (!v1) {
			setErrMsg("Invalid Entry user");
			return;
		} else if (!v2) {
			setErrMsg("Invalid Entry pwd");
			return;
		}

		const data = {
			name: user,
			password: pwd,
		};
	};

	return (
		<>
			<Helmet>
				<title>Login</title>
				<meta name="description" content="This page explains everything about our react app." />
			</Helmet>
			{success ? (
				<section>
					<Navigate to="/nastavenia" />
				</section>
			) : (
				<div className="login-body">
					<div className="admin-container">
						<div className="admin-container-left"></div>
						<div className="admin-container-right">
							<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
								{errMsg}
							</p>
							<form onSubmit={handleSubmit}>
								<h4>Admin dashboard</h4>
								<div className="error"></div>
								<label htmlFor="name">Login</label>
								<input
									type="text"
									placeholder="Meno"
									id="name"
									ref={userRef}
									onChange={(e) => setUser(e.target.value)}
									value={user}
									required
								/>
								<div></div>
								<label>Heslo</label>
								<input type="password" placeholder="Heslo" id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required />
								<div></div>
								<button type="submit" className="loginBtn button">
									Login
								</button>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Login;
