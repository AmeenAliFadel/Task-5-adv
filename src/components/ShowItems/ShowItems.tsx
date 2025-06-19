import './ShowItems.css';
import searchIcon from '../../assets/search.svg';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';
import ConfirmPopup from '../ConfirmLogout/ConfirmPopup';

interface Product {
    id: string;
    name: string;
    image_url: string;
}

export default function ShowItems() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State to hold the search query used for filtering
    const [search, setSearch] = useState('');
    // Ref to access the input element value without causing re-renders
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const [render, setRender] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Navigate to add product page
    const goToAdd = () => navigate('/route/products/additem');

    // Fetch products from API when component mounts or render toggles
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                const res = await axios.get("https://web-production-3ca4c.up.railway.app/api/items", {
                    headers: { Authorization: `Bearer ${token}` }
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

    // Filter products based on current search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredProducts.slice(startIndex, endIndex);

    // Reset current page if filtering reduces the total pages and currentPage is invalid
    useEffect(() => {
        if (currentPage > totalPages && totalPages !== 0) {
            setCurrentPage(1);
        }
    }, [search, filteredProducts, currentPage, totalPages]);

    // Handle delete popup showing
    const handleDeleteRequest = (id: string) => {
        setProductToDelete(id);
        setShowDeletePopup(true);
    };

    // Handle product deletion with loading state and toast feedback
    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            setDeleteLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(`https://web-production-3ca4c.up.railway.app/api/items/${productToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove deleted product from the list without refetching
            setProducts(products.filter(product => product.id !== productToDelete));
            setToastMessage('Product deleted successfully!');
            setShowToast(true);
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setDeleteLoading(false);
            setShowDeletePopup(false);
            setProductToDelete(null);
            setRender(!render); // trigger refetch if needed
        }
    };

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Generate visible pagination numbers with ellipsis (...)
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

    // Handle clicking the search button or pressing enter
    const handleSearch = () => {
        const query = searchInputRef.current?.value.trim() || '';
        setSearch(query);
    };

    // Handle input changes for search box
    // If input is cleared (empty), reset search to show all products
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setSearch('');
        }
    };

    // Handle enter key for triggering search
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
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
                    ref={searchInputRef}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button className="btn" onClick={handleSearch}>
                    <img src={searchIcon} alt="Search icon" />
                </button>
            </div>

            {/* Add Product Button */}
            <div className="container">
                <div className="d-flex justify-content-center justify-content-sm-end mt-5">
                    <button
                        className="btn add-btn btn-warning text-white px-4 py-3 fw-semibold"
                        onClick={goToAdd}
                    >
                        ADD NEW PRODUCT
                    </button>
                </div>

                {/* Product Grid */}
                <div className="all-items d-flex justify-content-center justify-content-xl-start mx-5 flex-wrap mt-3">
                    {currentItems.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        currentItems.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                image_url={product.image_url}
                                onDelete={handleDeleteRequest}
                            />
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
                                    className={`btn pagination-btn rounded-circle px-3 py-1 ${currentPage === page ? 'btn-warning text-white fw-bold' : 'btn-light'
                                        }`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span
                                    key={index}
                                    className="d-flex align-items-center justify-content-center px-2"
                                >
                                    ...
                                </span>
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

            {/* Delete Confirmation Popup */}
            {showDeletePopup && (
                <ConfirmPopup
                    message="Are you sure you want to delete this product?"
                    onConfirm={handleDeleteProduct}
                    onCancel={() => setShowDeletePopup(false)}
                    loading={deleteLoading}
                />
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
                            <div className="toast-body fs-5 fw-semibold">{toastMessage}</div>
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
