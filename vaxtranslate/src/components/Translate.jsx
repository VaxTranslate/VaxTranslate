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


const Translate = () => {
  const navigate = useNavigate();
  
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
                title: "Download", 
                icon: BadgeCheck, 
                description: "Get your perfectly translated document",
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