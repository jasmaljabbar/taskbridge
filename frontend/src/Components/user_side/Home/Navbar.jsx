import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            alert(`Failed to log out: ${error}`);
        }
    };

    return (
        <nav className="bg-gray-800 fixed top-0 w-full z-10 py-4">
            <div className="container mx-auto md:px-0 px-4 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-white text-2xl font-bold">
                        TaskBridge
                    </Link>

                    {/* Navigation Links */}
                    {isAuthenticated ? (
                        <div className="hidden lg:flex space-x-8">
                            <Link to="/" className="text-white hover:text-gray-300">
                                Services
                            </Link>
                            <Link to="/profile" className="text-white hover:text-gray-300">
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-white hover:text-gray-300"
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <div className="hidden lg:flex space-x-8">
                            <Link to="/" className="text-white hover:text-gray-300">
                                Services
                            </Link>
                            <Link to="/register" className="text-white hover:text-gray-300">
                                Sign Up
                            </Link>
                            <Link to="/login" className="text-white hover:text-gray-300">
                                Log In
                            </Link>
                        </div>
                    )}

                    {/* Become a Tasker Button */}
                    <button className="bg-blue-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-blue-600">
                        Become a Tasker
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Links */}
                {isOpen && (
                    <div className="lg:hidden mt-4 flex flex-col space-y-4">
                        <Link to="/" className="text-white hover:text-gray-300">
                            Services
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="text-white hover:text-gray-300">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:text-gray-300"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="text-white hover:text-gray-300">
                                    Sign Up
                                </Link>
                                <Link to="/login" className="text-white hover:text-gray-300">
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
