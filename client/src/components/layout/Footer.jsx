// client/src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-2">RefLink</h3>
            <p className="text-sm">Making job referrals accessible and trustworthy.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="text-sm space-y-1">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="text-sm space-y-1">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Report an Issue</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 flex justify-between items-center text-sm">
          <p>&copy; {currentYear} RefLink. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
