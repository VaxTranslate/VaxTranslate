import React from "react";
import Upload from "../img/upload.png";

const Translate = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow p-5 d-flex" style={{ width: "800px", height: "850px" }}>
        <div className="file-upload border border-3 border-dashed rounded-3 p-5 text-center" style={{ backgroundColor: "#E2F0FF", borderColor: "#3485FF", cursor: "pointer" }}>
          <img src={Upload} alt="upload" className="mb-4" /> 
          <h4 className="fw-bold text-uppercase">Drag & drop items or UPLOAD</h4> 
          <p className="small text-muted">Supported formats: JPEG, PNG, PDF, SVG, BMP, TIFF, TGA</p>
        </div>

        {/* ... (your other content) ... */}
      </div>
    </div>
  );
};

export default Translate;
