import React, { useEffect } from "react";
import EmailStyles from "./EmailSuccess.module.css";
import { MdVerified } from "react-icons/md";

const EmailSuccess = ({ redirectUrl }) => {
	useEffect(() => {
		// Redirect to login page after 3 seconds
		const timer = setTimeout(() => {
			window.location.href = "/";
		}, 3000);

		return () => clearTimeout(timer);
	}, [redirectUrl]);

	return (
		<div className={EmailStyles.confirmContainer}>
			<div className={EmailStyles.heading}>
				<h1>
					Email Confirmation was a Success{" "}
					<MdVerified className={EmailStyles.icon} />
				</h1>
			</div>
			<div className={EmailStyles.sentence}>
				{" "}
				<p className={EmailStyles.message}>
					Please wait a moment to be directed to the login page. <br />
					If you are not directed immediately, please click this link below{" "}
				</p>
				<button to="/" className={EmailStyles.BackToLogin}>
					Go back to Login Page
				</button>
			</div>
		</div>
	);
};

export default EmailSuccess;
