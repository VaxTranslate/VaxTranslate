import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-expand-md navbar-dark bg-primary">
      <a className="navbar-brand" href="#">
        Navbar
      </a>
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
          <li className="nav-item active">
            <Link to="/">
              <div className={"nav-link"} href="#">
                Home
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/features">
              <div className={"nav-link"} href="#">
                Features
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/pricing">
              <div className={"nav-link"} href="#">
                Pricing
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;