
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MerkleTreeAnimation from "@/components/MerkleTreeAnimation";
import CnftBadge from "@/components/CnftBadge";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-radial from-zkpurple/20 to-transparent opacity-30"></div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in opacity-0" style={{ animationDelay: "0.1s" }}>
                Private Proof.<br />
                <span className="text-gradient">Public Fun.</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-300 animate-fade-in opacity-0" style={{ animationDelay: "0.3s" }}>
                Create or attend events on Solana with zero-knowledge privacy and 1000x cheaper cNFTs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in opacity-0" style={{ animationDelay: "0.5s" }}>
                <Link to="/create-event">
                  <Button className="w-full sm:w-auto bg-zkpurple hover:bg-zkpurple-dark text-white px-8 py-6">
                    Create Event
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" className="w-full sm:w-auto border-white/20 hover:border-white/40 px-8 py-6">
                    View Demo
                  </Button>
                </Link>
              </div>
              
              <div className="mt-6 flex items-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: "0.6s" }}>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-zkpurple-light to-zkpurple border border-white/10 flex items-center justify-center text-xs font-medium text-white">
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Join <span className="text-white">500+</span> users already using ZK cPOP
                </p>
              </div>
            </div>
            
            <div className="order-1 md:order-2 relative">
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-zkpurple/30 to-zkneon-blue/20 rounded-3xl blur-3xl opacity-30"></div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="col-span-3">
                  <MerkleTreeAnimation />
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <CnftBadge />
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zkneon-green/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-background to-black/40">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Privacy + Compression = <span className="text-gradient">Future</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              ZK cPOP combines zero-knowledge proofs with compressed NFTs to create a private, scalable event attendance system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Private Attendance",
                description: "Prove you were invited, without revealing your identity.",
                icon: (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zkpurple/50 to-zkpurple-dark/50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zkneon-green">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M7 12h10" />
                      <path d="M12 7v10" />
                    </svg>
                  </div>
                )
              },
              {
                title: "Compressed NFTs",
                description: "Claim verifiable cNFT badges without state bloat.",
                icon: (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zkpurple/50 to-zkpurple-dark/50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zkneon-blue">
                      <path d="M10 5a7 7 0 1 0 4 13 7 7 0 0 0-4-13Z" />
                      <path d="M16 16a7 7 0 1 0-4-13 7 7 0 0 0 4 13Z" />
                    </svg>
                  </div>
                )
              },
              {
                title: "Solana Speed",
                description: "No delays. Instant confirmation and finality.",
                icon: (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zkpurple/50 to-zkpurple-dark/50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zkneon-pink">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7Z" />
                      <path d="M13 2v7h7" />
                    </svg>
                  </div>
                )
              },
              {
                title: "Merkle Tree Security",
                description: "Your data. Your proof. Cryptographically verifiable.",
                icon: (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zkpurple/50 to-zkpurple-dark/50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zkneon-green">
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  </div>
                )
              },
            ].map((card, i) => (
              <div 
                key={i} 
                className="glass-card rounded-2xl p-6 hover:bg-black/30 transition-all duration-300 animate-fade-in opacity-0" 
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                {card.icon}
                <h3 className="text-lg font-semibold mt-4 mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-zkpurple/20 rounded-full blur-3xl opacity-20"></div>
        <div className="container relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              ZK cPOP makes event attendance private, secure, and cost-effective in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Organizer uploads attendee list",
                description: "Organizers create events and upload a list of attendee wallet addresses. A Merkle root is stored on-chain.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zkneon-green">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M8 13h2" />
                    <path d="M8 17h2" />
                    <path d="M14 13h2" />
                    <path d="M14 17h2" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "Attendee connects & proves inclusion",
                description: "Attendees connect their wallet and generate a zero-knowledge proof showing they're on the guest list.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zkneon-blue">
                    <path d="M5 9c-1.5 0-3 .5-3 2s1.5 2 3 2m14-4c1.38 0 3 .5 3 2s-1.5 2-3 2" />
                    <path d="M3 11v-1a7 7 0 0 1 14 0v1" />
                    <path d="M7 11v1a7 7 0 0 0 14 0v-1" />
                    <path d="M17 17.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0" />
                    <path d="M6 13h4" />
                    <path d="M2 13h2" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Smart contract mints cNFT badge",
                description: "The contract verifies the proof and issues a unique compressed NFT badge as proof of attendance.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zkneon-pink">
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                    <line x1="9" x2="15" y1="12" y2="12" />
                  </svg>
                )
              }
            ].map((step, i) => (
              <div 
                key={i} 
                className="glass-card rounded-2xl p-8 hover:bg-black/30 transition-all duration-300 border-t border-white/10 animate-fade-in opacity-0"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-zkpurple/50 to-zkpurple-dark/50 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-bold text-white/10">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/create-event">
              <Button className="bg-zkpurple hover:bg-zkpurple-dark text-white px-8 py-6">
                Try It Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Builders Section */}
      <section id="for-builders" className="py-16 md:py-24 bg-black/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-zkpurple/10 opacity-40"></div>
        
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <div className="inline-block px-4 py-1 rounded-full bg-zkpurple/20 border border-zkpurple/30 text-xs text-white/70 font-medium mb-6">
                1000x Hackathon Submission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">For Builders</h2>
              <p className="text-gray-400 mb-6">
                ZK cPOP is built using the latest Solana ecosystem tools. Our stack is modern, 
                optimized, and ready to scale to millions of events.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  {
                    title: "Anchor Framework",
                    description: "Secure, modular Solana smart contracts"
                  },
                  {
                    title: "Light Protocol",
                    description: "Zero-knowledge proof generation and verification"
                  },
                  {
                    title: "Metaplex Bubblegum",
                    description: "Compressed NFT standard for 1000x cost reduction"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="w-6 h-6 mt-1 mr-3 rounded-full bg-zkpurple/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zkneon-green">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 hover:border-white/40">
                    GitHub
                  </Button>
                </a>
                <a href="/docs" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 hover:border-white/40">
                    Docs
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="glass-card rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <pre className="text-xs md:text-sm overflow-x-auto pb-4">
                  <code className="language-typescript text-gray-300">
{`import * as anchor from "@coral-xyz/anchor";
import { 
  MPL_BUBBLEGUM_PROGRAM_ID,
  getConcurrentMerkleTreeAccountSize,
} from "@metaplex-foundation/mpl-bubblegum";
import { LightZKVerifier } from "@lightprotocol/zk.js";

export async function createEvent(
  connection: Connection,
  payer: Keypair,
  attendees: PublicKey[]
): Promise<string> {
  // Generate Merkle tree from attendees
  const merkleTree = new MerkleTree(attendees);
  const merkleRoot = merkleTree.getRoot();
  
  // Create compressed NFT collection
  const { txid } = await program.methods
    .createEvent(
      merkleRoot,
      eventMetadata,
      maxDepth,
      maxBufferSize
    )
    .accounts({
      merkleTree: merkleTreeKeypair.publicKey,
      authority: payer.publicKey,
      bubblegumProgram: MPL_BUBBLEGUM_PROGRAM_ID,
    })
    .signers([payer, merkleTreeKeypair])
    .rpc();
    
  return txid;
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-xl font-medium text-gray-400">Trusted Stack</h2>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {["Solana", "Helius", "Light Protocol", "Metaplex", "Anchor"].map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center h-12 opacity-60 hover:opacity-100 transition-opacity"
              >
                <div className="text-lg font-medium text-gradient">{logo}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <p className="text-sm text-gray-500">Powered by the best in Solana ZK tech.</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-zkpurple/10">
        <div className="container">
          <div className="glass-card rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-zkpurple/30 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-zkneon-green/20 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the future of private, verifiable event attendance with ZK technology and compressed NFTs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-event">
                <Button className="bg-zkpurple hover:bg-zkpurple-dark text-white px-8 py-6">
                  Create an Event
                </Button>
              </Link>
              <Link to="/join-event">
                <Button variant="outline" className="border-white/20 hover:border-white/40 px-8 py-6">
                  Join an Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
