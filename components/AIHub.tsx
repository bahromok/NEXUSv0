
import React, { useState } from 'react';
import { Note, Task, Habit } from '../types';
import { generateBrainInsights } from '../services/aiService';
import { 
  Brain, Sparkles, ArrowRight, RotateCcw, Zap, Info, Lightbulb, ClipboardCheck, BookOpenCheck, CheckCircle2, PlusCircle
} from 'lucide-react';

interface AIHubProps {
  notes: Note[];
  tasks: Task[];
  habits: Habit[];
  onAddTask: (task: any) => void;
  onAddHabit: (habit: any) => void;
  onNotify: (msg: string, type: 'info' | 'success' | 'ai') => void;
}

const AIHub: React.FC<AIHubProps> = ({ notes, tasks, habits, onAddTask, onAddHabit, onNotify }) => {
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeBrain = async () => {
    if (notes.length === 0) {
      onNotify("Neural vault is empty. Synthesis impossible.", "info");
      return;
    }
    setIsLoading(true);
    try {
      const result = await generateBrainInsights(notes, tasks, habits);
      setInsights(result);
      onNotify("Global Brain Synthesis Complete.", "ai");
    } catch (e) {
      onNotify("Neural Link Disrupted.", "info");
    } finally {
      setIsLoading(false);
    }
  };

  const commitTask = (task: any) => {
    // Ensure priority is handled correctly for the Task interface
    const priority = (task.priority || 'medium').toLowerCase() as 'low' | 'medium' | 'high';
    onAddTask({
      title: task.title,
      description: task.description,
      priority: priority,
    });
    setInsights((prev: any) => ({
      ...prev,
      recommendedTasks: prev.recommendedTasks.filter((t: any) => t.title !== task.title)
    }));
    onNotify(`Objective anchored: ${task.title}`, "success");
  };

  const commitHabit = (habit: any) => {
    onAddHabit({
      name: habit.name,
      frequency: habit.frequency?.toUpperCase() || 'DAILY',
      impact: habit.impact?.toUpperCase() || 'HIGH',
    });
    setInsights((prev: any) => ({
      ...prev,
      recommendedHabits: prev.recommendedHabits.filter((h: any) => h.name !== habit.name)
    }));
    onNotify(`Ritual initialized: ${habit.name}`, "success");
  };

  return (
    <div className="p-6 md:p-16 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32 text-[#37352f] overflow-y-auto h-full scrollbar-hide">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#f1f1f0] pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[#2383e2]">
            <Brain size={28} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Layer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">Intelligence Hub</h1>
          <p className="text-[#838170] font-medium text-lg">A unified executive summary and strategic guide for your second brain.</p>
        </div>
        <button 
          onClick={analyzeBrain}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-[#37352f] text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <RotateCcw size={20} className="animate-spin" /> : <Sparkles size={20} />}
          {isLoading ? "Synthesizing..." : "Request Intelligence Update"}
        </button>
      </header>

      {insights ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-6 duration-500">
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-[#f7f7f5] border border-[#e9e9e7] p-8 md:p-12 rounded-[40px] shadow-inner space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                 <BookOpenCheck size={120} />
               </div>
               <div className="flex items-center gap-3 text-[#838170]">
                  <BookOpenCheck size={20} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Executive Summary</h3>
               </div>
               <p className="text-xl md:text-2xl font-bold tracking-tight leading-relaxed text-[#37352f] relative z-10">
                 {insights.overallSummary}
               </p>
            </section>

            <section className="bg-white border border-[#e9e9e7] p-8 md:p-12 rounded-[40px] shadow-sm space-y-6">
               <div className="flex items-center gap-3 text-[#0f766e]">
                  <Lightbulb size={20} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Strategic Advice</h3>
               </div>
               <p className="text-lg font-medium leading-relaxed text-[#5f5e5b] italic">
                 "{insights.generalAdvice}"
               </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-[#838170] px-2">
                <ClipboardCheck size={20} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Actionable Objectives</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.recommendedTasks.length > 0 ? insights.recommendedTasks.map((t: any, i: number) => (
                  <div key={i} className="bg-white border border-[#e9e9e7] p-8 rounded-[32px] hover:border-[#37352f] transition-all flex flex-col group">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-black">{t.title}</h4>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${t.priority?.toLowerCase() === 'high' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-sm text-[#838170] font-medium mb-8 leading-relaxed italic">{t.description}</p>
                    <button 
                      onClick={() => commitTask(t)}
                      className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-[#f7f7f5] text-[#37352f] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#37352f] hover:text-white transition-all group-hover:shadow-md"
                    >
                      <PlusCircle size={16} /> Accept Objective
                    </button>
                  </div>
                )) : (
                  <div className="col-span-2 py-10 text-center border-2 border-dashed border-[#e9e9e7] rounded-3xl text-[#d3d1cb]">
                    <CheckCircle2 size={32} className="mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No pending recommendations</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-10">
             <section className="space-y-6">
                <div className="flex items-center gap-3 text-[#838170] px-2">
                  <Zap size={20} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Proposed Rituals</h3>
                </div>
                <div className="space-y-4">
                  {insights.recommendedHabits.length > 0 ? insights.recommendedHabits.map((h: any, i: number) => (
                    <div key={i} className="bg-white border border-[#e9e9e7] p-6 rounded-3xl flex flex-col gap-6 hover:border-[#2383e2] transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-base font-black">{h.name}</div>
                          <div className="text-[9px] font-bold text-[#d3d1cb] uppercase tracking-widest">{h.frequency} • {h.impact} Impact</div>
                        </div>
                        <div className="p-3 bg-[#f7f7f5] rounded-2xl text-[#2383e2]">
                          <Zap size={20} />
                        </div>
                      </div>
                      <button 
                        onClick={() => commitHabit(h)}
                        className="w-full py-3 bg-[#f7f7f5] text-[#37352f] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2383e2] hover:text-white transition-all"
                      >
                        Adopt Ritual
                      </button>
                    </div>
                  )) : (
                    <div className="py-10 text-center border-2 border-dashed border-[#e9e9e7] rounded-3xl text-[#d3d1cb]">
                      <p className="text-[10px] font-black uppercase tracking-widest">Rituals in Sync</p>
                    </div>
                  )}
                </div>
             </section>

             <section className="bg-[#37352f] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Brain size={100} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-[#838170]">Neural Density</h3>
                <div className="text-5xl font-black mb-4 tracking-tighter">{(notes.length * 1.5 + tasks.length * 0.5).toFixed(0)}%</div>
                <p className="text-[10px] font-bold text-[#838170] uppercase leading-relaxed tracking-wider">
                  Total intellectual surface area utilized. Cross-referencing {notes.length} pages.
                </p>
             </section>
          </aside>
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-[#d3d1cb] opacity-50 space-y-8">
          <Brain size={120} strokeWidth={1} className="animate-pulse" />
          <div className="text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.5em]">System Idle</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Request an Intelligence Update to start synthesis.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHub;
