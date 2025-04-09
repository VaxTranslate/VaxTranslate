import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const CountrySelector = ({ selectedCountry, setSelectedCountry }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const countries = [
    "Other",
    "Angola",
    "Colombia",
    "Democratic Republic of Congo",
    "Guatemala",
    "Mexico",
    "Venezuela"
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative">
      <div className="mb-2 text-sm font-medium text-gray-700">
        Country of Origin for Vaccination Record
      </div>
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
      >
        <span className="block truncate">
          {selectedCountry || "Select a country"}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`} 
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {countries.map((country) => (
              <li
                key={country}
                onClick={() => selectCountry(country)}
                className={`px-4 py-2 text-gray-800 hover:bg-blue-50 cursor-pointer ${
                  selectedCountry === country ? "bg-blue-50 font-medium" : ""
                }`}
              >
                {country}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;