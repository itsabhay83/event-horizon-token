
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/QRCode/QRScanner';
import WalletConnect from '@/components/wallet/WalletConnect';
import Spinner from '@/components/ui/Spinner';

interface EventData {
  eventId: string;
  name: string;
  date: string;
  description: string;
}

interface ClaimedToken {
  eventId: string;
  name: string;
  date: string;
  tokenId: string;
  walletAddress: string;
}

const ClaimToken = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [claimedToken, setClaimedToken] = useState<ClaimedToken | null>(null);
  const { toast } = useToast();

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setWalletConnected(true);
  };

  const handleScan = async (data: string) => {
    try {
      setIsLoading(true);
      
      // Parse QR data
      const eventData: EventData = JSON.parse(data);
      
      // Simulate claiming token
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a token
      const token: ClaimedToken = {
        eventId: eventData.eventId,
        name: eventData.name,
        date: eventData.date,
        tokenId: `token-${Date.now().toString(36)}`,
        walletAddress,
      };
      
      setClaimedToken(token);
      setShowScanner(false);
      
      // Save to local storage
      saveTokenToLocalStorage(token);
      
      toast({
        title: "Token Claimed Successfully",
        description: `You have successfully claimed a token for ${eventData.name}`,
      });
    } catch (error) {
      console.error('Error claiming token:', error);
      toast({
        title: "Failed to Claim Token",
        description: "There was an error parsing the QR code or claiming the token.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokenToLocalStorage = (token: ClaimedToken) => {
    try {
      // Get existing tokens
      const existingTokensString = localStorage.getItem('zkpop_tokens');
      const existingTokens = existingTokensString ? JSON.parse(existingTokensString) : [];
      
      // Add new token
      existingTokens.push(token);
      
      // Save back to localStorage
      localStorage.setItem('zkpop_tokens', JSON.stringify(existingTokens));
    } catch (error) {
      console.error('Error saving token to local storage:', error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <Spinner size="large" />
          <p className="mt-4 text-gray-600">Processing your claim...</p>
        </div>
      );
    }
    
    if (claimedToken) {
      return (
        <div className="p-6 bg-zkpop-gray/20 rounded-lg text-center">
          <div className="mb-4 inline-block bg-green-100 p-2 rounded-full">
            <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Token Claimed!</h3>
          <div className="mb-4">
            <p className="font-semibold">{claimedToken.name}</p>
            <p className="text-gray-600">{claimedToken.date}</p>
          </div>
          <div className="bg-white p-3 rounded-lg mb-4">
            <p className="text-xs font-medium text-gray-500">Token ID</p>
            <p className="font-mono text-sm truncate">{claimedToken.tokenId}</p>
          </div>
          <Button 
            onClick={() => window.location.href = '/my-tokens'}
            className="mt-2"
          >
            View My Tokens
          </Button>
        </div>
      );
    }
    
    if (walletConnected && !showScanner) {
      return (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center">
            Your wallet is connected. Scan an event QR code to claim your token.
          </p>
          <Button 
            onClick={() => setShowScanner(true)}
          >
            Start Scanning
          </Button>
        </div>
      );
    }
    
    if (walletConnected && showScanner) {
      return <QRScanner onScan={handleScan} />;
    }
    
    return (
      <div className="flex flex-col items-center">
        <p className="mb-6 text-center">
          Connect your Phantom wallet to claim your cToken.
        </p>
        <WalletConnect onConnect={handleWalletConnect} />
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Claim Token</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Token Claim</CardTitle>
          <CardDescription>
            Connect your wallet and scan the event QR code to claim your proof-of-participation token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimToken;
