
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 border-t border-white/5 bg-slate-900/50 text-center flex flex-col items-center gap-1">
      <p className="text-slate-500 text-sm font-medium">
        Desenvolvido por <span className="text-indigo-400">Team Soluções</span>
      </p>
      <a 
        href="mailto:team-solucoes@protonmail.com" 
        className="text-slate-600 text-xs hover:text-indigo-400 transition-colors duration-200"
      >
        team-solucoes@protonmail.com
      </a>
    </footer>
  );
};

export default Footer;
