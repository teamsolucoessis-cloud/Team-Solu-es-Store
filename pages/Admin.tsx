
import React, { useState, useEffect } from 'react';
import { Profile, AppTool, News } from '../types';
import { supabase } from '../supabaseClient';

interface AdminProps {
  profile: Profile;
  setProfile: (p: Profile) => void;
  tools: AppTool[];
  setTools: (t: AppTool[]) => void;
  news: News[];
  setNews: (n: News[]) => void;
  onBack: () => void;
}

const Admin: React.FC<AdminProps> = ({ profile, setProfile, tools, setTools, news, setNews, onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'RECOVER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TOOLS' | 'NEWS'>('PROFILE');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setIsLoggedIn(true);
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Acesso negado: Verifique seu e-mail e senha.');
    } else {
      setIsLoggedIn(true);
    }
    setLoading(false);
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert('Erro: ' + error.message);
    else alert('E-mail de recuperação enviado para: ' + email);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    onBack();
  };

  // Função Mágica para Upload
  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>, folder: string) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      setUploading(folder);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // 1. Sobe o arquivo para o bucket 'media'
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Pega o link público dele
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      alert('Erro no upload: ' + error.message);
      return null;
    } finally {
      setUploading(null);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    const { error } = await supabase.from('profiles').upsert(profile);
    if (error) alert('Erro ao salvar: ' + error.message);
    else alert('Perfil atualizado com sucesso!');
    setLoading(false);
  };

  const addTool = async () => {
    const newTool = {
      title: 'Nova Ferramenta',
      description: 'Clique para editar a descrição',
      icon_url: 'https://img.icons8.com/fluency/100/000000/layers.png',
      apk_url: '',
      pwa_url: ''
    };
    const { data, error } = await supabase.from('tools').insert(newTool).select().single();
    if (data) setTools([data, ...tools]);
    if (error) alert('Erro ao criar: ' + error.message);
  };

  const deleteTool = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta ferramenta?')) return;
    const { error } = await supabase.from('tools').delete().eq('id', id);
    if (!error) setTools(tools.filter(t => t.id !== id));
  };

  const addNews = async () => {
    const newItem = {
      title: 'Novo Comunicado',
      content: 'Digite o conteúdo aqui...',
      image_url: ''
    };
    const { data, error } = await supabase.from('news').insert(newItem).select().single();
    if (data) setNews([data, ...news]);
    if (error) alert('Erro ao criar: ' + error.message);
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Deseja excluir esta notícia?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) setNews(news.filter(n => n.id !== id));
  };

  const updateTool = async (idx: number) => {
    const tool = tools[idx];
    const { error } = await supabase.from('tools').update(tool).eq('id', tool.id);
    if (error) console.error('Erro ao salvar alteração');
  };

  const updateNews = async (idx: number) => {
    const item = news[idx];
    const { error } = await supabase.from('news').update(item).eq('id', item.id);
    if (error) console.error('Erro ao salvar alteração');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto pt-10 px-4">
        <div className="glass-morphism rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Acesso Restrito</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" required />
            <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" required />
            <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-95">
              {loading ? 'Entrando...' : 'Entrar no Painel'}
            </button>
            <button type="button" onClick={() => setAuthMode('RECOVER')} className="w-full text-slate-400 text-sm hover:text-white transition-colors">Esqueci minha senha</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <p className="text-slate-500 text-sm italic">Você está logado como administrador.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addTool} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-indigo-600/20">+ Ferramenta</button>
          <button onClick={addNews} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20">+ Notícia</button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-white/10 overflow-x-auto scrollbar-hide">
        {(['PROFILE', 'TOOLS', 'NEWS'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-2 font-bold transition-all relative ${activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
            {tab === 'PROFILE' ? 'Meu Perfil' : tab === 'TOOLS' ? 'Ferramentas' : 'Notícias'}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full"></div>}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'PROFILE' && (
          <div className="glass-morphism p-8 rounded-3xl space-y-5 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome da Marca</label>
                <input placeholder="Ex: Team Soluções" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Foto de Perfil</label>
                <div className="flex gap-2">
                  <div className="flex-grow">
                     <input type="text" readOnly value={profile.avatar_url} className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-xs text-slate-400 opacity-50 mb-2" />
                     <label className="cursor-pointer block bg-slate-800 hover:bg-slate-700 p-2 text-center rounded-lg text-sm transition-all border border-dashed border-white/20">
                        {uploading === 'avatar' ? 'Enviando...' : '📷 Escolher Foto'}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const url = await uploadFile(e, 'avatar');
                          if (url) setProfile({...profile, avatar_url: url});
                        }} />
                     </label>
                  </div>
                  <img src={profile.avatar_url} className="w-20 h-20 rounded-full object-cover border-2 border-indigo-600/50" alt="Preview" />
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Slogan / Biografia</label>
                <textarea placeholder="Fale sobre sua marca..." value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 h-28 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
            </div>
            <button onClick={saveProfile} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/10 transition-all">
              {loading ? 'Salvando...' : 'Atualizar Identidade do Site'}
            </button>
          </div>
        )}

        {activeTab === 'TOOLS' && (
          <div className="grid gap-6">
            {tools.map((tool, idx) => (
              <div key={tool.id} className="glass-morphism p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <img src={tool.icon_url} className="w-10 h-10 rounded-lg object-cover" alt="icon" />
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-1 rounded">App #{idx + 1}</span>
                   </div>
                  <button onClick={() => deleteTool(tool.id)} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1">Excluir</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Título" value={tool.title} onBlur={() => updateTool(idx)} onChange={e => { const n = [...tools]; n[idx].title = e.target.value; setTools(n); }} className="bg-slate-900/50 border border-white/10 rounded-xl p-3" />
                  
                  <div className="space-y-1">
                    <label className="cursor-pointer block bg-slate-800 hover:bg-slate-700 p-2.5 text-center rounded-xl text-xs transition-all border border-dashed border-white/20">
                      {uploading === `icon-${idx}` ? 'Subindo...' : '🖼️ Trocar Ícone'}
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const url = await uploadFile(e, `icons`);
                        if (url) {
                          const n = [...tools];
                          n[idx].icon_url = url;
                          setTools(n);
                          updateTool(idx);
                        }
                      }} />
                    </label>
                  </div>

                  <textarea placeholder="Descrição" value={tool.description} onBlur={() => updateTool(idx)} onChange={e => { const n = [...tools]; n[idx].description = e.target.value; setTools(n); }} className="md:col-span-2 bg-slate-900/50 border border-white/10 rounded-xl p-3 h-20 resize-none" />
                  <input placeholder="Link APK" value={tool.apk_url} onBlur={() => updateTool(idx)} onChange={e => { const n = [...tools]; n[idx].apk_url = e.target.value; setTools(n); }} className="bg-slate-900/50 border border-white/10 rounded-xl p-3" />
                  <input placeholder="Link PWA" value={tool.pwa_url} onBlur={() => updateTool(idx)} onChange={e => { const n = [...tools]; n[idx].pwa_url = e.target.value; setTools(n); }} className="bg-slate-900/50 border border-white/10 rounded-xl p-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'NEWS' && (
          <div className="grid gap-6">
            {news.map((item, idx) => (
              <div key={item.id} className="glass-morphism p-6 rounded-3xl border border-white/5 space-y-4">
                 <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded">Notícia #{idx + 1}</span>
                  <button onClick={() => deleteNews(item.id)} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1">Excluir</button>
                </div>
                <input placeholder="Título" value={item.title} onBlur={() => updateNews(idx)} onChange={e => { const n = [...news]; n[idx].title = e.target.value; setNews(n); }} className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3" />
                <textarea placeholder="Texto" value={item.content} onBlur={() => updateNews(idx)} onChange={e => { const n = [...news]; n[idx].content = e.target.value; setNews(n); }} className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 h-24 resize-none" />
                
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex-grow bg-slate-800 hover:bg-slate-700 p-3 text-center rounded-xl text-xs transition-all border border-dashed border-white/20">
                    {uploading === `news-${idx}` ? 'Subindo...' : '📸 Adicionar Imagem à Notícia'}
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const url = await uploadFile(e, `news`);
                      if (url) {
                        const n = [...news];
                        n[idx].image_url = url;
                        setNews(n);
                        updateNews(idx);
                      }
                    }} />
                  </label>
                  {item.image_url && <img src={item.image_url} className="w-16 h-16 rounded-lg object-cover" alt="News" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 mb-20 flex gap-4">
        <button onClick={onBack} className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-all border border-white/5">Sair do Painel</button>
        <button onClick={handleLogout} className="px-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-4 rounded-2xl font-bold transition-all border border-red-500/20">Encerrar Sessão</button>
      </div>
    </div>
  );
};

export default Admin;
