import React, {useRef, useState} from "react";
import Upload from "../img/upload.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Translate = () => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); 
    setSelectedFiles(files);
  };

  const handleFileDelete = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };


  return (
    <div className="d-flex align-items-center justify-content-center" style={{marginTop: "50px"}}>
      <div className="d-flex align-items-center justify-content-center"> 
        <div className="card shadow p-5 d-flex flex-column align-items-center" style={{ width: "100%", maxWidth: "800px", height: "650px", borderRadius: "10px" }}>
          <div onClick={handleFileUploadClick}  className="file-upload  text-center" style={{ backgroundColor: "#E2F0FF", border: "2px dashed #3485FF", cursor: "pointer", borderRadius: "10px", padding: "70px 140px 30px 140px" }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={handleFileChange} 
            />
            <img src={Upload} alt="upload" className="mb-4" style={{ borderRadius: "10px", width: "100px" }} /> 
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


          <div className="mt-4 w-100">
            {selectedFiles.map((file, index) => (
              <div key={index} className="d-flex align-items-center border rounded p-2 mb-2">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="uploaded" 
                  style={{ width: "50px", marginRight: "20px" }} 
                />
                <span className="mr-auto">{file.name}</span>
                <button onClick={() => handleFileDelete(index)} className="btn btn-link p-0">
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <button className="btn btn-primary btn-lg rounded-pill" style={{boxShadow: "0 2px 4px rgba(0,0,0,0.2)", padding: "10px 80px 10px 80px", marginTop: "50px"}}>Translate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translate;
