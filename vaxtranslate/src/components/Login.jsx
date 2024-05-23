import React from 'react';
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function LoginPage() {
  return (
    
    <div className="login-container">
      <header>
      <div className="flex items-center justify-center mt-20">
      <div className="w-1/3">
      <div
          className="bg-white shadow-md rounded-md p-5 flex flex-col"
          style={{ width: "900px", borderRadius: "10px", margin: "0 auto", marginTop: "50px" }}
        >
        <h1>VAX Translate</h1>
        </div> </div> </div>


        <div className="language-selector">
          EN {/* Language selection icon */}
        </div>
      </header>
      <form className="login-form">
        <div className="input-group">
          <label htmlFor="loginId">Login ID</label>
          <input type="text" id="loginId" placeholder="Enter your login" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" />
          {/* Password visibility toggle */}
        </div>
        <div className="remember-me-checkbox">
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        {/* Submit button should be styled according to the image */}
        {/* Links below styled as per image */}
      </form>
      <footer>
        By continuing, you agree to the Terms of use and Privacy Policy.
        Forgot your password? Don't have an account? Sign up
      </footer>
    </div>
  );
}

export default LoginPage;
