import { Button, Form } from "react-bootstrap";
import arrow from '../../assets/arrow.svg';
import { useEffect, useRef, useState } from "react";
import UploadIcon from '../../assets/upload.png';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './EditItem.css';
import { Spinner } from "react-bootstrap";
import { Toast, ToastContainer } from "react-bootstrap";

export default function EditItem() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        image_url: ''
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


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
                setPreviewImage(res.data.image_url);

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
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setProfileImage(file);
        }
    };

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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('price', productData.price);
        formData.append('_method', 'PUT');
        if (profileImage) formData.append('image', profileImage);
        setIsSubmitting(true);

        try {
            await axios.post(`https://web-production-3ca4c.up.railway.app/api/items/${id}`,
                formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            setToastVariant('success');
            setToastMessage('Product updated successfully!');
            setShowToast(true);
            setTimeout(() => navigate('/route/products'), 1500);
        } catch (error) {
            setToastVariant('danger');
            setToastMessage('Failed to update product.');
            setShowToast(true);
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
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
            <div className="add-item">
                <button onClick={goBack} className="goback-btn btn d-flex justify-content-center align-items-center">
                    <img src={arrow} alt="" />
                </button>
                <h2>EDIT ITEM</h2>
            </div>
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    bg={toastVariant}
                    delay={3000}
                    autohide
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">{toastVariant === 'success' ? 'Success' : 'Error'}</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            <Form onSubmit={handleSubmit} className="d-flex edit-page flex-column justify-content-center mt-5 w-100">
                <div className="d-flex gap-3">
                    <div className="w-50 gap-3">
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

                    <Form.Group className="w-50 mb-3">
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

                <Button className="Af-add-button border-0 mt-3 mx-auto" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Loading...
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>

            </Form>
        </>
    )
}
