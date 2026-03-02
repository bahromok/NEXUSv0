import React from 'react';
import { X, BookOpen, Brain, Terminal, Shield, Users } from 'lucide-react';

const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#37352f]/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="p-8 bg-[#f7f7f5] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#37352f] flex items-center justify-center text-white shadow-xl">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">System Protocols</h2>
              <p className="text-[10px] font-black text-[#838170] uppercase tracking-widest">NEXUS v1.5.2-STABLE</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#efefed] rounded-xl text-[#838170] transition-all">
            <X size={24} />
          </button>
        </header>
        <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto custom-scroll">
          <section className="space-y-4">
             <div className="flex items-center gap-3 text-[#2383e2]">
                <BookOpen size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">Thought Anchoring</h3>
             </div>
             <p className="text-sm text-[#5f5e5b] leading-relaxed font-medium">
               Use double brackets <code className="bg-[#f7f7f5] px-1.5 py-0.5 rounded text-black">[[Note Title]]</code> to create semantic links between entries. The Knowledge Graph visualises these connections as a neural mesh, enabling seamless navigation through your ideas. This feature promotes interconnected thinking and helps uncover hidden patterns in your notes.
             </p>
          </section>
          <section className="space-y-4">
             <div className="flex items-center gap-3 text-[#0f766e]">
                <Brain size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">Neural Synthesis</h3>
             </div>
             <p className="text-sm text-[#5f5e5b] leading-relaxed font-medium">
               Sorry AI costs,so we are looking forward to implment ai features appropriately soooon :)!
             </p>
          </section>
          <section className="space-y-4">
             <div className="flex items-center gap-3 text-[#eb5757]">
                <Shield size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">Local Privacy</h3>
             </div>
             <p className="text-sm text-[#5f5e5b] leading-relaxed font-medium">
               NEXUS is built with a Zero-Cloud residency protocol. All data is anchored in your browser's persistent storage. Export your Master Vault regularly to ensure data safety across devices. This design guarantees that your information remains private, with no external server access, protecting your thoughts from unauthorized eyes.
             </p>
          </section>
          <section className="space-y-4">
             <div className="flex items-center gap-3 text-[#f59e0b]">
                <Users size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">Founders</h3>
             </div>
             <div className="text-sm text-[#5f5e5b] leading-relaxed font-medium">
               <p className="mb-2">
                 1. <strong>Ilkhomov Feruzbek</strong> from Al Khwarizmi school - <a href="https://t.me/ilkhomovf" className="text-[#2383e2] hover:underline">@{`ilkhomovf`}</a>
               </p>
               <p className="mb-2">
                 2. <strong>Murzohamidov Bahromjon</strong> from Al Khwarizmi school - <a href="https://t.me/uvugaga" className="text-[#2383e2] hover:underline">@{`uvugaga`}</a>
               </p>
               <p>
                 For support, contact: <a href="mailto:bahrommurzohamidow@gmail.com" className="text-[#2383e2] hover:underline">bahrommurzohamidow@gmail.com</a>
               </p>
             </div>
          </section>
        </div>
        <footer className="p-8 border-t border-[#f1f1f0] bg-[#fcfcfb] text-center">
           <button onClick={onClose} className="bg-[#37352f] text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-[#2a281f] transition-colors">Acknowledge</button>
        </footer>
      </div>
    </div>
  );
};
export default HelpModal;
