// import React, { useEffect, useState } from "react";
// import productStyles from "./Products.module.css";

import { IoIosClose } from "react-icons/io";

import React from 'react';
import { useLocation } from 'react-router-dom';

const ProductDetails = () => {
    const location = useLocation();
    const product = location.state?.product; // Accessing passed product state

    return (
        <div>
            <h1>{product?.ProductName}</h1>
            <img src={product?.Image} alt={product?.ProductName} />
            <p>{product?.Description}</p>
            <p>Category: {product?.Category}</p>
            <p>Price: R{product?.SalePrice}</p>
        </div>
    );
};

export default ProductDetails;


