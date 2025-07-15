import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2023 GourmetExpress. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;