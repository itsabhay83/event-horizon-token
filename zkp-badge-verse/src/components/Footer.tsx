
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full bg-zkneon-green opacity-60"></div>
                <div className="absolute inset-0.5 rounded-full bg-zkpurple-dark flex items-center justify-center text-white font-bold">
                  zk
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight">cPOP</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              Create or attend events on Solana with zero-knowledge privacy and 1000x cheaper cNFTs.
              Built for the Solana 1000x Hackathon.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/Abhay_Porwal_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="https://github.com/itsabhay83/event-horizon-token" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
              <a href="https://discord.com/invite/qCv4Y7uYmh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                  <path d="M15 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                  <path d="M7.5 7.5C8.83 6.17 10.47 5.5 12 5.5s3.17.67 4.5 2"></path>
                  <path d="M16.5 16.5c-1.33 1.33-2.97 2-4.5 2s-3.17-.67-4.5-2"></path>
                  <path d="M19 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2Z"></path>
                  <path d="M12 15v-3"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-sm uppercase tracking-wider opacity-60">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-sm text-gray-300 hover:text-white">Documentation</Link></li>
              
              <li><a href="https://github.com/itsabhay83/event-horizon-token" className="text-sm text-gray-300 hover:text-white">GitHub</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-sm uppercase tracking-wider opacity-60">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-300 hover:text-white">About</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-300 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between">
          <p className="text-sm text-gray-500">© 2025 ZK cPOP. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-zkneon-green mr-2 animate-pulse"></span>
              <span className="text-xs text-gray-500">All systems operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
