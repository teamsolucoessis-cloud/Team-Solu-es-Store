import React from 'react';
import { News } from '../types';

interface NewsListProps {
  news: News[];
}

const NewsList: React.FC<NewsListProps> = ({ news }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Todas as Novidades</h1>
        <p className="text-slate-400">Acompanhe a evolução e os comunicados da Team Soluções.</p>
      </div>

      <div className="grid gap-6">
        {news.length === 0 ? (
          <div className="text-center py-12 glass-morphism rounded-3xl border-dashed border-2 border-white/10">
            <p className="text-slate-500">Nenhum comunicado disponível.</p>
          </div>
        ) : (
          news.map((item, idx) => (
            <div key={item.id} className="glass-morphism rounded-2xl p-6 flex flex-col md:flex-row gap-6 border-white/5 hover:border-white/10 transition-all">
              {item.image_url && (
                <img src={item.image_url} alt="" className="w-full md:w-48 h-48 md:h-32 rounded-xl object-cover shrink-0 shadow-lg" />
              )}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-white">{item.title}</h3>
                  <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-2 py-1 rounded">
                    #{news.length - idx}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                     Publicado em {new Date(item.created_at).toLocaleDateString()}
                   </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsList;