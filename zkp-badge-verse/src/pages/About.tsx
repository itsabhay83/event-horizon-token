
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={container}
        className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-6xl mx-auto w-full"
      >
        <motion.div variants={fadeIn} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ZK cPOP</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Private Proof of Presence - A next-generation solution for secure, private, 
            and scalable event attendance verification on Solana.
          </p>
        </motion.div>
        
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
            We're building the future of event attendance verification by combining 
            zero-knowledge proofs with compressed NFTs on Solana. Our mission is to 
            provide a privacy-preserving way to verify event attendance while minimizing 
            costs and maximizing scalability.
          </p>
        </motion.div>
        
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <motion.div variants={fadeIn}>
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="text-center">Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Using zero-knowledge proofs, attendees can prove they were invited to an event 
                  without revealing their identity, providing unprecedented privacy in the 
                  event attendance space.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="text-center">Scalable & Cost-Effective</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  By leveraging Solana's compressed NFTs (cNFTs), we reduce the cost of minting 
                  attendance badges by up to 1000x compared to traditional NFTs, making mass 
                  distribution economically viable.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="text-center">Secure Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Our Merkle tree approach ensures that only eligible wallets can claim 
                  attendance badges, while the blockchain provides an immutable record of 
                  verification that cannot be tampered with.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div variants={fadeIn} className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zkpurple/30 flex items-center justify-center mb-3">
                <span className="text-zkneon-green font-bold">SOL</span>
              </div>
              <h3 className="font-medium">Solana</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zkpurple/30 flex items-center justify-center mb-3">
                <span className="text-zkneon-green font-bold">ZK</span>
              </div>
              <h3 className="font-medium">Zero Knowledge</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zkpurple/30 flex items-center justify-center mb-3">
                <span className="text-zkneon-green font-bold">MT</span>
              </div>
              <h3 className="font-medium">Merkle Tree</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zkpurple/30 flex items-center justify-center mb-3">
                <span className="text-zkneon-green font-bold">cNFT</span>
              </div>
              <h3 className="font-medium">Compressed NFTs</h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={fadeIn} className="text-center">
          <h2 className="text-3xl font-bold mb-6">Solana 1000x Hackathon Submission</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            ZK cPOP was built during the Solana 1000x Hackathon, focusing on leveraging 
            compression technology to make blockchain applications more accessible and cost-effective.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://github.com/zkcpop" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-zkpurple hover:bg-zkpurple-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              GitHub Repository
            </a>
            <a 
              href="https://solana.com/hackathon" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-transparent border border-zkpurple text-white hover:bg-zkpurple/20 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Hackathon Details
            </a>
          </div>
        </motion.div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default About;
