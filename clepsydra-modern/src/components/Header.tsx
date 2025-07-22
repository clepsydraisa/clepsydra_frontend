import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, CheckSquare, Users, BookOpen, FileText, Clock, BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about-c', label: 'Sobre Clepsydra', icon: Info },
    { path: '/tarefas', label: 'Tarefas', icon: CheckSquare },
    { path: '/parceiros', label: 'Parceiros', icon: Users },
    { path: '/resources', label: 'Recursos', icon: BookOpen },
    { path: '/reports', label: 'Relatórios', icon: FileText },
    { path: '/timeline', label: 'Timeline', icon: Clock },
    { path: '/visual', label: 'Visual', icon: BarChart3 },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white text-clepsydra-blue py-4 px-6 shadow z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              src="https://github.com/clepsydraisa/clepsydra_isa/blob/main/images/logo_c2.png?raw=true"
              alt="Clepsydra Logo"
              className="h-16 w-auto"
            />
          </Link>
        </div>
        <nav className="flex-1">
          <div className="flex items-center justify-end space-x-6">
            <ul className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`text-clepsydra-blue nav-link font-medium text-sm flex items-center space-x-1 ${
                        isActive ? 'active' : ''
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button className="ai-btn bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white font-medium text-sm py-2 px-4 rounded shadow focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95">
              Modelo AI
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 