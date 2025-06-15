import './ShowItems.css';
import searchIcon from '../../assets/search.svg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import defaultImage from '../../assets/image.png';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

export default function ShowItems() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [render, setrender] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [showdeletePopUp, setShowdeletePopUp] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Toast states
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const goToAdd = () => navigate('/route/products/additem');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                const res = await axios.get("https://web-production-3ca4c.up.railway.app/api/items", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(res.data);
            } catch (error) {
                console.error(error);
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [render]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredProducts.slice(startIndex, endIndex);

    useEffect(() => {
        if (currentPage > totalPages && totalPages !== 0) {
            setCurrentPage(1);
        }
    }, [search, filteredProducts]);

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://web-production-3ca4c.up.railway.app/api/items/${productToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(products.filter(product => product.id !== productToDelete));
            setToastMessage('Product deleted successfully!');
            setShowToast(true);
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setShowdeletePopUp(false);
            setProductToDelete(null);
            setrender(!render);
        }
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const getVisiblePageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const left = Math.max(2, currentPage - 1);
        const right = Math.min(totalPages - 1, currentPage + 1);

        pageNumbers.push(1);
        if (left > 2) pageNumbers.push('...');
        for (let i = left; i <= right; i++) {
            pageNumbers.push(i);
        }
        if (right < totalPages - 1) pageNumbers.push('...');
        if (totalPages > 1) pageNumbers.push(totalPages);

        return pageNumbers;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-container mt-5">
                <Spinner animation="border" role="status" className="custom-spinner" />
                <span className="ms-3 fs-5">Loading products...</span>
            </div>
        );
    }
    if (error) return <div>{error}</div>;

    return (
        <>
            {/* Search Box */}
            <div className="search-box d-flex align-items-center justify-content-between border w-100 mx-auto rounded mb-2">
                <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search product by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn">
                    <img src={searchIcon} alt="Search icon" />
                </button>
            </div>

            {/* Add Product Button */}
            <div className="container">
                <div className="d-flex justify-content-end mt-5">
                    <button className="btn add-btn btn-warning text-white px-4 py-3 fw-semibold" onClick={goToAdd}>
                        ADD NEW PRODUCT
                    </button>
                </div>

                {/* Product Grid */}
                <div className="all-items d-flex mx-5 flex-wrap mt-3">
                    {currentItems.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        currentItems.map((product) => (
                            <div key={product.id} className="item-card rounded">
                                <img
                                    className="rounded w-100 h-100"
                                    src={product.image_url}
                                    alt={product.name}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = defaultImage;
                                    }}
                                />
                                <div className="overlay w-100 h-100 d-flex align-items-center justify-content-center flex-column">
                                    <Link className='btn' to={`/route/products/showitem/${product?.id}`} >
                                        <h5>{product.name}</h5>
                                    </Link>

                                    <div className="buttons d-flex align-items-center justify-content-center gap-2">
                                        <Link
                                            className="btn edit-btn btn-warning text-white rounded"
                                            to={`/route/products/edititem/${product?.id}`}>
                                            Edit
                                        </Link>
                                        <button
                                            className="btn delete-btn rounded"
                                            onClick={() => {
                                                setProductToDelete(product.id);
                                                setShowdeletePopUp(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4 gap-2 ">
                        <button
                            className="btn btn-arrow rounded-circle px-3 py-1 "
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            &lt;
                        </button>

                        {getVisiblePageNumbers().map((page, index) =>
                            typeof page === 'number' ? (
                                <button
                                    key={index}
                                    className={`btn pagination-btn rounded-circle px-3 py-1 ${currentPage === page ? 'btn-warning text-white fw-bold' : 'btn-light'}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={index} className="d-flex align-items-center justify-content-center px-2">...</span>
                            )
                        )}

                        <button
                            className="btn btn-arrow rounded-circle px-3 py-1"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showdeletePopUp && (
                <div className="modal-overlay-delete d-flex justify-content-center align-items-center">
                    <div className="modal-box-delete bg-white shadow-lg rounded text-center ">
                        <p className="mb-5">Are you sure you want to delete this product?</p>
                        <div className="d-flex justify-content-between gap-3">
                            <button className="btn modal-btn-delete" onClick={handleDeleteProduct}>Yes</button>
                            <button className="btn modal-btn-delete" onClick={() => setShowdeletePopUp(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Message */}
            {showToast && (
                <div
                    className="position-fixed top-0 start-50 translate-middle-x p-3"
                    style={{ zIndex: 9999, width: 'fit-content' }}
                >
                    <div
                        className="toast show toast-animate align-items-center text-white bg-success border-0 shadow-lg rounded px-4 py-3"
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                    >
                        <div className="d-flex align-items-center">
                            <div className="toast-body fs-5 fw-semibold">
                                {toastMessage}
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white ms-3"
                                onClick={() => setShowToast(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
