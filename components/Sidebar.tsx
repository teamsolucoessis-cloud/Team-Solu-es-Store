
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
  currentView: ViewType;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentView }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-white/10`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-8">Menu</h2>
          <nav className="space-y-2">
            <button 
              onClick={() => onNavigate('HOME')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${currentView === 'HOME' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Início
            </button>
            <button 
              onClick={() => onNavigate('PRIVACY')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${currentView === 'PRIVACY' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Política de Privacidade
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
