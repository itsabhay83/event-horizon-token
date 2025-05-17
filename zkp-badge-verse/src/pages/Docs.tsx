
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState("how-it-works");
  
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const sidebarSections = [
    { id: "how-it-works", title: "How It Works" },
    { id: "merkle-tree", title: "Merkle Tree Eligibility" },
    { id: "zk-proof", title: "ZK Proof Flow" },
    { id: "cnft-claim", title: "Claiming a cNFT" },
    { id: "api-overview", title: "API Overview" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Header height + some padding
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  // Update active section based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      for (const section of sidebarSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="md:w-64 md:flex-shrink-0">
              <div className="md:sticky md:top-24">
                <nav className="p-4 rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm">
                  <h3 className="text-lg font-bold mb-4">Documentation</h3>
                  <ul className="space-y-2">
                    {sidebarSections.map((section) => (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={`text-left w-full px-3 py-2 rounded-md transition-colors ${
                            activeSection === section.id
                              ? "bg-zkpurple text-white"
                              : "hover:bg-white/5"
                          }`}
                        >
                          {section.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <Button variant="outline" className="w-full mb-2 border-white/20 hover:border-white/40">
                      <Link to="https://github.com/zkcpop" target="_blank" rel="noopener noreferrer" className="w-full">
                        GitHub
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 hover:border-white/40">
                      <Link to="/api-docs.pdf" target="_blank" rel="noopener noreferrer" className="w-full">
                        API PDF
                      </Link>
                    </Button>
                  </div>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 md:max-w-3xl">
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
                className="prose prose-invert prose-lg max-w-none"
              >
                <h1>ZK cPOP Documentation</h1>
                <p className="lead">
                  Learn how ZK cPOP enables private, verifiable event attendance using 
                  zero-knowledge proofs and compressed NFTs on Solana.
                </p>
                
                <section id="how-it-works" className="mt-12 mb-16">
                  <h2>How It Works</h2>
                  <p>
                    ZK cPOP uses a combination of Merkle trees, zero-knowledge proofs, and 
                    compressed NFTs to create a privacy-preserving event attendance system:
                  </p>
                  
                  <Card className="my-6 glass-card">
                    <CardContent className="pt-6">
                      <ol className="list-decimal pl-5 space-y-4">
                        <li>
                          <strong>Event Creation:</strong> Organizers create an event and upload a list 
                          of eligible wallet addresses. The system generates a Merkle tree from these 
                          addresses, storing only the Merkle root on-chain.
                        </li>
                        <li>
                          <strong>Eligibility Verification:</strong> When an attendee wants to claim their 
                          attendance badge, they generate a Merkle proof that their address was included 
                          in the original list, without revealing their specific address.
                        </li>
                        <li>
                          <strong>cNFT Minting:</strong> Upon verification, a compressed NFT (cNFT) 
                          attendance badge is minted to the attendee's wallet at a fraction of the cost 
                          of traditional NFTs.
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </section>
                
                <section id="merkle-tree" className="mb-16">
                  <h2>Merkle Tree Eligibility</h2>
                  <p>
                    Merkle trees allow for efficient and secure verification of data without revealing 
                    the entire dataset:
                  </p>
                  
                  <div className="my-6">
                    <h3>Key Concepts</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Merkle Root:</strong> A single hash that represents all the data in the tree. 
                        This is the only piece stored on-chain.
                      </li>
                      <li>
                        <strong>Merkle Proof:</strong> A set of hashes that, when combined with a leaf node 
                        (wallet address), can verify inclusion without revealing other addresses.
                      </li>
                      <li>
                        <strong>Security:</strong> It's computationally infeasible to find a wallet address 
                        that generates a valid proof if it wasn't in the original set.
                      </li>
                    </ul>
                  </div>
                  
                  <div className="my-6">
                    <h3>Implementation</h3>
                    <p>
                      When creating an event, we hash each wallet address using keccak256, build a 
                      Merkle tree from these hashes, and store only the root hash. This allows any 
                      eligible attendee to later prove they were on the list without exposing the 
                      entire attendee list.
                    </p>
                  </div>
                </section>
                
                <section id="zk-proof" className="mb-16">
                  <h2>ZK Proof Flow</h2>
                  <p>
                    Zero-knowledge proofs allow one party (the prover) to prove to another party 
                    (the verifier) that a statement is true, without revealing any additional information.
                  </p>
                  
                  <div className="my-6">
                    <h3>In ZK cPOP:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        The attendee (prover) generates a proof that their wallet address is included 
                        in the Merkle tree.
                      </li>
                      <li>
                        The smart contract (verifier) can verify this proof against the stored Merkle 
                        root without learning which specific address was used.
                      </li>
                      <li>
                        This provides privacy for attendees while maintaining the integrity of the 
                        attendance verification process.
                      </li>
                    </ul>
                  </div>
                </section>
                
                <section id="cnft-claim" className="mb-16">
                  <h2>Claiming a cNFT</h2>
                  <p>
                    Compressed NFTs (cNFTs) are a Solana innovation that drastically reduces the cost 
                    of minting NFTs by storing data more efficiently.
                  </p>
                  
                  <div className="my-6">
                    <h3>Benefits of cNFTs for Event Badges:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Cost Efficiency:</strong> Up to 1000x cheaper than traditional NFTs, 
                        making large-scale distribution economically viable.
                      </li>
                      <li>
                        <strong>Reduced Storage:</strong> Uses significantly less on-chain storage 
                        while maintaining the same functionality.
                      </li>
                      <li>
                        <strong>Scalability:</strong> Enables mass distribution of attendance badges 
                        without overwhelming the blockchain.
                      </li>
                    </ul>
                  </div>
                  
                  <div className="my-6">
                    <h3>Claiming Process:</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Connect your wallet to the ZK cPOP platform</li>
                      <li>Enter the event code or access via a shareable link</li>
                      <li>Generate your Merkle proof client-side</li>
                      <li>Submit your proof to the verification contract</li>
                      <li>Upon successful verification, the cNFT is minted directly to your wallet</li>
                    </ol>
                  </div>
                </section>
                
                <section id="api-overview" className="mb-16">
                  <h2>API Overview</h2>
                  <p>
                    ZK cPOP provides a simple API for integrating with the platform:
                  </p>
                  
                  <div className="my-6 overflow-x-auto">
                    <Card className="glass-card">
                      <CardContent className="pt-6">
                        <h3 className="mb-4 font-mono">POST /api/events/create</h3>
                        <p className="mb-2">Create a new event with a list of eligible addresses.</p>
                        <pre className="bg-black/30 p-4 rounded-md overflow-x-auto">
{`{
  "name": "Event Name",
  "description": "Event Description",
  "date": "2025-05-20T18:00:00Z",
  "merkleRoot": "0x1234...abcd"
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="my-6 overflow-x-auto">
                    <Card className="glass-card">
                      <CardContent className="pt-6">
                        <h3 className="mb-4 font-mono">GET /api/events/:id</h3>
                        <p className="mb-2">Retrieve event details by ID.</p>
                        <pre className="bg-black/30 p-4 rounded-md overflow-x-auto">
{`{
  "id": "event123",
  "name": "Event Name",
  "description": "Event Description",
  "date": "2025-05-20T18:00:00Z",
  "merkleRoot": "0x1234...abcd",
  "claimCount": 42
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="my-6 overflow-x-auto">
                    <Card className="glass-card">
                      <CardContent className="pt-6">
                        <h3 className="mb-4 font-mono">POST /api/claims/submit</h3>
                        <p className="mb-2">Submit a claim with Merkle proof.</p>
                        <pre className="bg-black/30 p-4 rounded-md overflow-x-auto">
{`{
  "eventId": "event123",
  "walletAddress": "ABC...xyz",
  "merkleProof": ["0xabcd...", "0x1234..."]
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="my-6 overflow-x-auto">
                    <Card className="glass-card">
                      <CardContent className="pt-6">
                        <h3 className="mb-4 font-mono">GET /api/users/:wallet/claims</h3>
                        <p className="mb-2">Get all claimed events for a wallet.</p>
                        <pre className="bg-black/30 p-4 rounded-md overflow-x-auto">
{`[
  {
    "eventId": "event123",
    "name": "Event Name",
    "claimDate": "2025-05-21T14:30:00Z",
    "badgeUrl": "https://..."
  },
  ...
]`}
                        </pre>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Docs;
