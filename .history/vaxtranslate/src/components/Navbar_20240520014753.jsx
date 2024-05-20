import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", fontFamily: 'Inter, sans-serif', fontWeight: "500" }}>
            <Link to="/" className="navbar-brand ms-30" style={{color: "#3485FF", fontWeight: "bold"}}>
                VAX Translate
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end align-items-center" id="navbarNav">
            <ul className="navbar-nav align-items-center">
                <li className="nav-item mx-2 fw-bold">
                    <Link className="nav-link" to="/translate">Translate</Link>
                </li>
                <li className="nav-item mx-2 fw-bold">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item mx-2 fw-bold">
                    <Link className="nav-link" to="/community">Community</Link>
                </li>
                <li className="nav-item fw-bold d-flex align-items-center me-3" style={{marginTop: "5px"}}>
                    <Link className="nav-link" to="/profile"><FaUserCircle size={30} /></Link>
                </li>
                </ul>
      </div>
    </nav>
  );
};

export default Navbar;

