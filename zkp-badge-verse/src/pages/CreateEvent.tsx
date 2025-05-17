
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventForm from "@/components/EventForm";
import { useWalletContext } from "@/context/WalletContext";

const CreateEvent: React.FC = () => {
  const { connected } = useWalletContext();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex-1 pt-24 pb-16 px-4"
      >
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-zkneon-green opacity-60 animate-pulse-glow"></div>
            <div className="absolute inset-0.5 rounded-full bg-zkpurple-dark flex items-center justify-center text-white font-bold">
              zk
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Create Event</h1>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Create a new event with privacy-preserving attendance verification using
            zero-knowledge proofs and compressed NFTs.
          </p>
          
          {!connected && (
            <div className="mb-8 p-4 max-w-md mx-auto rounded-lg bg-amber-900/20 border border-amber-600/30">
              <p className="text-amber-200 text-sm">
                Please connect your wallet to create an event. You'll need some SOL to cover transaction fees.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg p-6 md:p-8 shadow-xl">
          <EventForm />
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default CreateEvent;
