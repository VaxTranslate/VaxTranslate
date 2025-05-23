import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">VAXTranslate</h3>
            <p className="text-sm text-gray-400">
              Making immunization record translation simple, fast, and accurate with the power of AI.
            </p>
          </div>

        </div>

        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} VAXTranslate. All rights reserved.
            </div>
            {/* <div className="flex space-x-6">
              <span className="text-sm text-gray-400">Privacy Policy</span>
              <span className="text-sm text-gray-400">Terms of Service</span>
              <span className="text-sm text-gray-400">Cookie Policy</span>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
