
import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WalletConnect from "@/components/WalletConnect";

const Navbar = () => {
  return (
    <header className="fixed w-full top-0 z-50 backdrop-blur-lg bg-black/30 border-b border-white/10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full bg-zkneon-green opacity-60 animate-pulse-glow"></div>
              <div className="absolute inset-0.5 rounded-full bg-zkpurple-dark flex items-center justify-center text-white font-bold">
                zk
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight">cPOP</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/#how-it-works" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
              How It Works
            </Link>
            <Link to="/about" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
              About
            </Link>
            <Link to="/docs" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnect />
          <Link to="/create-event">
            <Button className="bg-zkpurple hover:bg-zkpurple-dark text-white">
              Create Event
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
