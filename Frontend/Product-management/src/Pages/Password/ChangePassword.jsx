import axios from "axios";
import React, { useState } from "react";
import PasswordStyle from "./Password.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ChangePassword = () => {
	const [userData, setUserData] = useState({
		CurrentPassword: "",
		NewPassword: "",
		ConfirmPassword: "",
	});

	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleUserPassword = (name, value) => {
		setUserData({
			...userData,
			[name]: value,
		});
	};

	const validatePassword = (password) => {
		const passwordRequirements = {
			length: password.length >= 8,
			upperCase: /[A-Z]/.test(password),
			lowerCase: /[a-z]/.test(password),
			digit: /[0-9]/.test(password),
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
		const isValid = Object.values(passwordRequirements).every(Boolean);
		return { isValid, validationMessage };
	};

	const validateInputData = async (event) => {
		event.preventDefault();
		setErrorMsg({});
		setSuccessMsg("");

		let inputError = {};
		if (!userData.CurrentPassword) {
			inputError.CurrentPassword = "Current password should not be empty";
		} else {
			const { isValid, validationMessage } = validatePassword(
				userData.CurrentPassword
			);
			if (!isValid) {
				inputError.CurrentPassword = validationMessage;
			}
		}

		if (!userData.NewPassword) {
			inputError.NewPassword = "Field should not be empty";
		} else {
			const { isValid, validationMessage } = validatePassword(
				userData.NewPassword
			);
			if (!isValid) {
				inputError.NewPassword = validationMessage;
			}
		}

		if (!userData.ConfirmPassword) {
			inputError.ConfirmPassword = "Field should not be empty";
		}
		if (userData.NewPassword !== userData.ConfirmPassword) {
			inputError.ConfirmPassword = "Passwords do not match";
		}

		if (Object.keys(inputError).length > 0) {
			setErrorMsg(inputError);
			return;
		}

		setSubmitting(true);

		const changePassword = async () => {
			const user = JSON.parse(localStorage.getItem("user"));

			try {
				const response = await axios.post(
					"http://localhost:5033/api/account/change-password",
					{
						currentPassword: userData.CurrentPassword,
						newPassword: userData.NewPassword,
						confirmPassword: userData.ConfirmPassword,
					},
					{
						headers: {
							Authorization: `Bearer ${user.verificationToken}`,
						},
					}
				);
				console.log("Data Sent to DB:", response);
				if (response.status === 200) {
					setSuccessMsg("Password changed successfully!");
				}
			} catch (error) {
				if (error.response && error.response.data) {
					const apiError = error.response.data;
					if (apiError === "Failed to change password: Incorrect password.") {
						setErrorMsg({
							api: "Failed to change password: Incorrect current password.",
						});
					} else if (
						apiError ===
						"The new password cannot be the same as the current password."
					) {
						setErrorMsg({
							api: "The new password cannot be the same as the old password.",
						});
					} else {
						setErrorMsg({ api: `Failed to reset password.` });
					}
				} else {
					setErrorMsg({ api: "Failed to change password, please try again" });
				}
			} finally {
				setSubmitting(false);
			}
		};

		await changePassword(userData.CurrentPassword, userData.NewPassword);
	};

	return (
		<div className={PasswordStyle.changePasswordWrapper}>
			<div className={PasswordStyle.Container}>
				<form
					className={PasswordStyle.changePasswordForm}
					onSubmit={validateInputData}
				>
					<div className={PasswordStyle.headings}>
						<h2>Change Password</h2>
					</div>
					<div className={PasswordStyle.inputWrapper}>
						<div className={PasswordStyle.inputForm}>
							<label>Current Password</label>
							<input
								type="password"
								placeholder="Enter current password"
								disabled={submitting}
								value={userData.CurrentPassword}
								name="CurrentPassword"
								onChange={({ target }) =>
									handleUserPassword(target.name, target.value)
								}
							/>
						</div>
						{errorMsg.CurrentPassword && (
							<p className={PasswordStyle.errorMessage}>
								{errorMsg.CurrentPassword}
							</p>
						)}
						<div className={PasswordStyle.inputForm}>
							<label>New Password</label>
							<input
								type="password"
								placeholder="Enter new password"
								disabled={submitting}
								value={userData.NewPassword}
								name="NewPassword"
								onChange={({ target }) =>
									handleUserPassword(target.name, target.value)
								}
							/>
						</div>
						{errorMsg.NewPassword && (
							<p className={PasswordStyle.errorMessage}>
								{errorMsg.NewPassword}
							</p>
						)}
						<div className={PasswordStyle.inputForm}>
							<label>Confirm New Password</label>
							<input
								type="password"
								placeholder="Enter new password confirmation"
								disabled={submitting}
								value={userData.ConfirmPassword}
								name="ConfirmPassword"
								onChange={({ target }) =>
									handleUserPassword(target.name, target.value)
								}
							/>
						</div>
					</div>

					<p className={PasswordStyle.errorMessage}>
						{errorMsg.ConfirmPassword}
					</p>
					<p className={PasswordStyle.errorMessage}>{errorMsg.api}</p>
					<p className={PasswordStyle.successMessage}>{successMsg}</p>

					<button
						type="submit"
						className={PasswordStyle.resetPasswordBtn}
						disabled={submitting}
					>
						Change Password
					</button>
				</form>
				<div className={PasswordStyle.btn}>
					<Link navigate="/home" className={PasswordStyle.BackToLogin}>
						<FaArrowLeft className={PasswordStyle.icon} />
						Back To Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ChangePassword;
