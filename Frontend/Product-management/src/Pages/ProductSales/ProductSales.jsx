import React, { useEffect, useState } from "react";
import axios from "axios";
import salesStyles from "./ProductSales.module.css";
import SideNavigations from "../Navigations/SideNavigations";

const ProductSales = () => {
	const [productSales, setProductSales] = useState([]);

	// Function to fetch product link from database
	useEffect(() => {
		const fetchProductSales = async () => {
			try {
				const response = await axios.get("http://localhost:5033/product-sales");
				setProductSales(response.data);
				console.log(response);
			} catch (error) {
				console.error("An error occurred while fetching product sales:", error);
			}
		};
		fetchProductSales();
	}, []);

	return (
		<div className={salesStyles.salesWrapper}>
			<SideNavigations />
			<div className={salesStyles.salesContainer}>
				<div className={salesStyles.salesTable}>
					<table>
						<tr>
							<th>Product</th>
							<th>Quantity</th>
							<th>Sale Price</th>
							<th>Sale Date</th>
						</tr>
						<tbody>
							{productSales.map((productSale, index) => (
								<tr key={index} className={salesStyles.saleDisplay}>
									<td>
										<h3 className={salesStyles.productSalesName}>
											{productSale.saleId}
										</h3>
									</td>
									<td>
										<p className={salesStyles.SaleQty}>{productSale.saleQty}</p>
									</td>
									<td>
										<p className={salesStyles.salePrice}>
											R{productSale.salePrice}
										</p>
									</td>
									<td>
										<p className={salesStyles.saleDate}>
											R{productSale.saleDate}
										</p>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProductSales;
