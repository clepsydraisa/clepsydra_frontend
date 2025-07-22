import React from 'react';
import { Link } from 'react-router-dom';
import logoC from '../assets/images/logo_c.png';
import logoP from '../assets/images/logo_p.png';

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
            src={logoP}
            alt="Path4Med Project Logo"
            className="project-logo path4med-logo"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 