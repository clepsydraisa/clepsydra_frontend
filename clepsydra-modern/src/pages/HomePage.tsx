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

        {/* Path4Med Side - Sem link */}
        <div className="project-side path4med-side cursor-default">
          <img
            src="https://www.path4med.eu/wp-content/uploads/2024/09/logo-path4med-1.svg"
            alt="Path4Med Project Logo"
            className="project-logo"
            loading="lazy"
          />
        </div>
      </div>

      {/* Test Content */}
      <div className="fixed top-4 left-4 bg-white p-4 rounded shadow-lg z-50">
        <h2 className="text-lg font-bold text-blue-900 mb-2">Teste de Carregamento</h2>
        <p className="text-sm text-gray-700 mb-2">Se vê isto, a aplicação está funcionando!</p>
        <Link to="/tarefas" className="text-blue-600 hover:underline">Ir para Tarefas</Link>
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