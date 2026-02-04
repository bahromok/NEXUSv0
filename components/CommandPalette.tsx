
import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Layout, CheckCircle, Zap, Book, Brain, Shield, Settings } from 'lucide-react';
import { Note, ViewType } from '../types';

interface CommandPaletteProps {
  onClose: () => void;
  notes: Note[];
  onSelectView: (view: ViewType) => void;
  onSelectNote: (id: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose, notes, onSelectView, onSelectNote }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const views = [
    { id: ViewType.DASHBOARD, label: 'Dashboard', icon: Layout },
    { id: ViewType.NOTES, label: 'Notes', icon: FileText },
    { id: ViewType.GRAPH, label: 'Graph', icon: Brain },
    { id: ViewType.TASKS, label: 'Tasks', icon: CheckCircle },
    { id: ViewType.HABITS, label: 'Habits', icon: Zap },
    { id: ViewType.STUDY, label: 'Study', icon: Book },
    { id: ViewType.IDENTITY, label: 'Identity', icon: Shield },
    { id: ViewType.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const filteredItems = [
    ...views.filter(v => v.label.toLowerCase().includes(query.toLowerCase())).map(v => ({ type: 'view', ...v })),
    ...notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase())).map(n => ({ type: 'note', id: n.id, label: n.title, icon: FileText })),
  ];

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      const item = filteredItems[selectedIndex];
      if (item) {
        if (item.type === 'view') {
          onSelectView(item.id as ViewType);
          onClose();
        } else {
          onSelectNote(item.id!);
          onClose();
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-[#37352f]/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white border border-[#e9e9e7] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4 p-6 border-b border-[#f1f1f0]">
          <Search size={24} className="text-[#37352f]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or find a page..."
            className="flex-1 bg-white text-[#37352f] outline-none text-lg font-bold placeholder:text-[#9b9a97]"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="max-h-[50vh] overflow-y-auto p-3 bg-white">
          {filteredItems.map((item, i) => {
            const Icon = item.icon;
            const isSelected = i === selectedIndex;
            return (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => {
                   if (item.type === 'view') onSelectView(item.id as ViewType);
                   else onSelectNote(item.id!);
                   onClose();
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all ${
                  isSelected ? 'bg-[#ebf5fe] text-[#2383e2]' : 'text-[#37352f] hover:bg-[#f7f7f5]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#2383e2] text-white' : 'bg-[#f7f7f5] text-[#5f5e5b]'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[15px] ${isSelected ? 'font-bold' : 'font-semibold'}`}>{item.label}</span>
                </div>
                {item.type === 'view' && <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-[#2383e2]' : 'text-[#9b9a97]'}`}>View</span>}
              </div>
            );
          })}
          {filteredItems.length === 0 && (
            <div className="p-12 text-center bg-white">
              <p className="text-[#5f5e5b] font-bold uppercase tracking-widest text-xs">No entries matched "{query}"</p>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-[#f7f7f5] border-t border-[#e9e9e7] flex items-center justify-between text-[11px] text-[#5f5e5b] font-bold uppercase tracking-widest">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><span className="bg-white px-1.5 py-0.5 rounded border border-[#e9e9e7] text-[#37352f]">↑↓</span> Navigate</span>
            <span className="flex items-center gap-1.5"><span className="bg-white px-1.5 py-0.5 rounded border border-[#e9e9e7] text-[#37352f]">↵</span> Select</span>
            <span className="flex items-center gap-1.5"><span className="bg-white px-1.5 py-0.5 rounded border border-[#e9e9e7] text-[#37352f]">Esc</span> Dismiss</span>
          </div>
          <div className="text-[#37352f]">Command Center</div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
