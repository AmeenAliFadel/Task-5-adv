import { Button, Form } from "react-bootstrap";
import arrow from '../../assets/arrow.svg';
import { useEffect, useRef, useState } from "react";
import UploadIcon from '../../assets/upload.png';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './EditItem.css';
import { Spinner, Toast, ToastContainer } from "react-bootstrap";

// EditItem component handles editing an existing product
export default function EditItem() {
    const navigate = useNavigate();  // React Router navigation hook
    const { id } = useParams();      // Extract product ID from route parameters

    // Image preview and file state
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Product data state
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        image_url: ''
    });

    // Form validation errors
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Loading and submitting state
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Toast notification states
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');

    // Fetch product data when component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `https://web-production-3ca4c.up.railway.app/api/items/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Populate form fields with existing product data
                setProductData({
                    name: res.data.name,
                    price: res.data.price,
                    image_url: res.data.image_url
                });
                setPreviewImage(res.data.image_url);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // Navigate back to products list
    const goBack = () => {
        navigate('/route/products');
    };

    // Handle image selection and preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setProfileImage(file);
        }
    };

    // Validate form fields before submission
    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!productData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!productData.price.trim()) {
            errors.price = 'Price is required';
        }
        if (!profileImage && !productData.image_url) {
            errors.image = 'Image is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission and API call to update product
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('price', productData.price);
        formData.append('_method', 'PUT');  // Laravel method override for PUT

        if (profileImage) {
            formData.append('image', profileImage);
        }

        setIsSubmitting(true);

        try {
            await axios.post(
                `https://web-production-3ca4c.up.railway.app/api/items/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setToastVariant('success');
            setToastMessage('Product updated successfully!');
            setShowToast(true);

            // Navigate back after short delay
            setTimeout(() => navigate('/route/products'), 1500);
        } catch (error) {
            setToastVariant('danger');
            setToastMessage('Failed to update product.');
            setShowToast(true);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render loading spinner while fetching data
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-container mt-5">
                <Spinner animation="border" role="status" className="custom-spinner" />
                <span className="ms-3 fs-5">Loading product...</span>
            </div>
        );
    }

    // Render edit form
    return (
        <>
            <div className="edit-item">
                {/* Back button */}
                <button onClick={goBack} className="goback-btn btn d-flex justify-content-center align-items-center">
                    <img src={arrow} alt="Go Back" />
                </button>
                <h2>EDIT ITEM</h2>
            </div>

            {/* Toast notifications */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant} delay={3000} autohide>
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Edit Form */}
            <Form onSubmit={handleSubmit} className="d-flex edit-page flex-column justify-content-center mt-5 w-100">
                <div className="d-flex flex-wrap flex-md-nowrap gap-3">
                    <div className="edit-sides w-50 gap-3">
                        {/* Name Input */}
                        <Form.Group className="mb-3 w-100">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                value={productData.name}
                                isInvalid={!!formErrors.name}
                                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Price Input */}
                        <Form.Group className="price-input w-100">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Price"
                                value={productData.price}
                                isInvalid={!!formErrors.price}
                                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors.price}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    {/* Image Upload */}
                    <Form.Group className="edit-sides w-50 mb-3">
                        <Form.Label>Image</Form.Label>
                        <div
                            className={`custom-upload-box d-flex justify-content-center custom-upload-box-edit w-100 ${formErrors.image ? 'is-invalid' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="preview-image" />
                            ) : (
                                <img src={UploadIcon} alt="Upload Icon" className="upload-icon" />
                            )}
                        </div>
                        {formErrors.image && <div className="invalid-feedback d-block">{formErrors.image}</div>}
                        <Form.Control
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                    </Form.Group>
                </div>

                {/* Submit Button */}
                <Button className="Af-edit-button border-0 mt-3 mx-auto" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                            Loading...
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </Form>
        </>
    );
}
