import React from 'react';
import { Link } from 'react-router-dom';
import logoC from '../assets/images/logo_c.png';

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

        {/* Path4Med Side */}
        <Link to="https://path4med.interreg-euro-med.eu/" target="_blank" rel="noopener noreferrer" className="project-side path4med-side">
          <img
            src="https://path4med.interreg-euro-med.eu/wp-content/uploads/2023/12/logo-path4med.png"
            alt="Path4Med Project Logo"
            className="project-logo path4med-logo"
            loading="lazy"
          />
        </Link>
      </div>
    </div>
  );
};

export default HomePage; 