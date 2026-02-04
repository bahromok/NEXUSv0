
import React, { useState, useMemo } from 'react';
import { Note } from '../types';
import { FileText, Plus, Search, Pin, ChevronRight, Folder, FolderPlus, X, Check, Filter, LayoutGrid, List } from 'lucide-react';
import ActionMenu from './ActionMenu';

interface NotesVaultProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
  onCreateNote: (title?: string, content?: string, folder?: string) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote?: (id: string, updates: Partial<Note>) => void;
}

const NotesVault: React.FC<NotesVaultProps> = ({ notes, onSelectNote, onCreateNote, onDeleteNote, onUpdateNote }) => {
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const folders = useMemo(() => Array.from(new Set(notes.map(n => n.folder))), [notes]);

  const filteredAndSortedNotes = useMemo(() => {
    return notes
      .filter(n => 
        (search === '' || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())) &&
        (!activeFolder || n.folder === activeFolder)
      )
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, search, activeFolder]);

  const handleTogglePin = (note: Note) => {
    onUpdateNote?.(note.id, { pinned: !note.pinned });
  };

  return (
    <div className="p-4 md:p-12 lg:p-16 max-w-7xl mx-auto h-full flex flex-col gap-6 md:gap-12 animate-in fade-in duration-500 overflow-hidden text-[#37352f]">
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Vault</h1>
          <div className="flex items-center gap-1 bg-[#f7f7f5] p-1 rounded-xl border border-[#e9e9e7]">
             <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#37352f]' : 'text-[#d3d1cb]'}`}><LayoutGrid size={18} /></button>
             <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#37352f]' : 'text-[#d3d1cb]'}`}><List size={18} /></button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d3d1cb]" />
            <input 
              type="text" 
              placeholder="Find thoughts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f7f7f5] border border-[#e9e9e7] pl-12 pr-4 py-3 rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:border-[#37352f] transition-all"
            />
          </div>
          <button 
            onClick={() => onCreateNote()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#37352f] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all"
          >
            <Plus size={18} /> New Page
          </button>
        </div>
      </header>

      {/* Horizontal Folders for mobile / Side for Desktop */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
        <aside className="w-full md:w-56 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide">
          <button onClick={() => setActiveFolder(null)} className={`whitespace-nowrap md:whitespace-normal px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${!activeFolder ? 'bg-[#37352f] text-white' : 'bg-[#f7f7f5] text-[#838170] hover:bg-[#efefed]'}`}>
            All Pages
          </button>
          {folders.map(folder => (
            <button key={folder} onClick={() => setActiveFolder(folder)} className={`whitespace-nowrap md:whitespace-normal px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${activeFolder === folder ? 'bg-[#37352f] text-white' : 'bg-[#f7f7f5] text-[#838170] hover:bg-[#efefed]'}`}>
              {folder}
            </button>
          ))}
        </aside>

        <div className="flex-1 overflow-y-auto pr-2 pb-32 md:pb-12 scrollbar-hide">
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6" : "flex flex-col gap-3"}>
            {filteredAndSortedNotes.map(note => (
              <div 
                key={note.id} 
                onClick={() => onSelectNote(note.id)} 
                className={`group border border-[#e9e9e7] bg-white transition-all cursor-pointer flex hover:shadow-md ${
                  viewMode === 'grid' 
                    ? 'p-6 rounded-3xl flex-col min-h-[160px]' 
                    : 'p-4 rounded-2xl items-center gap-4'
                }`}
              >
                <div className={`shrink-0 flex items-center justify-center rounded-xl bg-[#f7f7f5] text-[#838170] ${viewMode === 'grid' ? 'w-10 h-10 mb-4' : 'w-12 h-12'}`}>
                  {note.pinned ? <Pin size={18} className="text-[#2383e2] fill-[#2383e2]" /> : <FileText size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-black text-[#37352f] tracking-tight group-hover:text-[#2383e2] truncate ${viewMode === 'grid' ? 'text-lg mb-1' : 'text-base'}`}>
                    {note.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-[#838170] font-bold uppercase tracking-widest mb-2">
                    {note.folder} • {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                  {viewMode === 'grid' && (
                    <p className="text-xs text-[#5f5e5b] line-clamp-2 leading-relaxed font-medium">
                      {note.content.replace(/[#*`[\]]/g, '')}
                    </p>
                  )}
                </div>

                <div onClick={(e) => e.stopPropagation()} className="shrink-0 ml-auto">
                  <ActionMenu 
                    onDelete={() => onDeleteNote(note.id)} 
                    onTogglePin={() => handleTogglePin(note)}
                    isPinned={note.pinned}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {filteredAndSortedNotes.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-[#d3d1cb] border-2 border-dashed border-[#e9e9e7] rounded-[40px]">
              <FileText size={48} strokeWidth={1} className="opacity-50" />
              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.4em]">Empty Cluster</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesVault;
