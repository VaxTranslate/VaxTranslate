import React from "react";
import "../styles/translate.css";

const Translate = () => {
  return (
    <div className="translate">
      <div className="translate-container">
      <div class="file-upload">
        <div class="image-upload-wrap">
          <input class="file-upload-input" type='file' onchange="readURL(this);" accept="image/*" />
          <div class="drag-text">
            <h3>Drag and drop items or UPLOAD</h3>
          </div>
        </div>
        <div class="file-upload-content">
          <div class="image-title-wrap">
            <button type="button" onclick="removeUpload()" class="remove-image">Remove <span class="image-title">Uploaded Image</span></button>
          </div>
        </div>
      </div>
      </div>
    </div>

  );
};

export default Translate;