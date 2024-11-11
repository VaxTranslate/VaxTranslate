import React from "react";
import { useLocation } from "react-router-dom";
import CISResult from "./CISResult";

const Result = () => {
  const location = useLocation();
  const { cis } = location.state || {};

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Certificate of Immunization (CIS)
          </h2>
          <CISResult cis={cis} />
        </div>
      </div>
    </div>
  );
};
export default Result;
