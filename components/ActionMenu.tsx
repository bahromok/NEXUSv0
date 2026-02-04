
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, Pin, PinOff, Archive, Sparkles, BrainCircuit } from 'lucide-react';

interface ActionMenuProps {
  onDelete?: () => void;
  onArchive?: () => void;
  onStudy?: () => void;
  onAISummary?: () => void;
  onTogglePin?: () => void;
  isPinned?: boolean;
  customActions?: { label: string; icon: any; onClick: () => void }[];
}

const ActionMenu: React.FC<ActionMenuProps> = ({ 
  onDelete, 
  onArchive, 
  onStudy, 
  onAISummary, 
  onTogglePin, 
  isPinned, 
  customActions 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-2 text-[#9b9a97] hover:text-[#37352f] hover:bg-[#efefed] rounded-xl transition-all"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-56 bg-white border border-[#e9e9e7] rounded-2xl shadow-2xl z-[60] p-2 animate-in zoom-in-95 duration-150 backdrop-blur-md bg-white/90">
          {onTogglePin && (
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePin(); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-bold flex items-center gap-3 hover:bg-[#f7f7f5] rounded-xl transition-all"
            >
              {isPinned ? <PinOff size={16} className="text-[#eb5757]" /> : <Pin size={16} className="text-[#2383e2]" />}
              {isPinned ? 'Unpin Thought' : 'Pin to Top'}
            </button>
          )}
          {onAISummary && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAISummary(); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-bold flex items-center gap-3 hover:bg-[#f7f7f5] rounded-xl transition-all"
            >
              <Sparkles size={16} className="text-[#2383e2]" /> AI Recap
            </button>
          )}
          {onStudy && (
            <button 
              onClick={(e) => { e.stopPropagation(); onStudy(); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-bold flex items-center gap-3 hover:bg-[#f7f7f5] rounded-xl transition-all"
            >
              <BrainCircuit size={16} className="text-[#0f766e]" /> Study Strategy
            </button>
          )}
          
          {(onTogglePin || onAISummary || onStudy) && <div className="h-px bg-[#f1f1f0] my-2 mx-1" />}

          {onArchive && (
            <button 
              onClick={(e) => { e.stopPropagation(); onArchive(); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-semibold flex items-center gap-3 hover:bg-[#f7f7f5] rounded-xl transition-all"
            >
              <Archive size={16} /> Archive Segment
            </button>
          )}
          {customActions?.map((action, i) => (
            <button 
              key={i}
              onClick={(e) => { e.stopPropagation(); action.onClick(); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-semibold flex items-center gap-3 hover:bg-[#f7f7f5] rounded-xl transition-all"
            >
              <action.icon size={16} /> {action.label}
            </button>
          ))}
          {onDelete && (
            <>
              <div className="h-px bg-[#f1f1f0] my-2 mx-1" />
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); setIsOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-[#eb5757] hover:bg-[#ffedeb] rounded-xl flex items-center gap-3 transition-all"
              >
                <Trash2 size={16} /> Purge Item
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
