import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import productStyles from "./Products.module.css";
import { IoIosClose } from "react-icons/io";

const ProductsDetails = ({ onClose }) => {
	const [sales, setSales] = useState([]);
	const location = useLocation();
	const { id } = useParams(); // Get the productId from the URL
	const product = location.state?.product;

	// Function to fetch product sales for the individual product
	useEffect(() => {
		const fetchSales = async () => {
			try {
				const response = await axios.get(`http://localhost:5033/product-sales`);
				setSales(response.data);
				console.log(response);
			} catch (error) {
				console.error("An error occurred while fetching product sales:", error);
			}
		};
		if (id) {
			fetchSales();
		}
	}, [id]);

	return (
		<div className={productStyles.detailsWrapper}>
			<div className={productStyles.detailsContainer}>
				<span onClick={onClose}>
					<IoIosClose />
				</span>
				<div className={productStyles.producImage}>
					<div className={productStyles.image}>
						<img
							src={product?.image}
							alt={product?.productName || "Product Image"}
							className={productStyles.image}
						/>
					</div>
					<div className={productStyles.producDetails}>
						<h3 className={productStyles.productTitle}>
							{product?.productName}
							<p className={productStyles.productPrice}>
								R{product?.salePrice}
							</p>
						</h3>
						<p className={productStyles.productCategory}>{product?.category}</p>
						<br />
					</div>
				</div>
			</div>

			<div className={productStyles.productSales}>
				<h2>Sales History for {product?.productName}</h2>
				{sales.length > 0 ? (
					<div className={productStyles.sales}>
						{sales.map((productSale, index) => (
							<div key={index} className={productStyles.saleDisplay}>
								<p>
									<strong>Sale ID:</strong> {productSale.saleId}
								</p>
								<p>
									<strong>Quantity Sold:</strong> {productSale.saleQty}
								</p>
								<p>
									<strong>Price:</strong> R{productSale.salePrice}
								</p>
								<p>
									<strong>Date:</strong> {productSale.saleDate}
								</p>
							</div>
						))}
					</div>
				) : (
					<p>No sales data available for this product.</p>
				)}
			</div>
		</div>
	);
};

export default ProductsDetails;
