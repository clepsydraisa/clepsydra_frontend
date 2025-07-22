import React from 'react';
import { Link } from 'react-router-dom';
import logoC from '../assets/images/logo_c.png';
import path4medSvg from '../assets/images/logo-path4med-1.svg';

const HomePage: React.FC = () => {
  return (
    <div className="bg-black">
      <div className="split-container">
        {/* Clepsydra Side */}
        <Link to="/about-c" className="project-side clepsydra-side">
          <img
            src={logoC}
            alt="Clepsydra Project Logo"
            className="project-logo clepsydra-logo"
            loading="eager"
          />
        </Link>

        {/* Path4Med Side - Sem link */}
        <div className="project-side path4med-side cursor-default">
          <img
            src={path4medSvg}
            alt="Path4Med Project Logo"
            className="project-logo path4med-logo"
            loading="eager"
          />
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className="footer text-center">
        <p className="text-xs text-gray-400">
          Developed by Diogo Pinto |
          <a
            href="https://github.com/clepsydraisa/clepsydra_isa"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            clepsydraisa/clepsydra_isa
          </a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage; 