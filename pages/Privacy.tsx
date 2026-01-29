
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
      <div className="glass-morphism rounded-3xl p-8 space-y-6 text-slate-300">
        <p>A <strong>Team Soluções</strong> valoriza a sua privacidade. Esta página descreve como tratamos as informações em nossos aplicativos e serviços.</p>
        
        <h2 className="text-xl font-bold text-white">1. Coleta de Dados</h2>
        <p>Nossos aplicativos APK e PWAs divulgados neste portal podem não coletar dados pessoais, a menos que explicitamente solicitado dentro do próprio software.</p>

        <h2 className="text-xl font-bold text-white">2. Arquivos APK</h2>
        <p>Todos os arquivos disponibilizados são verificados para garantir segurança. No entanto, a instalação de aplicativos fora das lojas oficiais é de responsabilidade do usuário.</p>

        <h2 className="text-xl font-bold text-white">3. Contato</h2>
        <p>Em caso de dúvidas sobre nossos termos, entre em contato via e-mail corporativo.</p>

        <div className="pt-8 border-t border-white/10 text-sm text-slate-500">
          Última atualização: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
