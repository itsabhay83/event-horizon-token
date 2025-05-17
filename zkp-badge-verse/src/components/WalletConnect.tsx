
import { useState, useRef, useEffect } from 'react';
import { useWalletContext } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function WalletConnect() {
  const { wallet, publicKey, disconnect, select, wallets, connecting, connected } = useWalletContext();
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  
  // Copy wallet address to clipboard
  const copyWalletAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle wallet connection
  const handleConnectWallet = () => {
    if (wallets.length > 0 && !wallet) {
      select(wallets[0].adapter.name);
    }
  };
  
  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <>
      {!connected ? (
        <Button
          onClick={handleConnectWallet}
          className="bg-zkpurple hover:bg-zkpurple-dark text-white"
          disabled={connecting}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/20 hover:border-white/40">
              {publicKey && formatWalletAddress(publicKey.toString())}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent ref={dropdownRef} className="w-56">
            <DropdownMenuItem onClick={copyWalletAddress}>
              {copied ? 'Copied!' : 'Copy Address'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDisconnect}>
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
