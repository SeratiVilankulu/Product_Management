import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterStyles from "./Registration.module.css";

const Registration = () => {
	const [userData, setUserData] = useState({
		UserName: "",
		Name: "",
		Surname: "",
		Email: "",
		Password: "",
		ConfirmPassword: "",
	});

	const [errorMsg, setErrorMsg] = useState({});
	const [successMsg, setSuccessMsg] = useState("");
	const [Submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState(false);

	// Validation for password
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
		// Check if all requirements are met
		const isValid = Object.values(passwordRequirements).every(Boolean);
		return { isValid, validationMessage };
	};

	// Handles form submission and validate input
	const validateUserData = async (event) => {
		event.preventDefault();
		setErrorMsg({});
		setSuccessMsg("");

		//Check if username is empty
		let inputError = {};
		if (!userData.UserName) {
			inputError.UserName = "Please enter your user name";
		}
		if (!userData.Name) {
			inputError.Name = "Please enter your First name";
		}
		if (!userData.Surname) {
			inputError.Surname = "Please enter your Last name";
		}

		// Validate Email
		if (!userData.Email) {
			inputError.Email = "Please enter your email address";
		} else if (
			!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.Email)
		) {
			inputError.Email = "Please enter a valid email address";
		}

		//Check if password is empty or valid
		if (!userData.Password) {
			inputError.Password = "Password should not be empty";
		} else {
			const { isValid, validationMessage } = validatePassword(
				userData.Password
			);
			if (!isValid) {
				inputError.Password = validationMessage;
			}
		}
		// Checks if Password and confirmPassword fields match
		if (userData.ConfirmPassword !== userData.Password) {
			inputError.ConfirmPassword = "Passwords do not match";
		}

		if (Object.keys(inputError).length > 0) {
			setErrorMsg(inputError);
			return;
		}

		//Form is being submitted
		setSubmitting(true);

		try {
			const response = await axios.post(
				"http://localhost:5033/account/register",
				{
					Name: userData.Name,
					Surname: userData.Surname,
					UserName: userData.UserName,
					Email: userData.Email,
					Password: userData.Password,
					ConfirmPassword: userData.ConfirmPassword,
				}
			);
			console.log("Response data:", response.data); // Log the response data

			setSuccessMsg(
				"Your account has been successfully created! Please check your emails for verification link"
			);
			setTimeout(() => setOpenModal(true), 2500);
		} catch (error) {
			console.log("Error:", error);

			if (error.response.data) {
				if (
					error.response.data ===
					"You must be at least 16 years old to register."
				) {
					setErrorMsg({
						api: "You must be at least 16 years old to register.",
					});
				} else {
					setErrorMsg({
						api:
							error.response.data || "Registration failed. Please try again.",
					});
				}
			} else {
				setErrorMsg({ api: "Registration failed. Please try again." });
			}
		} finally {
			setSubmitting(false); // Ensure this runs regardless of success or error
		}
	};

	// Function to handle changes in form input fields
	const handleUserInput = (name, value) => {
		setUserData({
			...userData,
			[name]: value,
		});
	};

	const handelBackToLogin = () => {
		navigate("/");
	};

	return (
		<div className={RegisterStyles.registerWrapper}>
			<div className={RegisterStyles.formContainer}>
				<div className={RegisterStyles.headings}>
					<h2>Fresh Farm Fare</h2>
					<p>Come and join the community, there a lot you can find</p>
				</div>
				<form onSubmit={validateUserData} className={RegisterStyles.register}>
					<div className={RegisterStyles.inputWrapper}>
						<div className={RegisterStyles.inputContainer}>
							<label>User Name</label>
							<input
								className={RegisterStyles.longInput}
								type="text"
								placeholder="Enter UserName"
								name="UserName"
								value={userData.UserName}
								onChange={({ target }) =>
									handleUserInput(target.name, target.value)
								}
							/>
						</div>
						<p className={RegisterStyles.errorMessage}>{errorMsg.UserName}</p>

						<div className={RegisterStyles.flexContainer}>
							<div className={RegisterStyles.flexItem}>
								<label>Name</label>
								<input
									type="text"
									placeholder="Enter Name"
									name="Name"
									value={userData.Name}
									onChange={({ target }) =>
										handleUserInput(target.name, target.value)
									}
								/>
								<p className={RegisterStyles.errorMessage}>{errorMsg.Name}</p>
							</div>
							<div className={RegisterStyles.flexItem}>
								<label>Surname</label>
								<input
									type="text"
									name="Surname"
									placeholder="Enter Surname"
									value={userData.Surname}
									onChange={({ target }) =>
										handleUserInput(target.name, target.value)
									}
								/>
								<p className={RegisterStyles.errorMessage}>
									{errorMsg.Surname}
								</p>
							</div>
						</div>
						<div className={RegisterStyles.inputContainer}>
							<div className={RegisterStyles.flexItem}>
								<label>Email Address</label>
								<input
									type="text"
									placeholder="Enter Email"
									name="Email"
									value={userData.Email}
									onChange={({ target }) =>
										handleUserInput(target.name, target.value)
									}
								/>
								<p className={RegisterStyles.errorMessage}>{errorMsg.Email}</p>
							</div>
						</div>
						<div className={RegisterStyles.inputContainer}>
							<label>Password</label>
							<input
								className={RegisterStyles.longInput}
								type="password"
								placeholder="Enter password"
								name="Password"
								value={userData.Password}
								onChange={({ target }) =>
									handleUserInput(target.name, target.value)
								}
							/>
						</div>
						<p className={RegisterStyles.errorMessage}>{errorMsg.Password}</p>

						<div className={RegisterStyles.inputContainer}>
							<label>Confirm Password</label>
							<input
								className={RegisterStyles.longInput}
								type="password"
								placeholder="Enter password"
								name="ConfirmPassword"
								value={userData.ConfirmPassword}
								onChange={({ target }) =>
									handleUserInput(target.name, target.value)
								}
							/>
						</div>
						<p className={RegisterStyles.errorMessage}>
							{errorMsg.ConfirmPassword}
						</p>
						<p className={RegisterStyles.successMessage}>{successMsg}</p>
						<p className={RegisterStyles.errorMessage}>{errorMsg.api}</p>
					</div>

					<p className={RegisterStyles.errorMessage}>
						{errorMsg.TermsAndConditions}
					</p>
					<div className={RegisterStyles.buttonContainer}>
						<button
							type="submit"
							className={RegisterStyles.registerBtn}
							disabled={Submitting}
						>
							Register
						</button>
						<button
							className={RegisterStyles.loginBtn}
							onClick={handelBackToLogin}
						>
							Back to Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Registration;
