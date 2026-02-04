import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../types';
import { 
  Folder, MoreVertical, ChevronLeft, Trash2, Clock, Maximize2, Minimize2, Eye, EyeOff, 
  Bold, Italic, List, Table, Type, Share2, Brain, CheckSquare, ChevronDown
} from 'lucide-react';

interface NoteEditorProps {
  note: Note | null;
  allNotes: Note[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onSelectNote: (id: string) => void;
  onClose: () => void;
  notesList: Note[];
  onDelete?: (id: string) => void;
}

const renderMarkdown = (text: string) => {
  if (!text) return '';
  
  // Basic sanitation and standard markdown replacements
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl md:text-4xl font-black mb-6 mt-8">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-black mb-4 mt-6">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-4">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[\[(.*?)\]\]/g, '<span class="text-[#2383e2] cursor-pointer hover:underline font-bold" data-link="$1">[[$1]]</span>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[#e9e9e7] pl-4 py-1 my-4 italic text-[#838170]">$1</blockquote>')
    .replace(/`(.*?)`/g, '<code class="bg-[#f7f7f5] px-1 rounded font-mono text-sm">$1</code>');

  const lines = html.split('\n');
  let result = [];
  let currentTable: string[][] = [];
  let inTable = false;
  let inList = false;

  const flushTable = () => {
    if (currentTable.length > 0) {
      let tableHtml = '<div class="overflow-x-auto my-6"><table class="professional-table"><thead><tr>';
      currentTable[0].forEach(header => {
        tableHtml += `<th>${header}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';
      for (let j = 1; j < currentTable.length; j++) {
        tableHtml += '<tr>';
        currentTable[j].forEach(cell => {
          tableHtml += `<td>${cell}</td>`;
        });
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table></div>';
      result.push(tableHtml);
      currentTable = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Table detection
    if (line.startsWith('|')) {
      inTable = true;
      const cells = line.split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
      if (!line.includes('---')) {
        currentTable.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
      inTable = false;
    }

    // List detection
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        result.push('<ul class="prose-list space-y-1 my-4">');
        inList = true;
      }
      result.push(`<li>${line.substring(2)}</li>`);
      continue;
    } else if (inList) {
      result.push('</ul>');
      inList = false;
    }

    if (line === '') {
      result.push('<div class="h-4"></div>');
    } else {
      result.push(`<p class="mb-4">${line}</p>`);
    }
  }

  if (inTable) flushTable();
  if (inList) result.push('</ul>');

  return result.join('');
};

const NoteEditor: React.FC<NoteEditorProps> = ({ note, allNotes, onUpdate, onSelectNote, onClose, onDelete }) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  if (!note) return (
    <div className="flex h-full items-center justify-center bg-white text-[#d3d1cb] uppercase font-black text-[10px] tracking-[0.4em] animate-pulse">
      Linking Neural Channels...
    </div>
  );

  const applyFormatting = (prefix: string, suffix: string = '', isLineStart: boolean = false) => {
    if (!textAreaRef.current) return;
    const { selectionStart, selectionEnd, value } = textAreaRef.current;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const before = value.substring(0, selectionStart);
    const after = value.substring(selectionEnd);
    
    let newValue: string;
    let newCursorPos: number;

    if (isLineStart) {
      const lineStart = before.lastIndexOf('\n') + 1;
      const beforeLine = value.substring(0, lineStart);
      const rest = value.substring(lineStart);
      newValue = `${beforeLine}${prefix}${rest}`;
      newCursorPos = selectionStart + prefix.length;
    } else {
      newValue = `${before}${prefix}${selectedText}${suffix}${after}`;
      newCursorPos = selectionStart + prefix.length + selectedText.length;
    }

    onUpdate(note.id, { content: newValue });
    
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const insertTable = () => applyFormatting('\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Row 1 | Data |\n| Row 2 | Data |\n', '');
  const insertChecklist = () => applyFormatting('- [ ] ', '', true);

  return (
    <div className="flex flex-col h-full bg-white text-[#37352f] overflow-hidden">
      <header className={`flex items-center justify-between px-4 md:px-6 h-14 border-b border-[#f1f1f0] shrink-0 transition-all duration-300 ${isFocusMode ? 'bg-[#fcfcfb] shadow-sm' : 'bg-white'}`}>
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          {!isFocusMode && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#efefed] rounded-xl text-[#838170] transition-all shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2 text-[10px] font-black text-[#d3d1cb] uppercase tracking-widest truncate">
            <span className="flex items-center gap-1"><Folder size={12} /> {note.folder}</span>
            <span className="hidden md:inline">/</span>
            <span className="text-[#37352f] font-extrabold truncate max-w-[120px] md:max-w-[200px]">{note.title || 'Untitled'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
           <button 
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-2 rounded-xl transition-all ${isFocusMode ? 'bg-[#37352f] text-white' : 'text-[#838170] hover:bg-[#efefed]'}`}
            title="Toggle Focus"
          >
            {isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
           <button 
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
              isPreview ? 'bg-[#37352f] text-white border-[#37352f]' : 'bg-white text-[#838170] border-[#e9e9e7] hover:bg-[#f7f7f5]'
            }`}
          >
            {isPreview ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="hidden sm:inline">{isPreview ? 'Reading' : 'Editing'}</span>
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-[#838170] hover:text-[#37352f] rounded-xl hover:bg-[#efefed] transition-all"
            >
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-[#e9e9e7] rounded-2xl shadow-2xl z-[110] p-2 animate-in zoom-in-95 duration-100">
                <button onClick={() => {onDelete?.(note.id); onClose();}} className="w-full text-left px-3 py-2 text-sm font-bold text-[#eb5757] hover:bg-[#ffedeb] rounded-xl flex items-center gap-3">
                  <Trash2 size={16} /> Delete Page
                </button>
                <button onClick={() => window.print()} className="w-full text-left px-3 py-2 text-sm font-bold text-[#37352f] hover:bg-[#f7f7f5] rounded-xl flex items-center gap-3">
                  <Share2 size={16} /> PDF Export
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {!isPreview && (
        <div className="flex items-center gap-1 px-4 py-2 border-b border-[#f1f1f0] bg-[#fcfcfb] overflow-x-auto scrollbar-hide shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center bg-white border border-[#e9e9e7] rounded-xl px-1 shadow-sm">
            <button onClick={() => applyFormatting('# ', '', true)} className="p-2 hover:bg-[#f7f7f5] rounded-lg text-[#37352f] font-black text-xs">H1</button>
            <button onClick={() => applyFormatting('## ', '', true)} className="p-2 hover:bg-[#f7f7f5] rounded-lg text-[#37352f] font-black text-xs">H2</button>
          </div>
          <div className="w-px h-6 bg-[#e9e9e7] mx-1" />
          <div className="flex items-center bg-white border border-[#e9e9e7] rounded-xl px-1 shadow-sm">
            <button onClick={() => applyFormatting('**', '**')} className="p-2 hover:bg-[#f7f7f5] rounded-lg text-[#37352f]"><Bold size={18} /></button>
            <button onClick={() => applyFormatting('*', '*')} className="p-2 hover:bg-[#f7f7f5] rounded-lg text-[#37352f]"><Italic size={18} /></button>
            <button onClick={() => applyFormatting('- ', '', true)} className="p-2 hover:bg-[#f7f7f5] rounded-lg text-[#37352f]"><List size={18} /></button>
            <button onClick={insertChecklist} className="p-2 hover:bg-[#f7f7f5] rounded-lg text-[#37352f]"><CheckSquare size={18} /></button>
          </div>
          <div className="w-px h-6 bg-[#e9e9e7] mx-1" />
          <div className="flex items-center bg-white border border-[#e9e9e7] rounded-xl px-1 shadow-sm">
            <button onClick={insertTable} className="p-2 hover:bg-[#f7f7f5] rounded-lg text-[#37352f]"><Table size={18} /></button>
            <button onClick={() => applyFormatting('[[', ']]')} className="p-2 hover:bg-[#f7f7f5] rounded-lg text-[#2383e2]"><Brain size={18} /></button>
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto px-6 md:px-20 lg:px-40 xl:px-64 py-8 md:py-16 custom-scroll bg-white transition-all duration-500 ${isFocusMode ? 'max-w-5xl mx-auto w-full' : ''}`}>
        <div className="space-y-8 md:space-y-12">
          <input
            type="text"
            value={note.title}
            onChange={(e) => onUpdate(note.id, { title: e.target.value })}
            className="w-full bg-transparent text-3xl md:text-5xl font-black text-[#37352f] outline-none placeholder-[#f1f1f0] tracking-tight border-none focus:ring-0"
            placeholder="Header Idea..."
          />
          
          <div className="min-h-[50vh] pb-32">
            {isPreview ? (
              <div 
                className="prose prose-neutral max-w-none text-[#37352f] leading-relaxed font-medium selection:bg-blue-100"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) || '<span class="text-[#d3d1cb] italic tracking-wide">Empty neural channel. Start expanding...</span>' }}
              />
            ) : (
              <textarea
                ref={textAreaRef}
                value={note.content}
                onChange={(e) => onUpdate(note.id, { content: e.target.value })}
                className="w-full h-full min-h-[400px] bg-transparent text-lg text-[#37352f] outline-none resize-none leading-relaxed placeholder-[#f1f1f0] border-none font-medium selection:bg-blue-100 custom-scroll focus:ring-0"
                placeholder="Begin deep conceptual synthesis... (Supports Markdown)"
              />
            )}
          </div>
        </div>
      </div>

      <footer className="h-10 border-t border-[#f1f1f0] bg-[#fcfcfb] flex items-center justify-between px-4 text-[10px] font-black text-[#d3d1cb] uppercase tracking-[0.2em] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>Updated {new Date(note.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Type size={12} />
            <span>{note.content.length} chars</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#37352f] font-extrabold cursor-pointer hover:text-[#2383e2]" onClick={() => setIsPreview(!isPreview)}>
          {isPreview ? 'Reading Mode' : 'Editing Mode'}
        </div>
      </footer>
    </div>
  );
};

export default NoteEditor;