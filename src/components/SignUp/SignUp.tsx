import { Button, Form, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Login/Login.css';
import Logo from '../../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import UploadIcon from '../../assets/upload.png';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';

export default function SignUp() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const firstNameRef = useRef<HTMLInputElement | null>(null);
    const lastNameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const passwordConfirmationRef = useRef<HTMLInputElement | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setProfileImage(file);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!firstNameRef.current?.value.trim()) newErrors.firstName = 'First name is required';
        if (!lastNameRef.current?.value.trim()) newErrors.lastName = 'Last name is required';

        const email = emailRef.current?.value.trim() || '';
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        const password = passwordRef.current?.value || '';
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        const confirmPassword = passwordConfirmationRef.current?.value || '';
        if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // setServerError(null); // clear server error before submit
        if (!validateForm()) return;

        const firstName = firstNameRef.current?.value || '';
        const lastName = lastNameRef.current?.value || '';
        const email = emailRef.current?.value || '';
        const password = passwordRef.current?.value || '';
        const passwordConfirmation = passwordConfirmationRef.current?.value || '';
        const userName = `${firstName}_${lastName}`;

        const data = new FormData();
        data.append('first_name', firstName);
        data.append('last_name', lastName);
        data.append('user_name', userName);
        data.append('email', email);
        data.append('password', password);
        data.append('password_confirmation', passwordConfirmation);
        if (profileImage) {
            data.append('profile_image', profileImage);
        }
        setLoading(true);
        try {
            const response = await axios.post(
                'https://web-production-3ca4c.up.railway.app/api/register',
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            const token = response.data.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('user_name', userName);

            // Clear form
            if (firstNameRef.current) firstNameRef.current.value = '';
            if (lastNameRef.current) lastNameRef.current.value = '';
            if (emailRef.current) emailRef.current.value = '';
            if (passwordRef.current) passwordRef.current.value = '';
            if (passwordConfirmationRef.current) passwordConfirmationRef.current.value = '';
            setPreviewImage(null);
            setProfileImage(null);

            // Store profile image
            if (profileImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Image = reader.result as string;
                    localStorage.setItem('profile_image', base64Image);
                    navigate('/route/products');
                };
                reader.readAsDataURL(profileImage);
            } else {
                localStorage.setItem('profile_image', '');
                navigate('/route/products');
            }

        } catch (err: any) {
            const message = err.response?.data?.message || 'An error occurred. Please try again.';
            setToastMessage(message);
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="form d-flex justify-content-center align-items-center w-100 min-vh-100">
                <div className="Af-form-container d-flex align-items-center flex-column bg-white">
                    <img src={Logo} alt="Logo" />
                    <h1>Sign up</h1>
                    <p>Fill in the following fields to create an account.</p>


                    <Form onSubmit={handleSubmit} className="w-100">
                        <div className="d-flex gap-3">
                            <Form.Group className="mb-3 w-100">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control className="py-3 small" type="text" placeholder="First Name" ref={firstNameRef} />
                                {errors.firstName && <p className="text-danger">{errors.firstName}</p>}
                            </Form.Group>
                            <Form.Group className="mb-3 w-100">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control className="py-3 small" type="text" placeholder="Last Name" ref={lastNameRef} />
                                {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className="py-3 small" type="email" placeholder="Enter your email" ref={emailRef} />
                            {errors.email && <p className="text-danger">{errors.email}</p>}
                        </Form.Group>

                        <div className="d-flex gap-3">
                            <Form.Group className="mb-3 w-100">
                                <Form.Label>Password</Form.Label>
                                <Form.Control className="py-3 small" type="password" placeholder="Enter password" ref={passwordRef} />
                                {errors.password && <p className="text-danger">{errors.password}</p>}
                            </Form.Group>
                            <Form.Group className="mb-3 w-100">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control className="py-3 small" type="password" placeholder="Re-enter your password" ref={passwordConfirmationRef} />
                                {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Profile Picture</Form.Label>
                            <div className="custom-upload-box border  rounded d-flex justify-content-center align-items-center" onClick={() => fileInputRef.current?.click()}>
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="preview-image" />
                                ) : (
                                    <img src={UploadIcon} alt="Upload Icon" className="upload-icon" />
                                )}
                            </div>
                            <Form.Control
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="d-none"
                                onChange={handleImageChange}
                            />
                        </Form.Group>

                        <Button className="Af-form-button btn-warning border-0 mt-3 w-100 py-3 fw-medium text-white" type="submit" disabled={loading}>
                            {loading ? (
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
                                'SIGN UP'
                            )}
                        </Button>


                    </Form>

                    <p className="text-secondary small mt-3">
                        Do you have an account? <span><Link className="text-warning" to="/"> Sign in</Link></span>
                    </p>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                className="p-3"
            >
                <Toast
                    bg="danger"
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>


        </>

    );
}
