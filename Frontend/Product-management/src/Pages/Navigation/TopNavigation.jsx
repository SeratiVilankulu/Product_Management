import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { LuShoppingBasket } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import TopNavStyle from "./TopNav.module.css";

const TopNavigation = () => {
	const [showProfile, setShowProfile] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	// Retrieve userData from localStorage
	const userData = JSON.parse(localStorage.getItem("user"));

	const handleProfileClick = () => {
		setShowProfile(!showProfile);
	};

	return (
		<div className={TopNavStyle.topNavWrapper}>
			<div className={TopNavStyle.topNav}>
				<button className={TopNavStyle.topBtn}>
					<CgProfile />
					{userData?.email}
					<IoIosArrowDown
						className={TopNavStyle.topNavIcons}
						onClick={handleProfileClick}
					/>
				</button>
				<button className={TopNavStyle.topBtn}>
					Basket
					<LuShoppingBasket className={TopNavStyle.topNavIcons} />
				</button>
			</div>
			{showProfile && (
				<div className={TopNavStyle.profile}>
					<p>{userData?.email}</p>
					<button onClick={() => navigate("/change-password")}>
						Change password
					</button>
				</div>
			)}
		</div>
	);
};

export default TopNavigation;
