
import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  onAdminClick: () => void; // Mantido na interface para não quebrar o App.tsx, mas não usado aqui
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-40 px-4 flex items-center justify-between">
      <button 
        onClick={onMenuClick}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-tight">Team Soluções</span>
      </div>

      {/* Espaçador para manter o logo centralizado */}
      <div className="w-10"></div>
    </header>
  );
};

export default Header;
