
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-zkpurple/20 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-zkpurple-dark flex items-center justify-center text-white text-xl font-bold">
              404
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-400 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <Link to="/">
            <Button className="bg-zkpurple hover:bg-zkpurple-dark text-white">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
