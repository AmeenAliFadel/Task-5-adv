import { useNavigate, useParams } from "react-router-dom";
import arrow from '../../assets/arrow.svg';
import './ShowItem.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import defaultImage from '../../assets/image.png';

// ShowItem component displays detailed information about a specific product
export default function ShowItem() {
    const navigate = useNavigate(); // React Router navigation hook
    const { id } = useParams();     // Extract product ID from route parameters

    // State to store product data
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        image_url: ''
    });

    // Loading state
    const [isLoading, setIsLoading] = useState(true);

    // Fetch product data when component mounts or ID changes
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token from local storage
                const res = await axios.get(
                    `https://web-production-3ca4c.up.railway.app/api/items/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                // Update product data state with API response
                setProductData({
                    name: res.data.name,
                    price: res.data.price,
                    image_url: res.data.image_url
                });

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false); // Hide spinner after fetching completes
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // Navigate back to products page
    const goBack = () => {
        navigate('/route/products');
    };

    // Display loading spinner while fetching product data
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-container mt-5">
                <Spinner animation="border" role="status" className="custom-spinner" />
                <span className="ms-3 fs-5">Loading product...</span>
            </div>
        );
    }

    // Render product details
    return (
        <>
            <div className="container">
                <div className="show-item">
                    {/* Go back button */}
                    <button onClick={goBack} className="goback-btn btn d-flex justify-content-center align-items-center">
                        <img src={arrow} alt="Go Back" />
                    </button>
                    <h2>{productData.name}</h2>
                </div>

                {/* Product image */}
                <div className="d-flex justify-content-center">
                    <img
                        className="show-img"
                        src={productData.image_url}
                        alt={productData.name}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultImage;
                        }}
                    />
                </div>

                {/* Product price and added date */}
                <div className="show-row2 mt-5 d-flex flex-wrap flex-md-nowrap justify-content-md-between justify-content-center align-items-center">
                    <h3>Price: <span>{productData.price}$</span></h3>
                    <h3>Added at: <span>30/12/2020</span></h3>
                </div>

                {/* Product updated date */}
                <div className="show-row3 mt-5 d-flex justify-content-center align-items-center">
                    <h3>Updated at: <span>30/12/2020</span></h3>
                </div>
            </div>
        </>
    );
}
