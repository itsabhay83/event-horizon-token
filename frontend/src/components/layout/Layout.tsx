
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-zkpop-gray/30">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white shadow-inner py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            © 2025 ZK cPOP Interface. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
