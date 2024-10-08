import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PasswordStyles from "./Password.module.css";
import { FaArrowLeft } from "react-icons/fa";

const ResetPassword = () => {
	const [userPasswords, setUserPasswords] = useState({
		NewPassword: "",
		ConfirmPassword: "",
	});
	const [errorMsg, setErrorMsg] = useState({});
	const [successMsg, setSuccessMsg] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	// Extract query parameters from the URL
	const urlParams = new URLSearchParams(window.location.search);
	const token = decodeURIComponent(urlParams.get("token")); // Token received from the reset link
	const AppUserId = urlParams.get("userId"); // User ID received from the reset link

	const passwordValidation = (password) => {
		const passwordRequirements = {
			length: password.length >= 8,
			upperCase: /[A-Z]/.test(password),
			lowerCase: /[a-z]/.test(password),
			digit: /\d/.test(password),
			specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		};

		let validationMessage = "";
		if (!passwordRequirements.length) {
			validationMessage = "Password must be at least 8 characters long.";
		} else if (!passwordRequirements.upperCase) {
			validationMessage =
				"Password must include at least one uppercase letter.";
		} else if (!passwordRequirements.lowerCase) {
			validationMessage =
				"Password must include at least one lowercase letter.";
		} else if (!passwordRequirements.digit) {
			validationMessage = "Password must include at least one digit.";
		} else if (!passwordRequirements.specialChar) {
			validationMessage =
				"Password must include at least one special character.";
		}
		// Check if all requirements are met
		const isValid = Object.values(passwordRequirements).every(Boolean);
		return { isValid, validationMessage };
	};

	const handlePasswordChange = (e) => {
		setUserPasswords({ ...userPasswords, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		// Clear previous messages
		setErrorMsg({});
		setSuccessMsg("");

		// Validate new password
		const { NewPassword, ConfirmPassword } = userPasswords;
		const { isValid, validationMessage } = passwordValidation(NewPassword);

		if (!isValid) {
			setErrorMsg({ password: validationMessage });
			setSubmitting(false);
			return;
		}

		// Check if the confirm password matches
		if (NewPassword !== ConfirmPassword) {
			setErrorMsg({ confirmPassword: "Passwords do not match" });
			setSubmitting(false);
			return;
		}

		try {
			// Make API request to reset password
			const response = await axios.post(
				"http://localhost:5033/account/reset-password",
				{
					AppUserId,
					token,
					NewPassword: NewPassword,
					ConfirmPassword: ConfirmPassword,
				}
			);

			console.log(response);

			// If successful, show success message
			setSuccessMsg("Your password has been reset successfully.");
			setTimeout(() => navigate("/"), 3500); // Redirect to login page once successful
		} catch (error) {
			if (error.response) {
				// Check if the error message is related to the password being the same as the old one
				if (
					error.response.data ===
					"The new password cannot be the same as the old password."
				) {
					setErrorMsg({
						password:
							"The new password cannot be the same as the old one. Please choose a different password.",
					});
				} else if (error.response.status === 400) {
					setErrorMsg({
						password:
							"User ID has not been found, please enter the email you registered with.",
					});
				} else {
					setErrorMsg({
						password: "Failed to change password. Please try again later.",
					});
				}
			} else {
				// Handle non-response errors (like network errors)
				setErrorMsg({
					password:
						"There was a problem with changing your password. Please try again later.",
				});
			}
			console.log(error.response);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={PasswordStyles.resetPasswordWrapper}>
			<div className={PasswordStyles.Container}>
				<form
					className={PasswordStyles.resetPasswordForm}
					onSubmit={handleSubmit}
				>
					<div className={PasswordStyles.headings}>
						<h2>Reset Password</h2>
						<p>Enter your new password below.</p>
					</div>
					<div className={PasswordStyles.inputWrapper}>
						<div className={PasswordStyles.inputForm}>
							<label>New Password</label>
							<input
								type="password"
								placeholder="Enter New Password"
								name="NewPassword"
								value={userPasswords.NewPassword}
								onChange={handlePasswordChange}
							/>
						</div>
						{errorMsg.password && (
							<p className={PasswordStyles.errorMessage}>{errorMsg.password}</p>
						)}
						<div className={PasswordStyles.inputForm}>
							<label>Confirm New Password</label>
							<input
								type="password"
								placeholder="Confirm New Password"
								name="ConfirmPassword"
								value={userPasswords.ConfirmPassword}
								onChange={handlePasswordChange}
							/>
						</div>
						{errorMsg.confirmPassword && (
							<p className={PasswordStyles.errorMessage}>
								{errorMsg.confirmPassword}
							</p>
						)}
					</div>
					<div className={PasswordStyles.resetPassword}>
						<p className={PasswordStyles.successMessage}>{successMsg}</p>

						<button
							type="submit"
							className={PasswordStyles.resetPasswordBtn}
							disabled={submitting}
						>
							Reset Password
						</button>
					</div>
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

export default ResetPassword;
