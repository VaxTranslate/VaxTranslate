import React from "react";
import Upload from "../img/upload.png";

const Translate = () => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{marginTop: "50px"}}>
      <div className="d-flex align-items-center justify-content-center"> 
        <div className="card shadow p-5 d-flex flex-column align-items-center" style={{ width: "800px", height: "850px", borderRadius: "10px" }}>
          <div className="file-upload  text-center" style={{ backgroundColor: "#E2F0FF", border: "2px dashed #3485FF", cursor: "pointer", borderRadius: "10px", padding: "70px 140px 30px 140px" }}>
            <img src={Upload} alt="upload" className="mb-4" style={{ borderRadius: "10px" }} /> 
            <h5 className="fw-bold text-uppercase">Drag & drop items or UPLOAD</h5> 
            <p className="small text-muted">Supported formats: JPEG, PNG, PDF, SVG, BMP, TIFF, TGA</p>
          </div>
          
          <div className="row mt-4">
            <div className="col">
              <button className="btn btn-outline-primary rounded-pill w-100">Button 1</button>
            </div>
            <div className="col">
              <button className="btn btn-outline-primary rounded-pill w-100">Button 2</button>
            </div>
            <div className="col">
              <button className="btn btn-outline-primary rounded-pill w-100">Button 3</button>
            </div>
            <div className="col">
              <button className="btn btn-outline-primary rounded-pill w-100">Button 4</button>
            </div>
          </div>

          <div className="mt-5">
            <button className="btn btn-primary rounded-pill w-50">Translate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translate;
