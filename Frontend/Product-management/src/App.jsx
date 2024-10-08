import { useState } from "react";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home/Home";
import ProductSales from "./Pages/ProductSales/ProductSales";
import Login from "./Pages/Login/Login";
import Registration from "./Pages/Register/Registration";
import EmailSuccess from "./Pages/Email/EmailSuccess";
import ProductsDetails from "./Pages/Products/ProductsDetails";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/home",
			element: <Home />,
		},
		{
			path: "/product-sales",
			element: <ProductSales />,
		},
		{
			path: "/",
			element: <Login />,
		},
		{
			path: "/register",
			element: <Registration />,
		},
		{
			path: "/email-success",
			element: <EmailSuccess />,
		},
		{
			path: "/product/:ID",
			element: <ProductsDetails />,
		},
	]);
	return <RouterProvider router={router} />;
};

export default App;
