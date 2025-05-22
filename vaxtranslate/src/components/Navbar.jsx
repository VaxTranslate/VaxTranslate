
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Upload, LayoutDashboard, Users } from "lucide-react";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const navigate = useNavigate();

  // Listen for login state changes (including manual event dispatch)
  useEffect(() => {
    const updateLoginState = () => setLoggedIn(localStorage.getItem("loggedIn") === "true");
    window.addEventListener("storage", updateLoginState);
    window.addEventListener("loginStateChanged", updateLoginState); // custom event for same-tab updates
    return () => {
      window.removeEventListener("storage", updateLoginState);
      window.removeEventListener("loginStateChanged", updateLoginState);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
    window.dispatchEvent(new Event("loginStateChanged")); // update all components
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-white/70 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-300 transition-all"
            >
              VAX Translate
            </Link>
          </div>
          <div className="flex items-center">
            <div className="space-x-4 flex">
               {/*
              {[
                { to: "/translate", Icon: Upload, text: "Translate" },
                { to: "/dashboard", Icon: LayoutDashboard, text: "Dashboard" },
                { to: "/community", Icon: Users, text: "Community" }
              ].map(({ to, Icon, text }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-all hover:bg-blue-50 group"
                >
                  <Icon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{text}</span>
                </Link>
              ))}
              */}
              {!loggedIn && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {loggedIn && (
                <>
                  <button
                    onClick={handleDashboard}
                    className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Dashboard
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;