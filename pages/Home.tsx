import React from 'react';
import { Profile, AppTool, News, ViewType } from '../types';

interface HomeProps {
  profile: Profile;
  tools: AppTool[];
  news: News[];
  onNavigate: (view: ViewType) => void;
}

const Home: React.FC<HomeProps> = ({ profile, tools, news, onNavigate }) => {
  const latestNews = news.length > 0 ? news[0] : null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Section with Space Theme & Mascot */}
      <section className="text-center py-12 relative overflow-visible space-bg rounded-b-[4rem]">
        <div className="relative inline-block">
          {/* Floating Mascot */}
          {profile.mascot_url && (
            <div className="absolute -top-12 -left-12 w-24 h-24 z-20 animate-mascot">
              <img 
                src={profile.mascot_url} 
                alt="Mascote" 
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Profile Image with Glow */}
          <div className="relative z-10">
            <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full scale-110"></div>
            <img 
              src={profile.avatar_url || 'https://picsum.photos/200/200'} 
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-indigo-600 object-cover mx-auto mb-4 shadow-2xl relative z-10"
            />
          </div>
        </div>
        
        <div className="relative z-10 mt-2">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-sm">{profile.name}</h1>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed px-6">{profile.bio}</p>
        </div>

        {/* Decorative Stars (CSS only) */}
        <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-1/4 w-1 h-1 bg-white rounded-full opacity-10 animate-pulse delay-700"></div>
        <div className="absolute bottom-10 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Latest News Section */}
      {latestNews && (
        <section className="px-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              <h2 className="text-xl font-bold">Última Novidade</h2>
            </div>
            {news.length > 1 && (
              <button 
                onClick={() => onNavigate('NEWS_LIST')}
                className="text-indigo-400 text-sm font-bold hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                Ver todas
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          <div className="glass-morphism rounded-3xl p-6 flex gap-4 items-start border-indigo-500/10 shadow-xl">
            {latestNews.image_url && (
              <img src={latestNews.image_url} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-lg border border-white/5" />
            )}
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase">Novo</span>
                <h3 className="font-bold text-lg text-white">{latestNews.title}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                {latestNews.content}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tools Section */}
      <section className="px-2">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Ferramentas & Aplicativos
        </h2>
        <div className="grid gap-6">
          {tools.length === 0 ? (
            <div className="text-center py-12 glass-morphism rounded-3xl border-dashed border-2 border-white/10">
              <p className="text-slate-500">Nenhuma ferramenta cadastrada ainda.</p>
            </div>
          ) : (
            tools.map(tool => (
              <div key={tool.id} className="glass-morphism rounded-3xl p-6 hover:border-white/20 transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full scale-75 group-hover:scale-110 transition-transform"></div>
                    <img 
                      src={tool.icon_url || 'https://picsum.photos/80/80'} 
                      alt={tool.title} 
                      className="w-20 h-20 rounded-2xl shadow-lg bg-slate-800 p-1 relative z-10"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{tool.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {tool.apk_url && (
                        <a 
                          href={tool.apk_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Baixar APK
                        </a>
                      )}
                      {tool.pwa_url && (
                        <a 
                          href={tool.pwa_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          Abrir PWA
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;