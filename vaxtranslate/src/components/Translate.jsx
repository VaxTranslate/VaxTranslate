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
  Sparkles,
  Eye
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import CountrySelector from "./CountrySelector"; // Import the new component


const Translate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(""); // Add new state for country
  const [processingStatus, setProcessingStatus] = useState({
    upload: 'pending',
    scan: 'pending',
    process: 'pending',
    translate: 'pending'
  });

  const getCurrentStep = () => {
    if (processingStatus.translate === 'complete') return 3;
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
    formData.append("country", selectedCountry);

    // Store the original file for later use
    const originalFile = selectedFiles[0];

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
      
      // Main processing request
      const response = await axios.post(
        "https://vaxtranslate.ddns.net/upload",
        formData,
        {
          responseType: "json",
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Processing complete. Starting translation overlay...");
      updateProcessingStatus('process', 'complete');
      updateProcessingStatus('translate', 'processing');

      // Text detection request for overlay
      const textDetectionFormData = new FormData();
      textDetectionFormData.append("file", originalFile);

      let translatedImageBlob = null;
      try {
        const textDetectionResponse = await axios.post(
          "https://vaxtranslate.ddns.net/detect-text",
          textDetectionFormData,
          {
            responseType: "blob",
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        translatedImageBlob = URL.createObjectURL(textDetectionResponse.data);
        console.log("Text detection overlay complete.");
      } catch (textDetectionError) {
        console.warn("Text detection failed, continuing without overlay:", textDetectionError);
      }

      updateProcessingStatus('translate', 'complete');

      setTimeout(() => {
        setLoading(false);
        console.log("Navigating to /result with response data:", response.data);
        navigate('/result', { 
          state: { 
            cis: response.data, 
            country: selectedCountry,
            originalFile: originalFile,
            translatedImage: translatedImageBlob
          } 
        });
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      updateProcessingStatus('process', 'error');
      updateProcessingStatus('translate', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                <Sparkles className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Trusted Partner for Vaccine Record Translation
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Instantly translate vaccination records and documents with precision.
            Powered by AI for fast, secure, and accurate results.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Zap, text: "Instant Processing" },
              { icon: ShieldCheck, text: "100% Secure" },
              { icon: Brain, text: "AI-Powered" },
              { icon: BadgeCheck, text: "High Accuracy" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full bg-white shadow-xl border-y border-gray-100 mb-16 -mt-8">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 rounded-full">
              <h2 className="text-3xl font-bold text-white inline-flex items-center">
                <Brain className="w-8 h-8 mr-3" />
                How It Works
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                title: "Upload", 
                icon: FileUp, 
                description: "Upload your document securely to our platform",
                color: "from-blue-500 to-blue-600"
              },
              { 
                title: "Scan", 
                icon: Scan, 
                description: "Advanced OCR scans every detail",
                color: "from-blue-600 to-blue-700"
              },
              { 
                title: "Process", 
                icon: Brain, 
                description: "AI analyzes and translates content",
                color: "from-blue-700 to-blue-800"
              },
              { 
                title: "Visualize", 
                icon: Eye, 
                description: "View structured data and visual overlay",
                color: "from-blue-800 to-blue-900"
              }
            ].map((step, index) => (
              <div key={step.title} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="bg-blue-100 rounded-full p-2">
                      <MoveRight className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4">

        <div className="bg-gradient-to-br from-gray-50 to-white shadow-2xl rounded-3xl p-8 border border-gray-100 mb-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Start Your Translation
            </h2>
            <p className="text-gray-600">
              Upload your document and let our AI handle the rest
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
                <StepIndicator currentStep={getCurrentStep()} totalSteps={4} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ProcessingStep
                    title="Uploading"
                    description="Preparing files"
                    status={processingStatus.upload}
                    icon={FileUp}
                  />
                  <ProcessingStep
                    title="Scanning"
                    description="Analyzing content"
                    status={processingStatus.scan}
                    icon={Scan}
                  />
                  <ProcessingStep
                    title="Processing"
                    description="Extracting data"
                    status={processingStatus.process}
                    icon={FileCheck}
                  />
                  <ProcessingStep
                    title="Translating"
                    description="Creating overlay"
                    status={processingStatus.translate}
                    icon={Eye}
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

          {(processingStatus.process === 'error' || processingStatus.translate === 'error') && (
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

        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
            Access fast, reliable, and AI-driven translation for all your vaccination-related documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Lightning Fast",
                description: "Get your translations in minutes, not days",
                icon: Zap,
                color: "bg-yellow-50 text-yellow-600"
              },
              {
                title: "Secure & Private",
                description: "Your documents are encrypted and protected",
                icon: ShieldCheck,
                color: "bg-green-50 text-green-600"
              },
              {
                title: "High Accuracy",
                description: "Advanced AI ensures precise translations",
                icon: BadgeCheck,
                color: "bg-blue-50 text-blue-600"
              },
              {
                title: "Multiple Formats",
                description: "Support for all major document formats",
                icon: FileText,
                color: "bg-purple-50 text-purple-600"
              },
              {
                title: "Smart Processing",
                description: "Maintains original formatting and layout",
                icon: Brain,
                color: "bg-indigo-50 text-indigo-600"
              },
              {
                title: "24/7 Available",
                description: "Translate your documents anytime, anywhere",
                icon: Sparkles,
                color: "bg-pink-50 text-pink-600"
              }
            ].map(({ title, description, icon: Icon, color }) => (
              <div 
                key={title} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translate;