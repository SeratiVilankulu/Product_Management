import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { LuShoppingBasket } from "react-icons/lu";
import TopNavStyle from "./TopNav.module.css";

const TopNavigation = () => {
	// Retrieve userData from localStorage
	const userData = JSON.parse(localStorage.getItem("user"));

	return (
		<div className={TopNavStyle.topNavWrapper}>
			<div className={TopNavStyle.topNav}>
				<button className={TopNavStyle.topBtn}>
					<CgProfile />
					{userData?.email}
					<IoIosArrowDown className={TopNavStyle.topNavIcons} />
				</button>
				<button className={TopNavStyle.topBtn}>
					Basket
					<LuShoppingBasket className={TopNavStyle.topNavIcons} />
				</button>
			</div>
		</div>
	);
};

export default TopNavigation;
