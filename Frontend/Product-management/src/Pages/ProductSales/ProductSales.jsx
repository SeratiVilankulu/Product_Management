import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import salesStyles from "./ProductSales.module.css";
import SideNavigation from "../Navigation/SideNavigation";
import TopNavigation from "../Navigation/TopNavigation";

const ProductSales = () => {
	const [productSales, setProductSales] = useState([]);
	const [products, setProducts] = useState([]); // State for storing product details
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 10; // Adjusting so there are 10 sale records per page

	// Function to fetch product sales from the database
	useEffect(() => {
		const fetchProductSales = async () => {
			try {
				const response = await axios.get("http://localhost:5033/product-sales");
				setProductSales(response.data);
			} catch (error) {
				console.error("An error occurred while fetching product sales:", error);
			}
		};

		// Function to fetch product details (including names)
		const fetchProducts = async () => {
			try {
				const response = await axios.get("http://localhost:5033/products"); // Assuming this endpoint returns product details
				setProducts(response.data);
			} catch (error) {
				console.error("An error occurred while fetching products:", error);
			}
		};

		fetchProductSales();
		fetchProducts(); // Fetch products separately
	}, []);

	// Pagination
	const pageCount = Math.ceil(productSales.length / itemsPerPage);
	const indexOfFirst = currentPage * itemsPerPage;
	const currentSales = productSales.slice(
		indexOfFirst,
		indexOfFirst + itemsPerPage
	);

	const handlePageClick = ({ selected }) => {
		setCurrentPage(selected);
	};

	// Function to get product name by productId
	const getProductName = (productId) => {
		const product = products.find((p) => p.id === productId);
		return product ? product.productName : "Unknown Product";
	};

	return (
		<div className={salesStyles.salesWrapper}>
			<SideNavigation />
			<div className={salesStyles.salesContainer}>
				<TopNavigation />

				<div className={salesStyles.salesContent}>
					<h2>Sales for all products</h2>

					<div className={salesStyles.salesTable}>
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
												{getProductName(productSale.productId)}{" "}
												{/* Display product name */}
											</h3>
										</td>
										<td>
											<p className={salesStyles.SaleQty}>
												{productSale.saleQty}
											</p>
										</td>
										<td>
											<p className={salesStyles.salePrice}>
												R {productSale.salePrice.toFixed(2)}
											</p>
										</td>
										<td>
											<p className={salesStyles.saleDate}>
												{new Date(productSale.saleDate).toLocaleDateString(
													"en-GB"
												)}
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
		</div>
	);
};

export default ProductSales;
