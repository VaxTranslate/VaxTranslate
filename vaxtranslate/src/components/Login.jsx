import React from 'react';
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function LoginPage() {
  return (
    <div className="bg-blue-300 p-6 rounded-lg shadow-md"> 
        <div>
            <input
              type="text"
              placeholder="Login ID"
              className="w-96 p-2 mb-2 border rounded"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-96 p-2 mb-2 border rounded"
            />
          </div>

          <div>
            <label className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
                Remember me
            </label>
          </div>

            <button className="bg-blue-600 py-2 px-4 rounded">
                Log in
            </button>
          

            <p className="text-sm mt-2">
              By continuing, you agree to the Terms of use and Privacy Policy.
            </p>
            <div className="mt-4">
              <a href="#" className="text-blue-500">
                Forgot your password?
              </a>
              <span className="mx-2">|</span>
              <a href="#" className="text-blue-500">
                Don't have an account? Sign up
              </a>
        </div>
    </div>
  );
}

export default LoginPage;
