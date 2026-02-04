
import React, { useState } from 'react';
import { Palette, Zap, Type, Maximize2, Minimize2, Eye, Save, Sparkles, X } from 'lucide-react';
import { Note } from '../types';

interface CreativeCanvasProps {
  onSave: (title: string, content: string) => void;
}

const CreativeCanvas: React.FC<CreativeCanvasProps> = ({ onSave }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<'flow' | 'zen' | 'structure'>('flow');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!content.trim()) return;
    setIsSaving(true);
    const finalTitle = title.trim() || `Creative Flow - ${new Date().toLocaleDateString()}`;
    onSave(finalTitle, content);
    setTimeout(() => {
      setIsSaving(false);
      setContent('');
      setTitle('');
    }, 500);
  };

  return (
    <div className={`h-full flex flex-col transition-all duration-700 bg-white ${isFullscreen ? 'fixed inset-0 z-[100]' : 'p-12'}`}>
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-12 animate-in fade-in duration-1000">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
               <Palette size={24} />
             </div>
             <div>
               <h1 className="text-3xl font-black tracking-tight">Flow Canvas</h1>
               <p className="text-slate-400 text-sm font-medium">Distraction-free ideological expansion.</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-full border border-slate-100">
              <button 
                 onClick={() => setMode('flow')}
                 className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'flow' ? 'bg-black text-white' : 'text-slate-400 hover:text-black'}`}
              >
                Normal
              </button>
              <button 
                 onClick={() => setMode('zen')}
                 className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'zen' ? 'bg-black text-white' : 'text-slate-400 hover:text-black'}`}
              >
                Zen
              </button>
            </div>
            <button 
               onClick={() => setIsFullscreen(!isFullscreen)}
               className="p-3 text-slate-300 hover:text-black transition-colors"
            >
              {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </button>
          </div>
        </header>

        <div className={`flex-1 flex flex-col ${mode === 'zen' ? 'items-center justify-center' : ''}`}>
          {mode !== 'zen' && (
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Operational Header..."
              className="bg-transparent text-5xl font-black text-black mb-12 outline-none placeholder:text-slate-100 tracking-tighter border-none"
            />
          )}
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={mode === 'zen' ? "Focus only on the thought..." : "Begin ideological expansion..."}
            className={`w-full h-full bg-transparent outline-none resize-none leading-relaxed transition-all duration-700 placeholder:text-slate-100 border-none ${
              mode === 'flow' ? 'text-2xl font-bold text-black' : 
              mode === 'zen' ? 'text-4xl font-black text-center text-black max-w-2xl' : 
              'text-lg font-mono text-black'
            }`}
          />
          
          <div className="flex items-center justify-between mt-12 pt-12 border-t border-slate-50">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
               Neural Density: {content.split(/\s+/).filter(Boolean).length} Units
            </div>
            {content.length > 0 && (
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-black text-white px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all hover:bg-slate-800 disabled:opacity-20"
              >
                {isSaving ? <Sparkles size={14} className="animate-spin" /> : <Save size={14} />}
                {isSaving ? "Synchronizing" : "Commit to Vault"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeCanvas;
