import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="bg-black">
      <div className="split-container">
        {/* Clepsydra Side */}
        <Link to="/about-c" className="project-side clepsydra-side">
          <img
            src="https://github.com/clepsydraisa/clepsydra_isa/blob/main/images/logo_c.png?raw=true"
            alt="Clepsydra Project Logo"
            className="project-logo clepsydra-logo"
          />
        </Link>

        {/* Path4Med Side */}
        <Link to="/about-p" className="project-side path4med-side">
          <img
            src="https://www.path4med.eu/wp-content/uploads/2024/09/logo-path4med-1.svg"
            alt="Path4Med Project Logo"
            className="project-logo"
          />
        </Link>
      </div>

      {/* Minimalist Footer */}
      <footer className="fixed bottom-0 w-full bg-black bg-opacity-80 py-2 z-20">
        <div className="text-center">
          <p className="text-xs text-gray-400">
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
    </div>
  );
};

export default HomePage; 