import React from "react";
import Translate from "./components/Translate";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Result from "./components/Result";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/result" element={<Result />} />
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/" element={<Translate />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;