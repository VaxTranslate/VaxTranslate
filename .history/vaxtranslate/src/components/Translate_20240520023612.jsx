import React from "react";
import Upload from "../img/upload.png";

const Translate = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center vh-120">
      <div className="d-flex align-items-center justify-content-center"> 
        <div className="card shadow p-5 d-flex flex-column align-items-center" style={{ width: "800px", height: "850px", borderRadius: "10px" }}>
          <div className="file-upload border border-3 border-dashed rounded-3 p-5 text-center" style={{ backgroundColor: "#E2F0FF", borderColor: "#3485FF", cursor: "pointer", borderRadius: "10px" }}>
            <img src={Upload} alt="upload" className="mb-4" style={{ borderRadius: "10px" }} /> 
            <h4 className="fw-bold text-uppercase">Drag & drop items or UPLOAD</h4> 
            <p className="small text-muted">Supported formats: JPEG, PNG, PDF, SVG, BMP, TIFF, TGA</p>
          </div>
          {/* ... (your other content) ... */}
        </div>
      </div>
    </div>
  );
};

export default Translate;
