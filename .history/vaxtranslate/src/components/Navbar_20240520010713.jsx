import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#3485FF" }}>
            <Link to="/" className="navbar-brand">
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
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav align-items-center">
                    <li className="nav-item">
                        <Link className="nav-link" to="/translate">Translate</Link> 
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/community">Community</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/profile"><FaUserCircle size={30} /></Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

