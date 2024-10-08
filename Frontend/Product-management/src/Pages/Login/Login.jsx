import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginStyles from "./Login.module.css";

const Login = () => {
	const [userInput, setUserInput] = useState({
		Email: "",
		Password: "",
	});

	const [errorMsg, setErrorMsg] = useState({});
	const [successMsg, setSuccessMsg] = useState("");
	const [Submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleUserInput = (name, value) => {
		setUserInput({
			...userInput,
			[name]: value,
		});
	};

	const validateFormSubmit = async (event) => {
		event.preventDefault();
		setErrorMsg({});
		setSuccessMsg("");

		let inputError = {};
		if (!userInput.Email) {
			inputError.Email = "Email cannot be empty";
		}
		if (!userInput.Password) {
			inputError.Password = "Password cannot be empty";
		}

		if (Object.keys(inputError).length > 0) {
			setErrorMsg(inputError);
			return;
		}

		setSubmitting(true);

		try {
			var userData = await axios.post("http://localhost:5033/account/login", {
				Email: userInput.Email,
				Password: userInput.Password,
			});

			console.log(userData);
			localStorage.setItem("user", JSON.stringify(userData.data));
			setSuccessMsg("Credentials Valid!");
			setTimeout(() => navigate("/home"), 1500);
		} catch (error) {
			console.log(error);

			if (error.response) {
				if (error.response.status === 401) {
					setErrorMsg({
						api: error.response.data.message || "Invalid credentials.",
					});
				} else if (error.response.status === 400) {
					setErrorMsg({
						api:
							error.response.data ||
							"Email has not been verified. Please check your email and verify your account.",
					});
				} else {
					setErrorMsg({ api: "Login failed. Please try again." });
				}
			} else {
				setErrorMsg({ api: "An error occurred. Please try again." });
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={LoginStyles.loginWrapper}>
			<div className={LoginStyles.loginContainer}>
				<div className={LoginStyles.formContainer}>
					<div className={LoginStyles.login}>
						<div className={LoginStyles.headings}>
							<h2>
								Welcome to <br />
								<span className={LoginStyles.name}>Fresh Farm Fare</span>
							</h2>
							<p>Sign In</p>
						</div>
						<div className={LoginStyles.inputWrapper}>
							<div className={LoginStyles.inputContainer}>
								<label>Email Address</label>
								<input
									type="text"
									placeholder="Enter Email"
									name="Email"
									value={userInput.Email}
									onChange={(e) => handleUserInput("Email", e.target.value)}
								/>
							</div>
							<p className={LoginStyles.errorMessage}>{errorMsg.Email}</p>

							<div className={LoginStyles.inputContainer}>
								<label>Password</label>
								<input
									type="password"
									placeholder="Enter Password"
									name="Password"
									value={userInput.Password}
									onChange={(e) => handleUserInput("Password", e.target.value)}
								/>
							</div>
							<p className={LoginStyles.errorMessage}>{errorMsg.Password}</p>
							{errorMsg.api && (
								<p className={LoginStyles.errorMessage}>{errorMsg.api}</p>
							)}
							{successMsg && (
								<p className={LoginStyles.successMessage}>{successMsg}</p>
							)}
							<div className={LoginStyles.forgotPassword}>
								<Link to="forgot-password">Forgot Password</Link>
							</div>
						</div>
						<div className={LoginStyles.buttonContainer}>
							<button
								className={LoginStyles.signIn}
								onClick={validateFormSubmit}
								disabled={Submitting}
							>
								Sign In
							</button>
						</div>
						<Link to="/register" className={LoginStyles.registerLink}>
							Register
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
