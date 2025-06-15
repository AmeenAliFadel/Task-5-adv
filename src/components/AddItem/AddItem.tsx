import { useNavigate } from 'react-router-dom';
import arrow from '../../assets/arrow.svg';
import './AddItem.css';
import UploadIcon from '../../assets/upload.png';
import { Button, Form } from 'react-bootstrap';
import { useRef, useState } from 'react';
import axios from 'axios';

export default function AddItem() {
    const navigate = useNavigate();
    const nameRef = useRef<HTMLInputElement | null>(null);
    const priceRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);

    const [errors, setErrors] = useState<{ name?: string; price?: string; image?: string }>({});

    const goBack = () => {
        navigate('/route/products');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setProfileImage(file);
            setErrors(prev => ({ ...prev, image: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const name = nameRef.current?.value.trim() || '';
        const price = priceRef.current?.value.trim() || '';

        const newErrors: typeof errors = {};

        if (!name) newErrors.name = 'Name is required.';
        if (!price) newErrors.price = 'Price is required.';
        else if (!/^\d+(\.\d{1,2})?$/.test(price)) newErrors.price = 'Price must be a valid number.';
        if (!profileImage) newErrors.image = 'Image is required.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const data = new FormData();
        data.append('name', name);
        data.append('price', price);
        data.append('image', profileImage!);

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
            navigate('/route/products');


        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.log("Server error:", error.response?.data);
                setErrors(prev => ({ ...prev, image: error.response?.data?.errors?.image?.[0] || 'Upload failed.' }));
            } else {
                console.log(error);
            }
        }
    };

    return (
        <>
            <div className="add-item">
                <button onClick={goBack} className="goback-btn btn d-flex justify-content-center align-items-center">
                    <img src={arrow} alt="" />
                </button>
                <h2>ADD NEW ITEM</h2>
            </div>

            <Form onSubmit={handleSubmit} className="d-flex add-page flex-column justify-content-center mt-5 w-100">
                <div className="d-flex gap-3">
                    <div className="w-50 gap-3">
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

                    <Form.Group className="w-50 mb-3">
                        <Form.Label>Profile Picture</Form.Label>
                        <div
                            className={`custom-upload-box custom-upload-box-edit w-100 ${errors.image ? 'border border-danger' : ''}`}
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

                <Button className="Af-add-button border-0 mt-3 mx-auto" type="submit">
                    Save
                </Button>
            </Form>
        </>
    );
}
