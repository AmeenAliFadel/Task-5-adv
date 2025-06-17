import { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Logo from './assets/Logo.png';
import logo2 from './assets/products.svg';
import logo3 from './assets/bookmark.svg';
import logoutIcon from './assets/logout.svg';
import ConfirmPopup from './components/ConfirmLogout/ConfirmPopup';

export default function Dashboard() {
    const navigate = useNavigate();

    // State to store the user's name retrieved from localStorage
    const [userName, setUserName] = useState('');

    // State to store the user's profile image retrieved from localStorage
    const [profileImage, setProfileImage] = useState('');

    // State to control the visibility of the logout confirmation modal
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // State to toggle sidebar visibility on small screens
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch user data from localStorage on component mount
    useEffect(() => {
        const name = localStorage.getItem('user_name');
        const image = localStorage.getItem('profile_image');
        if (name) setUserName(name);
        if (image) setProfileImage(image);
    }, []);

    // Handle logout: clear user data and navigate to login page
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("user_name");
        localStorage.removeItem("profile_image");
        console.log('Logged out');
        navigate('/');
    };

    return (
        <>
            {/* Toggle button for sidebar on small screens */}
            <button
                className={`toggle-sidebar-btn btn d-lg-none m-2mb-3 ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            <div className="d-flex">
                {/* Sidebar navigation */}
                <div className={`sidebar d-flex flex-column justify-content-between align-items-center p-3 ${sidebarOpen ? 'show' : 'hide'}`}>
                    <div className="text-center">
                        <img className="sidebarLogo" src={Logo} alt="Logo" />

                        {/* Display profile image if available */}
                        {profileImage && (
                            <img
                                className="profileImage rounded-circle mt-5"
                                src={profileImage}
                                alt="Profile"
                            />
                        )}

                        {/* Display user name */}
                        <h4 className="mt-3 mb-4">{userName}</h4>

                        {/* Navigation links */}
                        <Nav className="flex-column w-100">
                            <NavLink
                                to="products"
                                onClick={() => setSidebarOpen(false)}
                                className="mt-4 d-flex align-items-center justify-content-center nav-link"
                            >
                                <img className="me-1" src={logo2} alt="" /> Products
                            </NavLink>

                            <NavLink
                                to="favorites"
                                onClick={() => setSidebarOpen(false)}
                                className="mt-4 d-flex align-items-center justify-content-center nav-link"
                            >
                                <img className="me-3" src={logo3} alt="" /> Favorites
                            </NavLink>

                            <NavLink
                                to="orderlist"
                                onClick={() => setSidebarOpen(false)}
                                className="mt-4 d-flex align-items-center justify-content-center nav-link"
                            >
                                <img className="me-3" src={logo3} alt="" /> Order List
                            </NavLink>
                        </Nav>
                    </div>

                    {/* Logout button */}
                    <button className='btn d-flex gap-4' onClick={() => setShowLogoutModal(true)}>
                        logout <img src={logoutIcon} alt="" />
                    </button>
                </div>

                {/* Main content area */}
                <div className="route-outlet p-4 flex-grow-1">
                    <Outlet />
                </div>
            </div>

            {/* Logout confirmation modal */}
            {showLogoutModal && (
                <ConfirmPopup
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutModal(false)}
                    message={'ARE YOU SURE YOU WANT TO LOG OUT?'}
                />
            )}
        </>
    );
}
