import React from "react";
import { useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { BsGraphUpArrow } from "react-icons/bs";
import SideNavStyle from "./SideNav.module.css";

const SideNavigations = () => {
	const navigate = useNavigate();

	return (
		<div className={SideNavStyle.menu}>
			<div className={SideNavStyle.logo}></div>
			<div className={SideNavStyle.sideNav}>
				<button className={SideNavStyle.btn} onClick={() => navigate("/home")}>
					<GoHome className={SideNavStyle.navIcons} />
					Dahsboard
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

export default SideNavigations;
