import React, { useRef, useState, useCallback } from "react";
import { 
  Upload as UploadIcon, 
  X, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Zap,
  Brain,
  BadgeCheck,
  MoveRight,
  Scan,
  FileUp,
  FileCheck,
  Trash2,
  Sparkles
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import CountrySelector from "./CountrySelector"; // Import the new component

const FileUploadBox = ({ dragActive, onDragEvents, fileInputRef, handleFileChange }) => (
  <div
    onDragEnter={onDragEvents}
    onDragLeave={onDragEvents}
    onDragOver={onDragEvents}
    onDrop={onDragEvents}
    onClick={() => fileInputRef.current.click()}
    className={`
      relative border-2 border-dashed rounded-xl p-12 text-center 
      cursor-pointer transition-all duration-300 ease-in-out
      ${dragActive
        ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
        : "border-blue-200 hover:border-blue-400 hover:bg-blue-50/30 hover:scale-[1.01]"
      }
    `}
  >
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept=".png, .pdf, .jpg, .jpeg, .svg, .bmp, .tiff, .tga"
      onChange={handleFileChange}
      multiple
    />
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 mb-4 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
        <UploadIcon className={`w-10 h-10 transition-colors duration-300 ${
          dragActive ? "text-blue-600" : "text-blue-500"
        }`} />
      </div>
      <h5 className="text-xl font-semibold mb-2 text-gray-800">
        {dragActive ? "Drop your files here" : "Drag & drop files here"}
      </h5>
      <p className="text-sm text-gray-500 mb-2">
        or click to browse from your computer
      </p>
      <p className="text-xs text-gray-400 max-w-sm">
        Supported formats: JPEG, PNG, PDF, SVG, BMP, TIFF, TGA
      </p>
    </div>
  </div>
);

const ProcessingStep = ({ title, description, status, icon: Icon }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      case 'pending':
        return <div className="w-6 h-6 rounded-full border-2 border-gray-200" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm p-6 rounded-xl hover:shadow-md transition-all duration-200">
      <div className="mb-3 relative">
        <div className="absolute -right-2 -top-2">
          {getStatusIcon()}
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
      </div>
      <h6 className="font-semibold text-gray-900 text-lg mb-2">
        {title}
      </h6>
      <p className="text-sm text-gray-500 text-center">
        {description}
      </p>
    </div>
  );
};

const FilePreview = ({ file, onDelete, index }) => (
  <div className="group flex items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200">
    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
      <FileText className="w-6 h-6 text-blue-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 truncate">{file.name}</p>
      <div className="flex items-center text-sm text-gray-500 space-x-2">
        <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        <span>•</span>
        <span>{file.type || 'Unknown type'}</span>
      </div>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(index);
      }}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
    >
      <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
    </button>
  </div>
);

const ActionButton = ({ children, onClick, variant = 'default', disabled = false }) => {
  const baseStyles = "px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-500 hover:shadow-md disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:hover:shadow-none",
    primary: "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 disabled:hover:from-blue-600 disabled:hover:to-blue-400"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center space-x-2 mb-6">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
          index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
        }`}
      />
    ))}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(""); // Add new state for country
  const [processingStatus, setProcessingStatus] = useState({
    upload: 'pending',
    scan: 'pending',
    process: 'pending'
  });

  const getCurrentStep = () => {
    if (processingStatus.process === 'complete') return 2;
    if (processingStatus.scan === 'complete') return 1;
    if (processingStatus.upload === 'complete') return 0;
    return -1;
  };

  const handleDragEvents = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragActive(false);
    }

    if (e.type === "drop") {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileDelete = useCallback((index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateProcessingStatus = useCallback((step, status) => {
    setProcessingStatus(prev => ({ ...prev, [step]: status }));
  }, []);

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      console.log("No files selected for upload.");
      return;
    }
    if (!selectedCountry) {
      console.log("Country not selected. Prompting user to select a country.");
      alert("Please select the country of origin for the vaccination record");
      return;
    }

    console.log("Starting file upload process...");
    setLoading(true);
    updateProcessingStatus('upload', 'processing');

    const formData = new FormData();
    formData.append("file", selectedFiles[0]);
    formData.append("country", selectedCountry); // Add country to form data

    try {
      console.log("Uploading file...");
      updateProcessingStatus('upload', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("File upload complete.");
      updateProcessingStatus('upload', 'complete');

      console.log("Starting scan process...");
      updateProcessingStatus('scan', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Scan process complete.");
      updateProcessingStatus('scan', 'complete');

      console.log("Starting processing step...");
      updateProcessingStatus('process', 'processing');
      const response = await axios.post(
        "https://vaxtranslate.ddns.net/upload",
        formData,
        {
          responseType: "json",
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Processing complete. Navigating to result page...");
      updateProcessingStatus('process', 'complete');
      setTimeout(() => {
        setLoading(false);
        console.log("Navigating to /result with response data:", response.data);
        navigate('/result', { state: { cis: response.data, country: selectedCountry } });
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      updateProcessingStatus('process', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-50 to-white shadow-2xl rounded-3xl p-8 border border-gray-100 mb-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Translate
            </h2>
            <p className="text-gray-600">
              Upload your document, and we’ll handle the rest
            </p>
          </div>

          <FileUploadBox
            dragActive={dragActive}
            onDragEvents={handleDragEvents}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
          />

          {selectedFiles.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Selected Files ({selectedFiles.length})
                </h3>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center px-3 py-1 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear all
                </button>
              </div>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <FilePreview
                    key={index}
                    file={file}
                    index={index}
                    onDelete={handleFileDelete}
                  />
                ))}
              </div>
              
              {/* Add the Country Selector component here */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <CountrySelector 
                  selectedCountry={selectedCountry} 
                  setSelectedCountry={setSelectedCountry} 
                />
                {!selectedCountry && selectedFiles.length > 0 && (
                  <p className="mt-2 text-sm text-amber-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Please select the country of origin for your vaccination record
                  </p>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-500" />
                Processing Your Document
              </h3>
              <div className="max-w-lg mx-auto">
                <StepIndicator currentStep={getCurrentStep()} totalSteps={3} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProcessingStep
                    title="Uploading Files"
                    description="Preparing and uploading your documents"
                    status={processingStatus.upload}
                    icon={FileUp}
                  />
                  <ProcessingStep
                    title="Scanning Content"
                    description="Analyzing document structure"
                    status={processingStatus.scan}
                    icon={Scan}
                  />
                  <ProcessingStep
                    title="Processing"
                    description="Extracting and formatting data"
                    status={processingStatus.process}
                    icon={FileCheck}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <ActionButton
              variant="primary"
              onClick={handleFileUpload}
              disabled={loading || selectedFiles.length === 0}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Translate Document
                </span>
              )}
            </ActionButton>
            {selectedFiles.length === 0 && (
              <p className="mt-2 text-sm text-gray-500 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Please select a file to translate
              </p>
            )}
          </div>

          {processingStatus.process === 'error' && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200 shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-600">
                  An error occurred while processing your document. Please try again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;