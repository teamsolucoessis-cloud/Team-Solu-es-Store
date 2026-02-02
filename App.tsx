
import React, { useState, useEffect } from 'react';
import { ViewType, Profile, AppTool, News } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import NewsList from './pages/NewsList';
import { supabase } from './supabaseClient';

const ITEMS_PER_PAGE = 6;

const INITIAL_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Team Soluções',
  bio: 'Carregando informações...',
  avatar_url: 'https://picsum.photos/200/200'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('HOME');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  
  // States for Tools
  const [tools, setTools] = useState<AppTool[]>([]);
  const [toolPage, setToolPage] = useState(1);
  const [totalTools, setTotalTools] = useState(0);

  // States for News
  const [news, setNews] = useState<News[]>([]);
  const [newsPage, setNewsPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);

  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').single();
    if (data) setProfile(data);
  };

  const fetchTools = async (page: number) => {
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count } = await supabase
      .from('tools')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (data) setTools(data);
    if (count !== null) setTotalTools(count);
  };

  const fetchNews = async (page: number) => {
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count } = await supabase
      .from('news')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (data) setNews(data);
    if (count !== null) setTotalNews(count);
  };

  // Lógica para interceptar o botão de voltar do Android/Navegador
  useEffect(() => {
    // Definimos o estado inicial no histórico para a HOME
    window.history.replaceState({ view: 'HOME' }, '');

    const handlePopState = (event: PopStateEvent) => {
      // Se houver um estado definido no histórico, navegamos para ele
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        // Fallback caso o usuário volte além do estado inicial
        setCurrentView('HOME');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchTools(toolPage);
  }, [toolPage]);

  useEffect(() => {
    fetchNews(newsPage);
  }, [newsPage]);

  const navigateTo = (view: ViewType) => {
    if (view !== currentView) {
      // Toda vez que mudamos de tela manualmente, injetamos no histórico
      window.history.pushState({ view: view }, '');
      setCurrentView(view);
    }
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const refreshAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchTools(1),
      fetchNews(1)
    ]);
    setToolPage(1);
    setNewsPage(1);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)} 
        onAdminClick={() => navigateTo('ADMIN')}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={navigateTo}
        currentView={currentView}
      />

      <main className={`flex-grow pt-20 pb-12 px-4 max-w-4xl mx-auto w-full transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {currentView === 'HOME' && (
          <Home 
            profile={profile} 
            tools={tools} 
            news={news} 
            onNavigate={navigateTo}
            pagination={{
              currentPage: toolPage,
              totalPages: Math.ceil(totalTools / ITEMS_PER_PAGE),
              onPageChange: (p) => { setToolPage(p); window.scrollTo({ top: 500, behavior: 'smooth' }); }
            }}
          />
        )}
        {currentView === 'NEWS_LIST' && (
          <NewsList 
            news={news}
            pagination={{
              currentPage: newsPage,
              totalPages: Math.ceil(totalNews / ITEMS_PER_PAGE),
              onPageChange: (p) => { setNewsPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }
            }}
          />
        )}
        {currentView === 'PRIVACY' && (
          <Privacy />
        )}
        {currentView === 'ADMIN' && (
          <Admin 
            profile={profile} 
            setProfile={setProfile}
            tools={tools} 
            setTools={setTools}
            news={news} 
            setNews={setNews}
            onBack={() => { 
              // Ao clicar em voltar no Admin, limpamos o histórico para não entrar em loop
              navigateTo('HOME'); 
              refreshAllData(); 
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
