import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import Logo from '../../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { Toast, ToastContainer } from 'react-bootstrap';


export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');


    const emailRegex = /^\S+@\S+\.\S+$/;

    const validateForm = () => {
        const email = emailRef.current?.value.trim() || '';
        const password = passwordRef.current?.value.trim() || '';
        const newErrors: { [key: string]: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const email = emailRef.current?.value.trim() || '';
        const password = passwordRef.current?.value.trim() || '';
        setLoading(true);

        try {
            const response = await axios.post('https://web-production-3ca4c.up.railway.app/api/login', {
                email,
                password
            });

            const token = response.data.token;
            const userName = response.data.user.user_name;
            const profileImage = response.data.user.profile_image_url;

            localStorage.setItem('token', token);
            localStorage.setItem('user_name', userName);
            localStorage.setItem('profile_image', profileImage);

            setToastVariant('success');
            setToastMessage('Login successful!');
            setShowToast(true);

            setTimeout(() => {
                navigate('/route/products');
            }, 1500);

        } catch (error: any) {
            setToastVariant('danger');
            setToastMessage('Email or password is incorrect');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="form d-flex justify-content-center align-items-center w-100 min-vh-100">
                <div className="Af-form-container d-flex align-items-center flex-column bg-white">
                    <img src={Logo} alt="" />
                    <h1 className='text-uppercase fw-semibold fs-4'>Sign In</h1>
                    <p className='text-secondary small'>Enter your credentials to access your account</p>
                    <Form className='w-100' onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                ref={emailRef}
                                type="email"
                                placeholder="Enter your email"
                                isInvalid={!!errors.email}
                                className="py-3 small"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                ref={passwordRef}
                                type="password"
                                placeholder="Enter your password"
                                isInvalid={!!errors.password}
                                className="py-3 small"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                            className='Af-form-button btn-warning border-0 w-100 py-3 fw-medium text-white'
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Signing in...
                                </>
                            ) : (
                                'SIGN IN'
                            )}
                        </Button>

                    </Form>

                    <p className='text-secondary small mt-3'>
                        Don’t have an account? <span><Link className="text-warning" to="/signup">Create one</Link></span>
                    </p>
                </div>
            </div>
            <ToastContainer position="top-end" className="p-3">
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

        </>
    );
}
