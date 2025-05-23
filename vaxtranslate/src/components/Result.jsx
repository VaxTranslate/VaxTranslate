import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Eye, FileText, ToggleLeft, ToggleRight } from "lucide-react";
import CISResult from "./CISResult";

const SideBySideView = ({ originalImage, translatedImage }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-500" />
          Original Document
        </h3>
        <div className="relative">
          {originalImage ? (
            <img
              src={originalImage}
              alt="Original document"
              className="w-full h-auto rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Original document not available</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-green-500" />
          With Translation Overlay
        </h3>
        <div className="relative">
          {translatedImage ? (
            <img
              src={translatedImage}
              alt="Document with translation overlay"
              className="w-full h-auto rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Translated overlay not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ViewToggle = ({ currentView, onToggle }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-gray-100 rounded-lg p-1 flex items-center">
        <button
          onClick={() => onToggle('structured')}
          className={`px-4 py-2 rounded-md flex items-center transition-all duration-200 ${
            currentView === 'structured'
              ? 'bg-white shadow-sm text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Structured View
        </button>
        <button
          onClick={() => onToggle('visual')}
          className={`px-4 py-2 rounded-md flex items-center transition-all duration-200 ${
            currentView === 'visual'
              ? 'bg-white shadow-sm text-blue-600 font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Eye className="w-4 h-4 mr-2" />
          Visual Comparison
        </button>
      </div>
    </div>
  );
};

const Result = () => {
  const location = useLocation();
  const { cis, originalFile, translatedImage } = location.state || {};
  const [currentView, setCurrentView] = useState('structured');

  const handleViewToggle = (view) => {
    setCurrentView(view);
  };

  // Create object URL for original file if it exists
  const originalImageUrl = originalFile ? URL.createObjectURL(originalFile) : null;

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="w-full max-w-6xl">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Certificate of Immunization (CIS)
          </h2>
          
          <ViewToggle currentView={currentView} onToggle={handleViewToggle} />
          
          {currentView === 'structured' ? (
            <CISResult cis={cis} />
          ) : (
            <SideBySideView 
              originalImage={originalImageUrl}
              translatedImage={translatedImage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;