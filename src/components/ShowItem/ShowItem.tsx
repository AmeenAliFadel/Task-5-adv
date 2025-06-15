import { useNavigate, useParams } from "react-router-dom";
import arrow from '../../assets/arrow.svg';
import './ShowItem.css'
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";

export default function ShowItem() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [productData, setProductData] = useState({
        name: '',
        price: '',
        image_url: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                let res = await axios.get(`https://web-production-3ca4c.up.railway.app/api/items/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setProductData({
                    name: res.data.name,
                    price: res.data.price,
                    image_url: res.data.image_url
                });

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchProduct();

    }, [id])
    const goBack = () => {
        navigate('/route/products');
    }


    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-container mt-5">
                <Spinner animation="border" role="status" className="custom-spinner" />
                <span className="ms-3 fs-5">Loading product...</span>
            </div>
        );
    }
    return (
        <>
            <div className="container">
                <div className="add-item">
                    <button onClick={goBack} className="goback-btn btn d-flex justify-content-center align-items-center">
                        <img src={arrow} alt="" />
                    </button>
                    <h2>{productData.name}</h2>
                </div>
                <div className=" d-flex justify-content-center ">
                    <img className="show-img" src={productData.image_url} alt="" />
                </div>
                <div className="show-row2 mt-5 d-flex justify-content-between align-items-center">
                    <h3>Price:<span>{productData.price}$</span></h3>
                    <h3>Added at:<span>30/12/2020</span></h3>
                </div>
                <div className="show-row3  mt-5 d-flex justify-content-center align-items-center">
                    <h3>Added at:<span>30/12/2020</span></h3>
                </div>
            </div>

        </>
    )
}
