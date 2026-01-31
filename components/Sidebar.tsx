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
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-white/10 flex flex-col`}
      >
        <div className="p-6 flex-grow">
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
              onClick={() => onNavigate('NEWS_LIST')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${currentView === 'NEWS_LIST' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l5 5v11a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v6h6" />
              </svg>
              Novidades
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

        {/* ÁREA SECRETA NO RODAPÉ DO MENU */}
        <div className="p-6 border-t border-white/5 bg-slate-900/50">
          <div className="flex items-center justify-around opacity-20 hover:opacity-100 transition-opacity duration-500">
             <div className="p-2 text-slate-500 cursor-default">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             
             <button 
                onClick={() => onNavigate('ADMIN')}
                className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"
                title="v1.0.5"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
             </button>

             <div className="p-2 text-slate-500 cursor-default">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
             </div>
          </div>
          <p className="text-[10px] text-center text-slate-700 mt-2 uppercase tracking-widest font-bold">Encerrar Menu</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;