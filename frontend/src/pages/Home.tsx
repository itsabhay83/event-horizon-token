
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Ticket } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-zkpop-indigo to-purple-500 bg-clip-text text-transparent">
          ZK cPOP Interface
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create and claim compressed proof-of-participation tokens for your events using zero-knowledge technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        <Link to="/create-event" className="h-full">
          <Card className="h-full card-shadow hover:border-zkpop-indigo hover:border transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center p-8 h-full">
              <div className="bg-zkpop-indigo/10 p-4 rounded-full mb-4">
                <Plus size={32} className="text-zkpop-indigo" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Create Event</h2>
              <p className="text-gray-600 text-center mb-4">
                Create an event and mint compressed PoP tokens for your attendees.
              </p>
              <Button className="w-full">
                <Plus size={18} className="mr-2" />
                Create Event
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/claim-token" className="h-full">
          <Card className="h-full card-shadow hover:border-zkpop-indigo hover:border transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center p-8 h-full">
              <div className="bg-zkpop-indigo/10 p-4 rounded-full mb-4">
                <Ticket size={32} className="text-zkpop-indigo" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Claim Token</h2>
              <p className="text-gray-600 text-center mb-4">
                Scan an event QR code to claim your proof-of-participation token.
              </p>
              <Button className="w-full" variant="outline">
                <Ticket size={18} className="mr-2" />
                Claim Token
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-16 bg-zkpop-gray/50 rounded-lg p-6 max-w-3xl w-full">
        <h3 className="text-xl font-semibold mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="font-bold text-zkpop-indigo text-lg mb-2">1. Create</div>
            <p className="text-gray-600 text-sm">
              Create an event and generate compressed proof-of-participation tokens.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="font-bold text-zkpop-indigo text-lg mb-2">2. Share</div>
            <p className="text-gray-600 text-sm">
              Share the event QR code with your attendees.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="font-bold text-zkpop-indigo text-lg mb-2">3. Claim</div>
            <p className="text-gray-600 text-sm">
              Attendees scan the QR code to claim their cToken.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
