import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import productStyles from "./Products.module.css";
import TopNavigation from "../Navigation/TopNavigation";
import SideNavigation from "../Navigation/SideNavigation";
import { IoIosClose } from "react-icons/io";

const ProductsDetails = () => {
	const [sales, setSales] = useState([]);
	const [totalQuantity, setTotalQuantity] = useState(0); // State for total quantity
	const [totalCost, setTotalCost] = useState(0); //State for total cost

	const navigate = useNavigate();
	const location = useLocation();
	const { ID } = useParams(); // Get the productId from the URL
	const product = location.state?.product;

	// Function to fetch product sales for the individual product
	useEffect(() => {
		const fetchSales = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5033/product-sales?productId=${ID}`
				);
				setSales(response.data);

				// Calculate the total quantity
				const totalQty = response.data.reduce(
					(sum, sale) => sum + sale.saleQty,
					0
				);
				const totalPrice = response.data.reduce(
					(sum, sale) => sum + sale.saleQty * sale.salePrice,
					0
				);

				setTotalQuantity(totalQty); // Set the total quantity
				setTotalCost(totalPrice);
				console.log(response);
			} catch (error) {
				console.error("An error occurred while fetching product sales:", error);
			}
		};
		if (ID) {
			fetchSales();
		}
	}, [ID]);

	return (
		<div className={productStyles.detailsWrapper}>
			<TopNavigation />
			<SideNavigation />
			<div className={productStyles.detailsContainer}>
				<span className={productStyles.closeBtn} onClick={() => navigate(-1)}>
					<IoIosClose />
				</span>
				<div className={productStyles.productImage}>
					<div className={productStyles.image}>
						<img
							src={product?.image}
							alt={product?.productName || "Product Image"}
							className={productStyles.image}
						/>
					</div>
					<div className={productStyles.productDetails}>
						<h3 className={productStyles.productTitle}>
							{product?.productName}
						</h3>
						<p className={productStyles.productCategory}>{product?.category}</p>
						<p className={productStyles.productPrice}>
							R{product?.salePrice.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
			<div className={productStyles.totalSales}>
				<p>Total Sales</p>
				<br />
				<hr />
				<h2>{totalQuantity}</h2>
			</div>
			<div className={productStyles.totalProducts}>
				<p>Total products bought</p>
				<br />
				<hr />
				<h2>R{totalCost}</h2>
			</div>

			<div className={productStyles.tableContainer}>
				<table className={productStyles.summaryTable}>
					<thead>
						<tr>
							<th>Quantity Sold</th>
							<th>Price</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{sales.length > 0 ? (
							sales.map((productSale, index) => (
								<tr key={index}>
									<td>{productSale.saleQty}</td>
									<td>R{productSale.salePrice.toFixed(2)}</td>
									<td>
										{new Date(productSale.saleDate).toLocaleDateString("en-GB")}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="3">No sales data available for this product.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ProductsDetails;
