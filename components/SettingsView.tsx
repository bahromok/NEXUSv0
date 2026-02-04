
import React, { useRef } from 'react';
import { Settings, HardDrive, ShieldCheck, Download, Upload, Cpu, Database, Trash2 } from 'lucide-react';

interface SettingsViewProps {
  allData: any; 
  onImport: (data: any) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ allData, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(allData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `nexus-vault-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImport(json);
      } catch (err) {
        alert("Corrupt JSON file detected.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-12 md:p-20 max-w-5xl mx-auto space-y-24 animate-in fade-in duration-700 pb-40 text-[#37352f]">
      <header>
        <h1 className="text-5xl font-black tracking-tighter">System Console</h1>
        <p className="text-[#838170] text-lg font-medium">Core configuration and neural residency protocols.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-12">
          <div className="flex items-center gap-6 group">
             <div className="w-14 h-14 bg-[#f7f7f5] border border-[#e9e9e7] rounded-2xl flex items-center justify-center text-[#838170] group-hover:text-[#2383e2] transition-colors">
                <ShieldCheck size={28} />
             </div>
             <div>
                <h4 className="text-lg font-black tracking-tight">Zero-Cloud Residency</h4>
                <p className="text-xs text-[#838170] mt-1 font-medium">Data remains in secure local browser storage.</p>
             </div>
          </div>
          <div className="flex items-center gap-6 group">
             <div className="w-14 h-14 bg-[#f7f7f5] border border-[#e9e9e7] rounded-2xl flex items-center justify-center text-[#838170] group-hover:text-[#0f766e] transition-colors">
                <Cpu size={28} />
             </div>
             <div>
                <h4 className="text-lg font-black tracking-tight">Gemini 3 Pro Active</h4>
                <p className="text-xs text-[#838170] mt-1 font-medium">Intelligence processing on explicit demand.</p>
             </div>
          </div>
          <div className="flex items-center gap-6 group">
             <div className="w-14 h-14 bg-[#f7f7f5] border border-[#e9e9e7] rounded-2xl flex items-center justify-center text-[#838170] group-hover:text-[#37352f] transition-colors">
                <Database size={28} />
             </div>
             <div>
                <h4 className="text-lg font-black tracking-tight">Atomic Index Integrity</h4>
                <p className="text-xs text-[#838170] mt-1 font-medium">Graph links are synchronized in real-time.</p>
             </div>
          </div>
        </section>

        <section className="bg-[#f7f7f5] border border-[#e9e9e7] p-12 rounded-[40px] flex flex-col items-center justify-center text-center space-y-8 shadow-inner">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg">
            <HardDrive size={32} className="text-[#37352f]" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black tracking-tight">Neural Vault Migration</h3>
            <p className="text-sm text-[#838170] max-w-[280px] font-medium leading-relaxed italic">Synchronise your entire brain entity across localized sessions.</p>
          </div>
          
          <div className="flex flex-col w-full gap-4">
            <button 
              onClick={handleExport}
              className="w-full bg-[#37352f] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
              <Download size={16} /> Export Vault
            </button>
            <button 
              onClick={handleImportClick}
              className="w-full bg-white border border-[#e9e9e7] text-[#37352f] px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#efefed] transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <Upload size={16} /> Import Vault
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={onFileChange}
            />
          </div>
        </section>
      </div>

      <footer className="pt-24 border-t border-[#f1f1f0] flex flex-col md:flex-row items-center justify-between gap-12 text-[#d3d1cb]">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-[#37352f] text-white flex items-center justify-center font-black text-xs">N</div>
           <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#838170]">NEXUS Framework v1.5.2</p>
              <p className="text-[9px] font-bold uppercase tracking-widest">Protocol Active</p>
           </div>
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
           <a href="#" className="hover:text-[#37352f] transition-colors">Philosophy</a>
           <a href="#" className="hover:text-[#37352f] transition-colors">Manifesto</a>
           <a href="#" className="hover:text-[#37352f] transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default SettingsView;
