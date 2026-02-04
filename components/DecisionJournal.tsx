
import React, { useState } from 'react';
import { Decision } from '../types';
import { Plus, GitFork, ArrowUpRight, Scale, X, Trash2, CheckCircle2 } from 'lucide-react';

interface DecisionJournalProps {
  decisions: Decision[];
  setDecisions: React.Dispatch<React.SetStateAction<Decision[]>>;
}

const DecisionJournal: React.FC<DecisionJournalProps> = ({ decisions, setDecisions }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDecision, setNewDecision] = useState<Partial<Decision>>({
    title: '',
    context: '',
    pros: [],
    cons: [],
    impact: 'medium'
  });
  const [currentPro, setCurrentPro] = useState('');
  const [currentCon, setCurrentCon] = useState('');

  const handleAddDecision = () => {
    if (!newDecision.title) return;
    const finalDecision: Decision = {
      id: Math.random().toString(36).substr(2, 9),
      title: newDecision.title!,
      date: Date.now(),
      context: newDecision.context || '',
      pros: newDecision.pros || [],
      cons: newDecision.cons || [],
      impact: newDecision.impact as 'low' | 'medium' | 'high'
    };
    setDecisions(prev => [finalDecision, ...prev]);
    setShowAddModal(false);
    setNewDecision({ title: '', context: '', pros: [], cons: [], impact: 'medium' });
  };

  const removeDecision = (id: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="p-12 max-w-5xl mx-auto h-full flex flex-col space-y-12 animate-in fade-in duration-700 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-black">Decisions</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Audit logs for high-stakes intellectual forks.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
        >
          <Plus size={18} /> Log Insight
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-4 pb-24 scrollbar-hide">
        {decisions.map(decision => (
          <div key={decision.id} className="border border-slate-100 p-10 rounded-[40px] hover:border-slate-300 transition-all group relative bg-white shadow-sm">
            <button 
              onClick={() => removeDecision(decision.id)}
              className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black">
                     <GitFork size={20} />
                   </div>
                   <h3 className="text-2xl font-black text-black tracking-tight">{decision.title}</h3>
                </div>
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-4">
                  <span>{new Date(decision.date).toLocaleDateString()}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-black">{decision.impact.toUpperCase()} IMPACT</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium pl-6 border-l border-slate-100">
              {decision.context}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-3">
                  Pros / Upside
                </h4>
                <ul className="space-y-3">
                  {decision.pros.map((p, i) => (
                    <li key={i} className="text-xs text-slate-500 font-medium flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-3">
                  Cons / Risks
                </h4>
                <ul className="space-y-3">
                  {decision.cons.map((c, i) => (
                    <li key={i} className="text-xs text-slate-500 font-medium flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-100 mt-1.5 shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        {decisions.length === 0 && (
          <div className="text-center py-40 text-slate-200 flex flex-col items-center">
             <Scale size={64} strokeWidth={1} />
             <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-8">No cognitive logs indexed.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/5 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-[48px] p-12 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black mb-10 tracking-tight">Declare Decision</h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Identity</label>
                <input
                  type="text"
                  value={newDecision.title}
                  onChange={(e) => setNewDecision({ ...newDecision, title: e.target.value })}
                  placeholder="The Core Choice..."
                  className="w-full bg-transparent border-b border-slate-100 py-3 text-lg font-bold outline-none focus:border-black transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Contextual Background</label>
                <textarea
                  value={newDecision.context}
                  onChange={(e) => setNewDecision({ ...newDecision, context: e.target.value })}
                  placeholder="Reasoning for this choice..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium outline-none focus:border-black transition-all h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-black uppercase tracking-widest ml-1">Pros</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentPro}
                      onChange={(e) => setCurrentPro(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (setNewDecision({...newDecision, pros: [...newDecision.pros!, currentPro]}), setCurrentPro(''))}
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs"
                      placeholder="Add..."
                    />
                    <button onClick={() => {setNewDecision({...newDecision, pros: [...newDecision.pros!, currentPro]}); setCurrentPro('')}} className="text-black"><Plus size={18}/></button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Cons</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentCon}
                      onChange={(e) => setCurrentCon(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (setNewDecision({...newDecision, cons: [...newDecision.cons!, currentCon]}), setCurrentCon(''))}
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs"
                      placeholder="Add..."
                    />
                    <button onClick={() => {setNewDecision({...newDecision, cons: [...newDecision.cons!, currentCon]}); setCurrentCon('')}} className="text-slate-300 hover:text-black"><Plus size={18}/></button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-8 border-t border-slate-100">
                <button onClick={() => setShowAddModal(false)} className="px-6 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-black">Discard</button>
                <button 
                  onClick={handleAddDecision}
                  className="bg-black text-white px-8 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  Commit Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionJournal;
