import React from 'react';
import { Profile, AppTool, News, ViewType } from '../types';
import { supabase } from '../supabaseClient';
import Pagination from '../components/Pagination';

interface HomeProps {
  profile: Profile;
  tools: AppTool[];
  news: News[];
  onNavigate: (view: ViewType) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const Home: React.FC<HomeProps> = ({ profile, tools, news, onNavigate, pagination }) => {
  const latestNews = news.length > 0 ? news[0] : null;
  const hasMascot = profile.mascot_url && profile.mascot_url.trim().length > 0;

  const handleToolClick = async (tool: AppTool) => {
    try {
      // Chama a função no banco de dados de forma silenciosa
      const { error } = await supabase.rpc('increment_tool_clicks', { row_id: tool.id });
      
      if (error) {
        console.error('Erro ao registrar métrica (RPC):', error.message);
        // Fallback caso a RPC falhe
        await supabase
          .from('tools')
          .update({ click_count: (tool.click_count || 0) + 1 })
          .eq('id', tool.id);
      }
    } catch (err) {
      console.error('Erro ao registrar métrica:', err);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Section */}
      <section className="text-center py-12 relative overflow-visible space-bg rounded-b-[4rem]">
        <div className="relative inline-block">
          {hasMascot && (
            <div className="absolute -top-16 -left-16 w-32 h-32 z-30 animate-mascot pointer-events-none">
              <img 
                src={profile.mascot_url} 
                alt="Mascote" 
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              />
            </div>
          )}

          <div className="relative z-10">
            <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full scale-110"></div>
            <img 
              src={profile.avatar_url || 'https://picsum.photos/200/200'} 
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-indigo-600 object-cover mx-auto mb-4 shadow-2xl relative z-10 bg-slate-800"
            />
          </div>
        </div>
        
        <div className="relative z-10 mt-2">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{profile.name}</h1>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed px-6">{profile.bio}</p>
        </div>
      </section>

      {/* Latest News Highlight */}
      {latestNews && (
        <section className="px-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              <h2 className="text-xl font-bold">Última Novidade</h2>
            </div>
            <button 
              onClick={() => onNavigate('NEWS_LIST')}
              className="text-indigo-400 text-sm font-bold hover:text-indigo-300 transition-colors"
            >
              Ver todas
            </button>
          </div>
          <div className="glass-morphism rounded-3xl p-6 flex gap-4 items-start border-indigo-500/10">
            {latestNews.image_url && (
              <img src={latestNews.image_url} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-lg" />
            )}
            <div>
              <h3 className="font-bold text-lg text-white mb-1">{latestNews.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2">{latestNews.content}</p>
            </div>
          </div>
        </section>
      )}

      {/* Tools Section with Pagination */}
      <section className="px-2 pb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Ferramentas & Aplicativos
        </h2>
        
        <div className="grid gap-6">
          {tools.length === 0 ? (
            <div className="text-center py-12 glass-morphism rounded-3xl border-dashed border-2 border-white/10">
              <p className="text-slate-500">Nenhuma ferramenta encontrada.</p>
            </div>
          ) : (
            tools.map(tool => (
              <div key={tool.id} className="glass-morphism rounded-3xl p-6 hover:border-white/20 transition-all group relative overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-6">
                  <img src={tool.icon_url} className="w-20 h-20 rounded-2xl shadow-lg bg-slate-800 p-1 shrink-0" alt={tool.title} />
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors mb-2">{tool.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2">{tool.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {tool.apk_url && (
                        <a 
                          href={tool.apk_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={() => handleToolClick(tool)} 
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                        >
                          Baixar APK
                        </a>
                      )}
                      {tool.pwa_url && (
                        <a 
                          href={tool.pwa_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={() => handleToolClick(tool)} 
                          className="px-5 py-2.5 glass-morphism border-white/10 rounded-xl text-sm font-bold transition-all hover:bg-white/10 active:scale-95"
                        >
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

        <Pagination 
          currentPage={pagination.currentPage} 
          totalPages={pagination.totalPages} 
          onPageChange={pagination.onPageChange} 
        />
      </section>
    </div>
  );
};

export default Home;