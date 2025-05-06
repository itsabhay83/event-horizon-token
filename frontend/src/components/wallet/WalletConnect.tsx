
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  onConnect?: (walletAddress: string) => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Check if Phantom is installed
      if ('phantom' in window) {
        // @ts-ignore: Phantom is injected into window object
        const provider = window.phantom?.solana;
        
        if (provider?.isPhantom) {
          try {
            const response = await provider.connect();
            const address = response.publicKey.toString();
            setWalletAddress(address);
            
            toast({
              title: "Wallet Connected",
              description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
            });
            
            if (onConnect) {
              onConnect(address);
            }
          } catch (err) {
            console.error("Connection error:", err);
            toast({
              title: "Connection Failed",
              description: "Failed to connect to Phantom wallet",
              variant: "destructive"
            });
          }
        }
      } else {
        window.open("https://phantom.app/", "_blank");
        toast({
          title: "Phantom Not Found",
          description: "Please install the Phantom wallet extension",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <div className="flex flex-col items-center">
      {walletAddress ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-zkpop-gray p-3 rounded-lg">
            <p className="text-sm font-medium">Connected:</p>
            <p className="font-mono text-xs">{`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <Button 
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center"
        >
          <Wallet size={18} className="mr-2" />
          {isConnecting ? "Connecting..." : "Connect Phantom Wallet"}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
