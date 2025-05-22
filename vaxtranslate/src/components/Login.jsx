import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {doc, getDoc} from "firebase/firestore";
import { loginUser } from "../firebaseAuth";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = async(e) =>{
        e.preventDefault();
        setError("");
        try{
            const user = await loginUser(email, password);
            // Fetch user data from Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if(userDoc.exists()){
              const username = userDoc.data().name;
              alert(`Login Successful: Welcome back ${username}`);

              // Set login state in localStorage and notify other components
              localStorage.setItem("loggedIn", "true");
              window.dispatchEvent(new Event("loginStateChanged"));

              // redirect to dashboard
              navigate("/");
                
            }            
        }catch (err){
            if (err.code === "auth/invalid-credential") {
                setError("Invalid email or password. Please try again.");
            }else{
                setError(err.message);
            }
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

      navigate("/");
      
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
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to access your account
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
              Sign in
            </button>
             
             {/* add button login  with google button */}
            <button
              type="button"
              className="group relative w-full flex justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium shadow hover:shadow-md transition"
              onClick={handleGoogleLogin}
            >
            <FcGoogle className="w-5 h-5" />
              Login with Google
            </button> 
             

            <div className="text-sm text-center mt-2">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot your password?
              </a>
            </div>
            <div className="text-sm text-center mt-2">
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Need an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;