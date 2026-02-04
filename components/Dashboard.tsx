
import React, { useState, useMemo } from 'react';
import { Note, Task, Habit } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  FileText, TrendingUp, CheckCircle, Flame, BrainCircuit, Activity, ChevronRight, RefreshCw, Zap
} from 'lucide-react';

interface DashboardProps {
  notes: Note[];
  tasks: Task[];
  habits: Habit[];
  onSelectNote: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ notes, tasks, habits, onSelectNote }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optProgress, setOptProgress] = useState(0);

  const stats = useMemo(() => {
    const totalLinks = notes.reduce((acc, note) => {
      const matches = note.content.match(/\[\[(.*?)\]\]/g);
      return acc + (matches ? matches.length : 0);
    }, 0);
    const density = notes.length > 0 ? (totalLinks / notes.length).toFixed(1) : "0";
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
    return { density, completedTasks, maxStreak };
  }, [notes, tasks, habits]);

  const runOptimization = () => {
    setIsOptimizing(true);
    setOptProgress(0);
    const interval = setInterval(() => {
      setOptProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsOptimizing(false), 800);
          return 100;
        }
        return p + 10;
      });
    }, 40);
  };

  const recentNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
  const activeTasks = tasks.filter(t => t.status !== 'done').slice(0, 4);

  return (
    <div className="p-4 md:p-12 lg:p-16 max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-32 text-[#37352f]">
      <header>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2">Workspace</h1>
        <p className="text-[#838170] text-sm md:text-lg font-medium">Capture ideas and optimize mental flow.</p>
      </header>

      {/* Stat Cards - Horizontal scroll on mobile */}
      <section className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto scrollbar-hide pb-2">
        {[
          { label: 'Pages', val: notes.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Streak', val: `${stats.maxStreak}d`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Tasks', val: activeTasks.length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Density', val: stats.density, icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-50' }
        ].map((s, i) => (
          <div key={i} className="min-w-[140px] flex-1 bg-white border border-[#e9e9e7] p-5 rounded-[24px] shadow-sm flex flex-col justify-between h-32">
            <div className={`w-8 h-8 ${s.bg} ${s.color} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon size={16} />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight">{s.val}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#d3d1cb]">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <section>
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-[11px] font-black text-[#838170] uppercase tracking-[0.3em]">Recent Synthesis</h3>
               <button className="text-[10px] font-black text-[#2383e2] uppercase tracking-widest hover:underline">View All</button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentNotes.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => onSelectNote(note.id)}
                  className="bg-white border border-[#e9e9e7] p-5 rounded-3xl hover:border-[#37352f] transition-all cursor-pointer group flex flex-col h-full shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black text-[#d3d1cb] uppercase tracking-widest">{note.folder}</span>
                    <span className="text-[9px] font-bold text-[#d3d1cb]">{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-black text-lg tracking-tight mb-2 group-hover:text-[#2383e2] transition-colors">{note.title}</h4>
                  <p className="text-xs text-[#838170] line-clamp-2 leading-relaxed font-medium mb-4">
                    {note.content.replace(/[#*`[\]]/g, '')}
                  </p>
                  <div className="mt-auto flex justify-end">
                    <ChevronRight size={16} className="text-[#d3d1cb] group-hover:text-[#37352f]" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#37352f] text-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <BrainCircuit size={200} />
             </div>
             <div className="relative z-10 max-w-lg">
               <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 leading-none">Your Second Brain is Active.</h2>
               <p className="text-sm md:text-base text-white/60 font-medium mb-8 leading-relaxed">
                 Semantic density has increased by 12% this week. Your primary focus cluster is "{notes[0]?.folder || 'General'}".
               </p>
               <button onClick={runOptimization} className="bg-white text-[#37352f] px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                 {isOptimizing ? `Syncing ${optProgress}%` : 'Recalibrate Graph'}
               </button>
             </div>
          </section>
        </div>

        <aside className="space-y-8 md:space-y-12">
          <section>
            <h3 className="text-[11px] font-black text-[#838170] uppercase tracking-[0.3em] mb-6">Active Focus</h3>
            <div className="space-y-3">
              {activeTasks.map(task => (
                <div key={task.id} className="flex items-center gap-4 p-4 bg-white border border-[#e9e9e7] rounded-2xl shadow-sm">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    task.priority === 'high' ? 'bg-[#eb5757]' : 'bg-[#2383e2]'
                  }`} />
                  <span className="text-sm font-bold truncate text-[#37352f]">{task.title}</span>
                </div>
              ))}
              {activeTasks.length === 0 && (
                 <div className="p-8 text-center border-2 border-dashed border-[#e9e9e7] rounded-3xl text-[#d3d1cb]">
                   <p className="text-[10px] font-black uppercase tracking-widest">No Active Tasks</p>
                 </div>
              )}
            </div>
          </section>

          <section className="bg-[#f7f7f5] border border-[#e9e9e7] rounded-[32px] p-8 text-center space-y-4 shadow-inner">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-[#e9e9e7]">
               <Zap size={24} className="text-[#37352f]" />
             </div>
             <div className="space-y-1">
                <h4 className="text-lg font-black tracking-tight">Ritual Check</h4>
                <p className="text-[10px] font-bold text-[#838170] uppercase tracking-widest leading-relaxed">
                  Deep work streak: {stats.maxStreak} days.
                </p>
             </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
