import React, { useState, useEffect } from 'react';
import { ViewType, Profile, AppTool, News } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import { supabase } from './supabaseClient';

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
  const [tools, setTools] = useState<AppTool[]>([]);
  const [news, setNews] = useState<News[]>([]);

  const fetchData = async () => {
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').single();
      if (profileData) setProfile(profileData);

      const { data: toolsData } = await supabase.from('tools').select('*').order('created_at', { ascending: false });
      if (toolsData) setTools(toolsData);

      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (newsData) setNews(newsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
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

      <main className="flex-grow pt-20 pb-12 px-4 max-w-4xl mx-auto w-full">
        {currentView === 'HOME' && (
          <Home profile={profile} tools={tools} news={news} />
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
            onBack={() => { navigateTo('HOME'); fetchData(); }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;