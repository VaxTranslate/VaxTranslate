import React from "react";
import Upload from "../img/upload.png";

const Translate = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="card shadow p-5 text-center">
            <div className="file-upload" style={{ backgroundColor: "#E2F0FF", border: "2px dashed #3485FF", cursor: "pointer", borderRadius: "10px", padding: "70px 140px 30px 140px" }}>
              <img src={Upload} alt="upload" className="mb-4" style={{ borderRadius: "10px" }} /> 
              <h5 className="fw-bold text-uppercase">Drag & drop items or UPLOAD</h5> 
              <p className="small text-muted">Supported formats: JPEG, PNG, PDF, SVG, BMP, TIFF, TGA</p>
            </div>
            {/* ... (your other content) ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translate;
