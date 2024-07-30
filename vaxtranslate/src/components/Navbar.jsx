import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-vaxBlue dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse" style={{ textDecoration: 'none' }}>
                    <span className="self-center text-2xl font-medium whitespace-nowrap text-white font-poppins text-center leading-custom-lg">
                        VAX <span className="text-black font-medium leading-custom-lg">Translate</span>
                    </span>
                    
                </Link>

                <button
                    onClick={handleToggle}
                    type="button"
                    className="inline-flex items-center p-2 w-8 h-8 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={`w-full md:block md:w-auto ${isOpen ? 'block' : 'hidden'}`} id="navbar-default">
                    <div className="bg-vaxBlue md:bg-vaxBlue dark:bg-gray-800">
                        <ul className="font-medium flex flex-col p-1 md:p-0 mt-1 rounded-lg bg-vaxBlue md:flex-row md:space-x-6 rtl:space-x-reverse md:mt-0 md:bg-vaxBlue dark:bg-vaxBlue md:dark:vaxBlue font-poppins">
                            <li>
                                <Link
                                    to="/translate"
                                    className="block py-1 px-2 text-gray-900 rounded hover:text-blue-700 md:hover:text-white dark:text-white dark:hover:text-blue-500 text-custom-lg font-medium leading-custom-lg"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Translate
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="block py-1 px-2 text-gray-900 rounded hover:text-blue-700 md:hover:text-white dark:text-white dark:hover:text-blue-500 text-custom-lg font-medium leading-custom-lg"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/community"
                                    className="block py-1 px-2 text-gray-900 rounded hover:text-blue-700 md:hover:text-white dark:text-white dark:hover:text-blue-500 text-custom-lg font-medium leading-custom-lg"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="block py-1 px-2 text-gray-900 rounded hover:text-blue-700 md:hover:text-white dark:text-white dark:hover:text-blue-500 text-custom-lg font-medium leading-custom-lg"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <FaUserCircle size={36} />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
