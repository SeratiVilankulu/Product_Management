import React from "react";
import { useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { BsGraphUpArrow } from "react-icons/bs";
import SideNavStyle from "./SideNav.module.css";

const SideNavigation = () => {
	const navigate = useNavigate();

	return (
		<div className={SideNavStyle.menu}>
			<div className={SideNavStyle.logo}>
				<img src="/Images/FreshFarmFare2.png" alt="Logo" />
			</div>
			<div className={SideNavStyle.sideNav}>
				<button className={SideNavStyle.btn} onClick={() => navigate("/home")}>
					<GoHome className={SideNavStyle.navIcons} />
					Dashboard
				</button>
				<button
					className={SideNavStyle.btn}
					onClick={() => navigate("/product-sales")}
				>
					<BsGraphUpArrow className={SideNavStyle.navIcons} /> Product Sales
				</button>
				
			</div>
		</div>
	);
};

export default SideNavigation;
