
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Share2, 
  CheckSquare, 
  Zap, 
  Book, 
  Settings, 
  Shield,
  Plus,
  Network
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onCreateNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onCreateNote }) => {
  const navItems = [
    { id: ViewType.DASHBOARD, label: 'Home', icon: LayoutDashboard },
    { id: ViewType.NOTES, label: 'Notes', icon: FileText },
    { id: ViewType.TASKS, label: 'Tasks', icon: CheckSquare },
    { id: ViewType.HABITS, label: 'Rituals', icon: Zap },
    { id: ViewType.IDENTITY, label: 'Identity', icon: Shield },
  ];

  const secondaryItems = [
    { id: ViewType.GRAPH, label: 'Map', icon: Network },
    { id: ViewType.STUDY, label: 'Academy', icon: Book },
    { id: ViewType.SETTINGS, label: 'System', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-full bg-[#f7f7f5] border-r border-[#e9e9e7] p-4 gap-8 z-50">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="w-8 h-8 bg-[#37352f] rounded-lg flex items-center justify-center text-white font-black text-sm">N</div>
          <span className="font-bold text-sm tracking-tight">NEXUS VAULT</span>
        </div>

        <button 
          onClick={onCreateNote}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-[#e9e9e7] rounded-xl text-xs font-bold hover:shadow-sm transition-all text-[#37352f]"
        >
          <Plus size={14} /> New Thought
        </button>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-black text-[#d3d1cb] uppercase tracking-widest">Main</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === item.id 
                  ? 'bg-[#efefed] text-[#37352f]' 
                  : 'text-[#838170] hover:bg-[#efefed] hover:text-[#37352f]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          
          <div className="px-3 mt-6 mb-2 text-[10px] font-black text-[#d3d1cb] uppercase tracking-widest">Tools</div>
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === item.id 
                  ? 'bg-[#efefed] text-[#37352f]' 
                  : 'text-[#838170] hover:bg-[#efefed] hover:text-[#37352f]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[#e9e9e7]">
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#838170]">Status: Synced</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Enhanced for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-[#e9e9e7] px-4 flex items-center justify-around z-[100] pb-2 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all relative ${
              currentView === item.id ? 'text-[#37352f] bg-[#f7f7f5]' : 'text-[#d3d1cb]'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[9px] font-bold mt-1 tracking-tight">{item.label}</span>
            {currentView === item.id && (
              <div className="absolute -top-1 w-6 h-1 bg-[#37352f] rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
