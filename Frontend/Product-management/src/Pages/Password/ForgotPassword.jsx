import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PasswordStyles from "./Password.module.css";
import { FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
	const [userEmail, setUserEmail] = useState("");
	const [errorMsg, setErrorMsg] = useState({});
	const [successMsg, setSuccessMsg] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	// Regular expression for email validation
	const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const handleEmailChange = (e) => {
		setUserEmail(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		// Clear previous messages
		setErrorMsg({});
		setSuccessMsg("");

		// Validate email
		if (!userEmail) {
			setErrorMsg({ email: "Email is required" });
			setSubmitting(false);
			return;
		} else if (!emailValidation.test(userEmail)) {
			setErrorMsg({ email: "Please enter a valid email address" });
			setSubmitting(false);
			return;
		}

		// Send email request to server
		try {
			const response = await axios.post(
				"http://localhost:5033/account/forgot-password",
				{
					Email: userEmail,
				}
			);
			setSuccessMsg("Please check your emails for a link to reset password!");
			console.log(response);
		} catch (error) {
			if (error.response) {
				if (error.response.status === 400) {
					setErrorMsg({
						email: "Failed to reset password. Please try again.",
					});
				} else {
					setErrorMsg({
						email: "Failed to reset password. Please try again later.",
					});
				}
			} else {
				setErrorMsg({
					email:
						"There was a problem with sending the resetting password. Please try again later.",
				});
			}
			console.log(error.response);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={PasswordStyles.forgotPasswordWrapper}>
			<div className={PasswordStyles.Container}>
				<form
					className={PasswordStyles.forgotPasswordForm}
					onSubmit={handleSubmit}
				>
					<div className={PasswordStyles.headings}>
						<h2>Forgot Password?</h2>
						<p>No worries, we'll send you further instructions</p>
					</div>
					<div className={PasswordStyles.inputWrapper}>
						<div className={PasswordStyles.inputForm}>
							<label>Email Address</label>
							<input
								type="text"
								placeholder="Enter Email"
								name="Email"
								value={userEmail}
								onChange={handleEmailChange}
							/>
						</div>
						{errorMsg.email && (
							<p className={PasswordStyles.errorMessage}>{errorMsg.email}</p>
						)}
						<p className={PasswordStyles.successMessage}>{successMsg}</p>
					</div>
					<button
						type="submit"
						className={PasswordStyles.forgotPasswordBtn}
						disabled={submitting}
					>
						Send Email
					</button>
				</form>
				<div className={PasswordStyles.btn}>
					<Link to="/" className={PasswordStyles.BackToLogin}>
						<FaArrowLeft className={PasswordStyles.icon} />
						Back To Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
