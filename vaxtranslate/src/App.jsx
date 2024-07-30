import React from "react";
import Translate from "./components/Translate";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import LoginPage from "./components/Login";
import Result from "./components/Result";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import '@fontsource/poppins/400.css'; // Regular weight
import '@fontsource/poppins/700.css'; // Bold weight
import '@fontsource/poppins/500.css'; // Medium weightimport '@fontsource/poppins/500.css'; // Medium weight
import '@fontsource/poppins/400.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/translate" element={<Translate />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/result" element={<Result />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;