
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import WalletConnect from '@/components/wallet/WalletConnect';

interface ClaimedToken {
  eventId: string;
  name: string;
  date: string;
  tokenId: string;
  walletAddress: string;
}

const MyTokens = () => {
  const [tokens, setTokens] = useState<ClaimedToken[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (walletAddress) {
      loadTokens(walletAddress);
    }
  }, [walletAddress]);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setWalletConnected(true);
  };

  const loadTokens = (address: string) => {
    try {
      const tokensString = localStorage.getItem('zkpop_tokens');
      
      if (tokensString) {
        const allTokens: ClaimedToken[] = JSON.parse(tokensString);
        const userTokens = allTokens.filter(token => token.walletAddress === address);
        setTokens(userTokens);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
  };

  if (!walletConnected) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My Tokens</CardTitle>
            <CardDescription>
              Connect your wallet to view your proof-of-participation tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <WalletConnect onConnect={handleWalletConnect} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tokens</h1>
        <Link to="/claim-token">
          <Button variant="outline">
            <Ticket className="mr-2 h-4 w-4" />
            Claim New Token
          </Button>
        </Link>
      </div>

      {tokens.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <div className="bg-zkpop-gray/30 p-4 rounded-full mb-4">
              <Ticket size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No tokens yet</h3>
            <p className="text-gray-500 text-center mb-6">
              You haven't claimed any proof-of-participation tokens yet.
            </p>
            <Link to="/claim-token">
              <Button>
                <Ticket className="mr-2 h-4 w-4" />
                Claim Your First Token
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <Card key={token.tokenId} className="card-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{token.name}</CardTitle>
                <CardDescription>{new Date(token.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-zkpop-gray/20 p-3 rounded-lg mb-3">
                  <p className="text-xs font-medium text-gray-500">Token ID</p>
                  <p className="font-mono text-sm truncate">{token.tokenId}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Event ID: {token.eventId.substring(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTokens;
