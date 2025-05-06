
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Plus, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-semibold text-zkpop-indigo">ZK cPOP</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-zkpop-indigo px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Home size={18} className="mr-1" />
              Home
            </Link>
            <Link to="/create-event" className="text-gray-600 hover:text-zkpop-indigo px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Plus size={18} className="mr-1" />
              Create Event
            </Link>
            <Link to="/my-tokens" className="text-gray-600 hover:text-zkpop-indigo px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Ticket size={18} className="mr-1" />
              My Tokens
            </Link>
          </div>
          
          <div className="flex md:hidden items-center">
            <Button 
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-lg m-2">
            <Link 
              to="/" 
              className="text-gray-600 hover:bg-zkpop-gray hover:text-zkpop-indigo block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home size={18} className="mr-2" />
                Home
              </div>
            </Link>
            <Link 
              to="/create-event" 
              className="text-gray-600 hover:bg-zkpop-gray hover:text-zkpop-indigo block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Plus size={18} className="mr-2" />
                Create Event
              </div>
            </Link>
            <Link 
              to="/my-tokens" 
              className="text-gray-600 hover:bg-zkpop-gray hover:text-zkpop-indigo block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Ticket size={18} className="mr-2" />
                My Tokens
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
