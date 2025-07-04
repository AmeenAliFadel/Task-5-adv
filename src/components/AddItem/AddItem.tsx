import { useNavigate } from 'react-router-dom';
import arrow from '../../assets/arrow.svg';
import './AddItem.css';
import UploadIcon from '../../assets/upload.png';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useRef, useState } from 'react';
import axios from 'axios';

export default function AddItem() {
    const navigate = useNavigate();

    // Refs for form fields
    const nameRef = useRef<HTMLInputElement | null>(null);
    const priceRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // State for image preview and uploaded file
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);

    // State for submit button loading
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // State for form errors
    const [errors, setErrors] = useState<{ name?: string; price?: string; image?: string }>({});

    // Handle go back button
    const goBack = () => {
        navigate('/route/products');
    };

    // Handle image file selection and preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setProfileImage(file);
            setErrors(prev => ({ ...prev, image: undefined })); // Clear image error if any
        }
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Get form values
        const name = nameRef.current?.value.trim() || '';
        const price = priceRef.current?.value.trim() || '';

        // Validate fields
        const newErrors: typeof errors = {};

        if (!name) newErrors.name = 'Name is required.';
        if (!price) newErrors.price = 'Price is required.';
        else if (!/^\d+(\.\d{1,2})?$/.test(price)) newErrors.price = 'Price must be a valid number.';
        if (!profileImage) newErrors.image = 'Image is required.';

        setErrors(newErrors);

        // If there are validation errors, stop submission
        if (Object.keys(newErrors).length > 0) return;

        // Prepare form data for request
        const data = new FormData();
        data.append('name', name);
        data.append('price', price);
        data.append('image', profileImage!);
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                "https://web-production-3ca4c.up.railway.app/api/items",
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            console.log("Item added successfully");
            navigate('/route/products'); // Navigate back after successful submission

        } catch (error: any) {
            // Handle server errors
            if (axios.isAxiosError(error)) {
                console.log("Server error:", error.response?.data);
                setErrors(prev => ({
                    ...prev,
                    image: error.response?.data?.errors?.image?.[0] || 'Upload failed.'
                }));
            } else {
                console.log(error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Header section with go back button */}
            <div className="add-item">
                <button onClick={goBack} className="goback-btn btn d-flex justify-content-center align-items-center">
                    <img src={arrow} alt="" />
                </button>
                <h2>ADD NEW ITEM</h2>
            </div>

            {/* Form */}
            <Form onSubmit={handleSubmit} className="d-flex add-page flex-column justify-content-center mt-5 w-100">
                <div className="d-flex flex-wrap flex-md-nowrap gap-3">
                    {/* Name and Price inputs */}
                    <div className="add-sides w-50 gap-3">
                        <Form.Group className="mb-3 w-100">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                ref={nameRef}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="price-input w-100">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Price"
                                ref={priceRef}
                                isInvalid={!!errors.price}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.price}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                    {/* Image upload */}
                    <Form.Group className="add-sides w-50 mb-3">
                        <Form.Label>Profile Picture</Form.Label>
                        <div
                            className={`custom-upload-box custom-upload-box-edit d-flex justify-content-center align-items-center w-100 ${errors.image ? 'border border-danger' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="preview-image" />
                            ) : (
                                <img src={UploadIcon} alt="Upload Icon" className="upload-icon" />
                            )}
                        </div>
                        {errors.image && <div className="text-danger mt-1">{errors.image}</div>}
                        <Form.Control
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                    </Form.Group>
                </div>

                {/* Submit button */}
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
    );
}
