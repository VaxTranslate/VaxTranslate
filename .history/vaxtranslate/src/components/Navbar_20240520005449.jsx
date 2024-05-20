import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg ">
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
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/features">Translate</Link> 
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/pricing">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile">Hello</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;