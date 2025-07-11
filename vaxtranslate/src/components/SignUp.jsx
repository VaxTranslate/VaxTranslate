import React, { useState } from "react";
import { Mail, Lock, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { registerUsers } from "../firebaseAuth";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";



function Register() {
  // Original form data state
    const navigate = useNavigate(); // add this line

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async(e) =>{
        
        e.preventDefault();
        
        setError("");
        if(!email|!password|!fullName){
            setMessage("Please fill in all fields");
            return;
        }
        try{
        const user = await registerUsers(email, password,fullName);
            alert(`Register Successful: Welcome ${fullName}`);
            navigate("/login"); // navigate to login page after successful sign up
            return user;
        }catch (err){
            setError(err.message);
        }
        
    };

  const handleGoogleLogin = async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        alert("Logged in with Google!");
  
        // Set login state in localStorage and notify other components
        localStorage.setItem("loggedIn", "true");
        window.dispatchEvent(new Event("loginStateChanged"));
  
        navigate("/dashboard");
        
      } catch (error) {
        setError(error.message);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              Create account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign up to get started
            </p>
          </div>
          {error && <p className = "error-message">{error}</p>}
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 border-0 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="block w-full pl-11 pr-4 py-3 border-0 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-11 pr-4 py-3 border-0 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium"
            >
              Create account
            </button>
             
             {/* add button login  with google button */}
            <button
              type="button"
              className="group relative w-full flex justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium shadow hover:shadow-md transition"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="w-5 h-5" />
                Sign up with Google
            </button> 
                          

            <div className="text-sm text-center mt-2">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;