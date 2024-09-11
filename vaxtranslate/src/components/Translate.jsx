import React, { useRef, useState } from "react";
import Upload from "../img/upload.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { PropagateLoader } from 'react-spinners';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../App.css";

const Translate = () => {
  const navigate = useNavigate(); 
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [translatedImage, setTranslatedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleFileDelete = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileUpload = async () => {
    setLoading(true);
    if (selectedFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFiles[0]);

    try {
      const response = await axios.post(
        "http://18.119.124.175/upload",
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const imageBlob = response.data;
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setTranslatedImage(imageObjectURL);
      setLoading(false);
      navigate('/result', { state: { translatedImage: imageObjectURL } });
    } catch (error) {
      console.error("There was an error uploading the file!", error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-1/3">
        <div
          className="bg-white shadow-md rounded-md p-5 flex flex-col"
          style={{
            width: "900px",
            borderRadius: "10px",
            margin: "0 auto",
            marginTop: "50px",
          }}
        >
          <div
            onClick={handleFileUploadClick}
            className="file-upload text-center"
            style={{
              backgroundColor: "#E2F0FF",
              border: "2px dashed #3485FF",
              cursor: "pointer",
              borderRadius: "10px",
              padding: "70px 140px 30px 140px",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".png, .pdf"
              onChange={handleFileChange}
            />
            <img
              src={Upload}
              alt="upload"
              className="mb-4"
              style={{ borderRadius: "10px", width: "100px" }}
            />
            <div className="flex items-center">
              <h5 className="font-bold text-uppercase">
                Drag & drop items or UPLOAD
              </h5>
              <p className="text-sm text-gray-500 ml-2">
                Supported formats: JPEG, PNG, PDF, SVG, BMP, TIFF, TGA
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-between w-full">
            <button className="btn btn-outline-primary rounded-pill w-1/4 mr-4">
              Button 1
            </button>
            <button className="btn btn-outline-primary rounded-pill w-1/4 mr-4">
              Button 2
            </button>
            <button className="btn btn-outline-primary rounded-pill w-1/4 mr-4">
              Button 3
            </button>
            <button className="btn btn-outline-primary rounded-pill w-1/4">
              Button 4
            </button>
          </div>

          <div
            className="mt-4 file-list"
            style={{
              width: "600px",
              margin: "0 auto",
              maxHeight: "192px",
              overflowY: "auto",
            }}
          >
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #eee",
                  padding: "8px",
                  marginBottom: "8px",
                  borderRadius: "5px",
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="uploaded"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    marginRight: "15px",
                  }}
                />
                <div>
                  <span>{file.name}</span>
                </div>
                <button
                  onClick={() => handleFileDelete(index)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0",
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ fontSize: "1.2rem", marginRight: "10px" }}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <button
              onClick={handleFileUpload}
              className="btn btn-primary btn-lg rounded-pill"
              style={{
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                padding: "10px 80px 10px 80px",
                marginTop: "50px",
              }}
            >
              Translate
            </button>
          </div>
          {loading && (
            <div style={{ marginTop: "30px" }}>
              <PropagateLoader color="#3485FF" />
            </div>
          )
          }    
        </div>
      </div>
    </div>
  );
};

export default Translate;
