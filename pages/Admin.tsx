
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
  
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

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

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>, folder: string) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      setUploading(folder);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

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
    if (error) {
      alert('Erro ao salvar no banco: ' + error.message);
    } else {
      alert('Perfil e Mascote atualizados com sucesso no banco de dados!');
    }
    setLoading(false);
  };

  const addTool = async () => {
    const newTool = {
      title: 'Nova Ferramenta',
      description: 'Descrição da nova ferramenta',
      icon_url: 'https://img.icons8.com/fluency/100/000000/layers.png',
      apk_url: '',
      pwa_url: '',
      click_count: 0
    };
    const { data, error } = await supabase.from('tools').insert(newTool).select().single();
    if (data) {
      setTools([data, ...tools]);
      setEditingToolId(data.id);
    }
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
    if (data) {
      setNews([data, ...news]);
      setEditingNewsId(data.id);
    }
    if (error) alert('Erro ao criar: ' + error.message);
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Deseja excluir esta notícia?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) setNews(news.filter(n => n.id !== id));
  };

  const saveToolChanges = async (idx: number) => {
    setLoading(true);
    const tool = tools[idx];
    const { error } = await supabase.from('tools').update(tool).eq('id', tool.id);
    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      setEditingToolId(null);
    }
    setLoading(false);
  };

  const saveNewsChanges = async (idx: number) => {
    setLoading(true);
    const item = news[idx];
    const { error } = await supabase.from('news').update(item).eq('id', item.id);
    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      setEditingNewsId(null);
    }
    setLoading(false);
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
          <p className="text-slate-500 text-sm italic">Gestão da Vitrine Team Soluções</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addTool} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-indigo-600/20 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Ferramenta
          </button>
          <button onClick={addNews} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Notícia
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-white/10 overflow-x-auto scrollbar-hide">
        {(['PROFILE', 'TOOLS', 'NEWS'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-2 font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
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
                <div className="flex gap-4 items-center">
                  <img src={profile.avatar_url} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600/50 shrink-0 bg-slate-800" alt="Preview" />
                  <label className="flex-grow cursor-pointer block bg-slate-800 hover:bg-slate-700 p-2.5 text-center rounded-xl text-sm transition-all border border-dashed border-white/20">
                    {uploading === 'avatar' ? 'Enviando...' : '📷 Alterar Foto'}
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const url = await uploadFile(e, 'avatar');
                      if (url) setProfile({...profile, avatar_url: url});
                    }} />
                  </label>
                </div>
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mascote Animado (PNG)</label>
                <div className="flex gap-4 items-center bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                   <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                      {profile.mascot_url ? (
                        <img src={profile.mascot_url} className="w-full h-full object-contain z-10" alt="Mascote" />
                      ) : (
                        <span className="text-slate-600 text-[10px] text-center">Sem mascote</span>
                      )}
                      <div className="absolute inset-0 opacity-10 space-bg"></div>
                   </div>
                   <div className="flex-grow space-y-2">
                      <label className="cursor-pointer block bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 p-3 text-center rounded-xl text-sm font-bold transition-all border border-indigo-500/30">
                        {uploading === 'mascot' ? '🔄 Enviando Arquivo...' : '🤖 Selecionar Robô (PNG)'}
                        <input type="file" accept="image/png" className="hidden" onChange={async (e) => {
                          const url = await uploadFile(e, 'mascot');
                          if (url) {
                            // Fix: Use direct object update to match the setProfile(p: Profile) => void type definition
                            setProfile({...profile, mascot_url: url});
                            alert("Arquivo carregado com sucesso! Lembre-se de clicar em 'Salvar Perfil' abaixo.");
                          }
                        }} />
                      </label>
                      <p className="text-[10px] text-slate-500 italic px-1 text-center">Para melhor efeito, use uma imagem PNG com fundo transparente.</p>
                   </div>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Slogan / Biografia</label>
                <textarea placeholder="Fale sobre sua marca..." value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 h-28 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
            </div>
            <button onClick={saveProfile} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-black shadow-lg shadow-indigo-600/20 transition-all active:scale-95 text-lg">
              {loading ? 'Processando...' : '💾 SALVAR PERFIL COMPLETO'}
            </button>
          </div>
        )}

        {activeTab === 'TOOLS' && (
           <div className="grid gap-6">
            {tools.map((tool, idx) => {
              const isEditing = editingToolId === tool.id;
              return (
                <div key={tool.id} className={`glass-morphism p-6 rounded-3xl border transition-all ${isEditing ? 'border-indigo-500/50 ring-1 ring-indigo-500/20 bg-slate-900/40' : 'border-white/5'}`}>
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-3">
                        <img src={tool.icon_url} className="w-12 h-12 rounded-xl object-cover shadow-lg" alt="icon" />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-1 rounded">App #{tools.length - idx}</span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              {tool.click_count || 0} acessos
                            </span>
                          </div>
                          <h3 className="font-bold text-white block">{tool.title}</h3>
                        </div>
                     </div>
                    <div className="flex gap-2">
                      {!isEditing && (
                        <button onClick={() => setEditingToolId(tool.id)} className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          Editar
                        </button>
                      )}
                      <button onClick={() => deleteTool(tool.id)} className="text-red-400/60 hover:text-red-400 p-1.5 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Título</label>
                        <input value={tool.title} onChange={e => { const n = [...tools]; n[idx].title = e.target.value; setTools(n); }} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Ícone</label>
                        <label className="cursor-pointer block bg-slate-950 hover:bg-slate-900 p-2.5 text-center rounded-xl text-xs transition-all border border-dashed border-white/20">
                          {uploading === `icon-${tool.id}` ? 'Subindo...' : '🖼️ Trocar Imagem'}
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const url = await uploadFile(e, `icons`);
                            if (url) {
                              const n = [...tools];
                              n[idx].icon_url = url;
                              setTools(n);
                            }
                          }} />
                        </label>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Descrição</label>
                        <textarea value={tool.description} onChange={e => { const n = [...tools]; n[idx].description = e.target.value; setTools(n); }} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Link APK (Download)</label>
                        <div className="flex gap-2">
                           <input value={tool.apk_url} onChange={e => { const n = [...tools]; n[idx].apk_url = e.target.value; setTools(n); }} className="flex-grow bg-slate-950 border border-white/10 rounded-xl p-3 text-xs" />
                           <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 px-4 flex items-center rounded-xl text-xs border border-white/10 transition-all shrink-0">
                              {uploading === `apks` ? '...' : '📤 Upload'}
                              <input type="file" accept=".apk" className="hidden" onChange={async (e) => {
                                const url = await uploadFile(e, `apks`);
                                if (url) {
                                  const n = [...tools];
                                  n[idx].apk_url = url;
                                  setTools(n);
                                }
                              }} />
                           </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Link PWA (Site)</label>
                        <input value={tool.pwa_url} onChange={e => { const n = [...tools]; n[idx].pwa_url = e.target.value; setTools(n); }} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs" />
                      </div>

                      <div className="md:col-span-2 flex gap-3 pt-2">
                        <button onClick={() => saveToolChanges(idx)} disabled={loading} className="flex-grow bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                          {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                        <button onClick={() => setEditingToolId(null)} className="px-6 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 italic bg-white/5 p-4 rounded-2xl border border-white/5">
                      {tool.description || 'Nenhuma descrição definida.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'NEWS' && (
           <div className="grid gap-6">
            {news.map((item, idx) => {
              const isEditing = editingNewsId === item.id;
              return (
                <div key={item.id} className={`glass-morphism p-6 rounded-3xl border transition-all ${isEditing ? 'border-emerald-500/50 ring-1 ring-emerald-500/20 bg-slate-900/40' : 'border-white/5'}`}>
                   <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img src={item.image_url} className="w-12 h-12 rounded-xl object-cover shadow-lg" alt="news" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded">Notícia #{news.length - idx}</span>
                        <h3 className="font-bold text-white block">{item.title}</h3>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!isEditing && (
                        <button onClick={() => setEditingNewsId(item.id)} className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          Editar
                        </button>
                      )}
                      <button onClick={() => deleteNews(item.id)} className="text-red-400/60 hover:text-red-400 p-1.5 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Título do Comunicado</label>
                        <input placeholder="Título" value={item.title} onChange={e => { const n = [...news]; n[idx].title = e.target.value; setNews(n); }} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Conteúdo</label>
                        <textarea placeholder="Texto" value={item.content} onChange={e => { const n = [...news]; n[idx].content = e.target.value; setNews(n); }} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 h-32 resize-none focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Imagem da Notícia</label>
                        <label className="cursor-pointer block bg-slate-950 hover:bg-slate-900 p-3 text-center rounded-xl text-xs transition-all border border-dashed border-white/20">
                          {uploading === `news` ? 'Subindo...' : '📸 Carregar Nova Imagem'}
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const url = await uploadFile(e, `news`);
                            if (url) {
                              const n = [...news];
                              n[idx].image_url = url;
                              setNews(n);
                            }
                          }} />
                        </label>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button onClick={() => saveNewsChanges(idx)} disabled={loading} className="flex-grow bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                          {loading ? 'Salvando...' : 'Salvar Notícia'}
                        </button>
                        <button onClick={() => setEditingNewsId(null)} className="px-6 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 bg-white/5 p-4 rounded-2xl border border-white/5 whitespace-pre-wrap">
                      {item.content || 'Sem conteúdo.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-12 mb-20 flex gap-4">
        <button onClick={onBack} className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-all border border-white/5">Voltar ao Início</button>
        <button onClick={handleLogout} className="px-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-4 rounded-2xl font-bold transition-all border border-red-500/20">Encerrar Sessão</button>
      </div>
    </div>
  );
};

export default Admin;
