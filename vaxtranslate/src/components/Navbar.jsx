import React from "react";
import { Link } from "react-router-dom";
import { User, Upload, LayoutDashboard, Users } from "lucide-react";

const Navbar = () => {
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
            <div className="hidden md:flex space-x-8">
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
              <Link
                to="/login"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

