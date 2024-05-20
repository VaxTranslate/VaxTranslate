import React from "react";
import Upload from "../img/upload.png";
import "../styles/translate.css";

const Translate = () => {
  return (
    <div className="translate">
      <div className="translate-container">
        <div class="file-upload">
          <div class="image-upload-wrap">
            <img src={Upload} alt="upload" />
            <div class="drag-text">
              <p>Drag and drop items or UPLOAD</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Translate;