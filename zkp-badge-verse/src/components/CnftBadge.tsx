
import React from "react";

const CnftBadge: React.FC = () => {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto animate-float">
      {/* Card shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-black opacity-20 blur-xl rounded-full"></div>
      
      {/* Card */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zkpurple to-zkpurple-dark border border-white/10 shadow-lg overflow-hidden transform rotate-3">
        {/* Badge inner */}
        <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-black/80 to-black/60 flex flex-col justify-between p-4">
          {/* Badge header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="w-8 h-8 rounded-full bg-zkneon-green opacity-70 animate-pulse-glow flex items-center justify-center">
                <span className="text-xs font-semibold text-black">zk</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-xs text-white/60">cNFT</div>
              <div className="ml-1 w-2 h-2 rounded-full bg-zkneon-green animate-pulse"></div>
            </div>
          </div>
          
          {/* Badge content */}
          <div className="mt-4">
            <h4 className="text-md font-semibold text-white">Privacy Summit</h4>
            <p className="text-xs text-white/60 mt-1">May 17, 2025</p>
          </div>
          
          {/* Badge footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-zkpurple-light flex items-center justify-center">
                <span className="text-[8px] font-bold">C</span>
              </div>
              <span className="text-[10px] text-white/70 ml-1">Compressed</span>
            </div>
            <div className="text-[10px] text-white/60">
              #00042
            </div>
          </div>
        </div>
        
        {/* Holographic effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-50"></div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-zkpurple/20 blur-xl rounded-2xl opacity-50 animate-pulse-glow"></div>
    </div>
  );
};

export default CnftBadge;
