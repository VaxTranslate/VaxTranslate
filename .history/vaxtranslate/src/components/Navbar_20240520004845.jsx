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
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/features">
              <div className={"nav-link"} href="#">
                Translate
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/pricing">
              <div className={"nav-link"} href="#">
                Dashboard
              </div>
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav"> {/* User icon on the right */}
          <li className="nav-item">
            <Link className="nav-link" to="/profile">
              <i className="fas fa-user"></i> {/* Replace with your icon library */}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;