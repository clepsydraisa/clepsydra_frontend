import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 px-6">
      <div className="container mx-auto text-center">
        <p className="text-xs">
          Developed by Diogo Pinto |
          <a
            href="https://github.com/clepsydraisa/clepsydra_isa"
            className="text-blue-400 hover:underline ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            clepsydraisa/clepsydra_isa
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 