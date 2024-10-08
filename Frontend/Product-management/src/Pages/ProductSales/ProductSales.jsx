import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import salesStyles from "./ProductSales.module.css";
import SideNavigations from "../Navigations/SideNavigations";

const ProductSales = () => {
	const [productSales, setProductSales] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 12; // Adjusting so they are 10 sale records per page

	// Function to fetch product sales from database
	useEffect(() => {
		const fetchProductSales = async () => {
			try {
				const response = await axios.get("http://localhost:5033/product-sales");
				setProductSales(response.data);
			} catch (error) {
				console.error("An error occurred while fetching product sales:", error);
			}
		};
		fetchProductSales();
	}, []);

	// Pagination
	const pageCount = Math.ceil(productSales.length / itemsPerPage);
	const indexOfFirst = currentPage * itemsPerPage;
	const currentSales = productSales.slice(indexOfFirst, indexOfFirst + itemsPerPage);

	const handlePageClick = ({ selected }) => {
		setCurrentPage(selected);
	};

	return (
		<div className={salesStyles.salesWrapper}>
			<SideNavigations />
			<div className={salesStyles.salesContainer}>
				<div className={salesStyles.salesTable}>
					<h2>Sales for all products</h2>
					<table>
						<thead>
							<tr>
								<th>Product</th>
								<th>Quantity</th>
								<th>Sale Price</th>
								<th>Sale Date</th>
							</tr>
						</thead>
						<tbody>
							{currentSales.map((productSale, index) => (
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
											{productSale.saleDate}
										</p>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<ReactPaginate
						previousLabel={"Previous"}
						nextLabel={"Next"}
						pageCount={pageCount}
						onPageChange={handlePageClick}
						containerClassName={salesStyles.pagination}
						activePageClassName={salesStyles.activePage}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductSales;
