
import React, { useState } from 'react';
import { Habit } from '../types';
import { Flame, Check, Plus, Trophy, Trash2, Target, MoreVertical, Calendar } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, setHabits }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [newHabit, setNewHabit] = useState<{
    name: string;
    frequency: 'DAILY' | 'WEEKLY';
    impact: 'LOW' | 'HIGH';
  }>({
    name: '',
    frequency: 'DAILY',
    impact: 'HIGH'
  });

  const toggleDate = (id: string, dateStr: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isLogged = h.logs.includes(dateStr);
        const newLogs = isLogged ? h.logs.filter(d => d !== dateStr) : [...h.logs, dateStr];
        let streak = 0;
        let checkDate = new Date();
        while (true) {
          const dStr = checkDate.toISOString().split('T')[0];
          if (newLogs.includes(dStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (dStr === new Date().toISOString().split('T')[0]) {
             checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
        return { ...h, logs: newLogs, streak };
      }
      return h;
    }));
  };

  const createHabit = () => {
    if (!newHabit.name.trim()) return;
    const habit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name: newHabit.name.trim(),
      streak: 0,
      logs: [],
      frequency: newHabit.frequency,
      impact: newHabit.impact
    };
    setHabits(prev => [habit, ...prev]);
    setNewHabit({ name: '', frequency: 'DAILY', impact: 'HIGH' });
    setShowAddModal(false);
  };

  const handleHabitDelete = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setActiveMenuId(null);
  };

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="p-12 md:p-20 max-w-6xl mx-auto space-y-16 animate-in fade-in duration-500 pb-32 text-[#37352f]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">Rituals</h1>
          <p className="text-[#787774] text-lg font-medium">Compound your intellectual value through structural consistency.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-[#37352f] text-white rounded-2xl text-sm font-bold hover:opacity-95 transition-all shadow-xl active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> Initialize Protocol
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {habits.map(habit => {
          const today = new Date().toISOString().split('T')[0];
          const isDoneToday = habit.logs.includes(today);
          const completionRate = Math.round((habit.logs.filter(l => last30Days.includes(l)).length / 30) * 100);
          
          return (
            <div key={habit.id} className="bg-white border border-[#e9e9e7] p-10 rounded-3xl group hover:shadow-lg transition-all flex flex-col xl:flex-row gap-12 items-start xl:items-center relative">
              
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === habit.id ? null : habit.id)}
                  className="p-2.5 rounded-xl hover:bg-[#f7f7f5] text-[#d3d1cb] hover:text-[#37352f] transition-all border border-transparent hover:border-[#e9e9e7]"
                >
                  <MoreVertical size={22} />
                </button>
                {activeMenuId === habit.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                    <div className="absolute right-0 top-12 w-48 bg-white border border-[#e9e9e7] rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95">
                       <button 
                        onClick={() => handleHabitDelete(habit.id)}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-[#eb5757] hover:bg-[#ffedeb] rounded-xl flex items-center gap-3 transition-colors"
                      >
                        <Trash2 size={16} /> Purge Protocol
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-8 min-w-[340px]">
                <button 
                  onClick={() => toggleDate(habit.id, today)}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all border-2 shrink-0 shadow-sm active:scale-90 ${
                    isDoneToday 
                      ? 'bg-[#2383e2] border-[#2383e2] text-white' 
                      : 'bg-white border-[#d3d1cb] text-[#d3d1cb] hover:border-[#37352f] hover:text-[#37352f]'
                  }`}
                >
                  <Check size={36} strokeWidth={4} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-2xl tracking-tight text-[#37352f] mb-2 truncate">{habit.name}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[12px] font-black text-[#eb5757] bg-[#ffedeb] px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                      <Flame size={14} fill="currentColor" />
                      {habit.streak} Day Streak
                    </div>
                    <div className="text-[11px] font-bold text-[#787774] uppercase tracking-widest bg-[#f7f7f5] px-3 py-1 rounded-full border border-[#e9e9e7]">
                      {habit.frequency}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 space-y-5 w-full">
                <div className="flex justify-between items-center text-[12px] font-bold text-[#787774] uppercase tracking-[0.2em] px-1">
                  <span className="flex items-center gap-2"><Calendar size={14} className="text-[#d3d1cb]"/> Behavioral Matrix</span>
                  <span className="text-[#37352f]">{completionRate}% Intensity</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {last30Days.map(date => (
                    <div 
                      key={date} 
                      onClick={() => toggleDate(habit.id, date)}
                      className={`w-5 h-5 rounded-md transition-all cursor-pointer border shadow-sm ${
                        habit.logs.includes(date) 
                          ? 'bg-[#37352f] border-[#37352f]' 
                          : 'bg-white border-[#e9e9e7] hover:border-[#787774]'
                      } ${date === today ? 'ring-4 ring-[#ebf5fe] ring-offset-1 scale-110' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="bg-[#f7f7f5] border border-[#e9e9e7] rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 text-center md:text-left shadow-inner">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border border-[#e9e9e7] shadow-lg rotate-3">
           <Trophy size={48} className="text-[#37352f]" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-[#37352f] mb-3">Structural Integrity</h2>
          <p className="text-[#787774] text-lg max-w-2xl leading-relaxed font-medium">
            Structural consistency is the catalyst for intellectual compounding. Track your protocols to ensure behavioral alignment with core objectives.
          </p>
        </div>
      </section>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/15 backdrop-blur-[6px]">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-lg bg-white border border-[#e9e9e7] rounded-[48px] p-16 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-extrabold mb-12 tracking-tight">New Protocol</h2>
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[12px] font-bold text-[#787774] uppercase tracking-widest ml-1">Identity</label>
                <input
                  autoFocus
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && createHabit()}
                  placeholder="Identify your new ritual..."
                  className="w-full text-2xl font-bold border-b-2 border-[#f1f1f0] focus:border-[#37352f] transition-all outline-none pb-4 placeholder-[#d3d1cb]"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <button 
                  onClick={() => setNewHabit(prev => ({ ...prev, frequency: prev.frequency === 'DAILY' ? 'WEEKLY' : 'DAILY' }))}
                  className={`p-5 rounded-2xl border-2 text-center transition-all ${newHabit.frequency === 'DAILY' ? 'border-[#37352f] bg-[#f7f7f5] shadow-inner' : 'border-[#f1f1f0] text-[#787774] hover:border-[#d3d1cb]'}`}
                 >
                   <span className="text-[12px] font-extrabold uppercase tracking-widest">{newHabit.frequency} Rhythm</span>
                 </button>
                 <button 
                  onClick={() => setNewHabit(prev => ({ ...prev, impact: prev.impact === 'HIGH' ? 'LOW' : 'HIGH' }))}
                  className={`p-5 rounded-2xl border-2 text-center transition-all ${newHabit.impact === 'HIGH' ? 'border-[#37352f] bg-[#f7f7f5] shadow-inner' : 'border-[#f1f1f0] text-[#787774] hover:border-[#d3d1cb]'}`}
                 >
                   <span className="text-[12px] font-extrabold uppercase tracking-widest">{newHabit.impact} Impact</span>
                 </button>
              </div>
              <div className="flex justify-end gap-6 pt-6">
                <button onClick={() => setShowAddModal(false)} className="px-6 py-3 text-sm font-bold text-[#787774] hover:bg-[#f7f7f5] rounded-xl transition-all">Discard</button>
                <button onClick={createHabit} className="bg-[#37352f] text-white px-10 py-3.5 rounded-2xl text-sm font-bold hover:opacity-95 transition-all shadow-xl active:scale-95">Initialize</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
