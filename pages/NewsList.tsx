import React from 'react';
import { News } from '../types';
import Pagination from '../components/Pagination';

interface NewsListProps {
  news: News[];
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const NewsList: React.FC<NewsListProps> = ({ news, pagination }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Todas as Novidades</h1>
        <p className="text-slate-400">Acompanhe a evolução da Team Soluções.</p>
      </div>

      <div className="grid gap-6">
        {news.length === 0 ? (
          <div className="text-center py-12 glass-morphism rounded-3xl border-dashed border-2 border-white/10">
            <p className="text-slate-500">Nenhum comunicado disponível.</p>
          </div>
        ) : (
          news.map((item) => (
            <div key={item.id} className="glass-morphism rounded-2xl p-6 flex flex-col md:flex-row gap-6 border-white/5 hover:border-white/10 transition-all">
              {item.image_url && (
                <img src={item.image_url} alt="" className="w-full md:w-48 h-48 md:h-32 rounded-xl object-cover shrink-0 shadow-lg" />
              )}
              <div className="flex-grow">
                <h3 className="font-bold text-xl text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                  {item.content}
                </p>
                <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
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
    </div>
  );
};

export default NewsList;