import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import homeStyles from "./Home.module.css";
import { IoMdSearch } from "react-icons/io";
import { BiCartAdd } from "react-icons/bi";
import SideNavigations from "../Navigations/SideNavigations";
import TopNavigations from "../Navigations/TopNavigations";
import ReactPaginate from "react-paginate";

const Home = () => {
	const [products, setProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(0);

	const navigate = useNavigate();
	const itemsPerPage = 10; // Number of products per page

	// Fetch products from the database
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get("http://localhost:5033/products");
				setProducts(response.data);
			} catch (error) {
				setError("An error occurred while fetching products.");
				console.error("An error occurred while fetching products:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	// Filter products based on search term
	const filteredProducts = products.filter((product) =>
		product.productName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Calculate page count
	const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

	// Get the products for the current page
	const indexOfFirst = currentPage * itemsPerPage;
	const currentProducts = filteredProducts.slice(
		indexOfFirst,
		indexOfFirst + itemsPerPage
	);

	// Handle page click
	const handlePageClick = ({ selected }) => {
		setCurrentPage(selected);
	};

	// Function to view product details
	const handleProductClick = (product) => {
		console.log("Navigating to product ID:", product.id);
		if (product.id) {
			navigate(`/product/${product.id}`, { state: { product } });
		} else {
			console.error("Product ID is missing:", product);
		}
	};

	return (
		<div className={homeStyles.homeWrapper}>
			<TopNavigations />
			<SideNavigations />
			<div className={homeStyles.homeContainer}>
				<div className={homeStyles.search}>
					<div className={homeStyles.searchSlogan}>
						<h2>Organic Fruits & Vegetables</h2>
						<p>Get the best and freshest Fruit and Vegetables</p>
					</div>
					<IoMdSearch className={homeStyles.searchIcon} />
					<div className={homeStyles.filter}>
						<input
							type="text"
							placeholder="Search for"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{loading && <p>Loading products...</p>}
				{error && <p>{error}</p>}
				{!loading && filteredProducts.length === 0 && <p>No products found.</p>}

				<div className={homeStyles.productCard}>
					{currentProducts.map((product, index) => (
						<div key={index} className={homeStyles.productDisplay}>
							<img
								src={product.image}
								alt={product.productName || "Product Image"}
								className={homeStyles.image}
								onClick={() => handleProductClick(product)}
							/>
							<div className={homeStyles.imageDetails}>
								<h3
									onClick={() => handleProductClick(product)}
									className={homeStyles.ProductName}
								>
									{product.productName}
									<p className={homeStyles.imagePrice}>R{product.salePrice}</p>
								</h3>
								<h3 className={homeStyles.imageCategory}>
									{product.category}
									<button className={homeStyles.addToCart}>
										Add <BiCartAdd />
									</button>
								</h3>
							</div>
						</div>
					))}
				</div>

				<ReactPaginate
					previousLabel={"Previous"}
					nextLabel={"Next"}
					pageCount={pageCount}
					onPageChange={handlePageClick}
					containerClassName={homeStyles.pagination}
					activeClassName={homeStyles.activePage}
				/>
			</div>
		</div>
	);
};

export default Home;
