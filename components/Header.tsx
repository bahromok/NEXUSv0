
import React from 'react';
import { Search, Bell, HelpCircle, Command, Menu } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onOpenPalette: () => void;
  onOpenHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onOpenPalette, onOpenHelp }) => {
  return (
    <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#f1f1f0]">
      <div className="flex items-center gap-3 md:gap-4">
        <h2 className="text-[10px] md:text-[11px] font-black text-[#838170] uppercase tracking-[0.2em]">{currentView.replace('_', ' ')}</h2>
        <div className="h-4 w-px bg-[#e9e9e7]" />
        
        {/* Mobile Search Button */}
        <button 
          onClick={onOpenPalette}
          className="sm:hidden p-2 text-[#838170] active:scale-95 transition-transform"
        >
          <Search size={18} />
        </button>

        {/* Desktop Search */}
        <div 
          onClick={onOpenPalette}
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[#f7f7f5] border border-transparent hover:border-[#e9e9e7] cursor-pointer group transition-all"
        >
          <Search size={14} className="text-[#d3d1cb] group-hover:text-[#838170]" />
          <span className="text-sm text-[#838170] font-medium">Quick find...</span>
          <div className="hidden lg:flex items-center gap-1 bg-[#efefed] px-1.5 py-0.5 rounded text-[9px] text-[#838170] font-black">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onOpenHelp} className="p-2 rounded-xl hover:bg-[#f7f7f5] text-[#838170] transition-all">
          <HelpCircle size={18} md:size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
