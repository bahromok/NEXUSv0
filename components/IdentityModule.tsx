
import React, { useState } from 'react';
import { IdentityProfile } from '../types';
import { Shield, Target, Quote, Sparkles, Edit3, Check, X, Plus, Trash2, Hexagon, Anchor, ShieldAlert } from 'lucide-react';

interface IdentityModuleProps {
  profile: IdentityProfile;
  setProfile: (p: IdentityProfile) => void;
}

const IdentityModule: React.FC<IdentityModuleProps> = ({ profile, setProfile }) => {
  const [editingSection, setEditingSection] = useState<'philosophy' | 'archetype' | null>(null);
  const [tempText, setTempText] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newPrinciple, setNewPrinciple] = useState('');
  const [newAntiGoal, setNewAntiGoal] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const saveText = () => {
    if (editingSection === 'philosophy') {
      setProfile({ ...profile, philosophy: tempText });
    } else if (editingSection === 'archetype') {
      setProfile({ ...profile, archetype: tempText });
    }
    setEditingSection(null);
  };

  const addItem = (field: keyof IdentityProfile, value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    const currentList = profile[field] as string[];
    setProfile({ ...profile, [field]: [...currentList, value.trim()] });
    setter('');
  };

  const removeItem = (field: keyof IdentityProfile, index: number) => {
    const currentList = [...(profile[field] as string[])];
    currentList.splice(index, 1);
    setProfile({ ...profile, [field]: currentList });
  };

  return (
    <div className="p-12 md:p-20 max-w-6xl mx-auto h-full overflow-y-auto space-y-24 animate-in fade-in duration-700 pb-40 bg-white scrollbar-hide text-[#37352f]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="flex items-center gap-8">
           <div className="w-24 h-24 bg-[#37352f] rounded-[32px] flex items-center justify-center text-white shadow-2xl rotate-3">
             <Shield size={48} strokeWidth={1.5} />
           </div>
           <div>
             <div className="flex items-center gap-3 mb-2">
                {editingSection === 'archetype' ? (
                  <div className="flex items-center gap-2">
                    <input 
                      autoFocus 
                      value={tempText} 
                      onChange={(e) => setTempText(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && saveText()}
                      className="text-xl font-black uppercase tracking-[0.2em] border-b-2 border-[#37352f] outline-none"
                    />
                    <button onClick={saveText} className="text-[#0f766e]"><Check size={20}/></button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setEditingSection('archetype'); setTempText(profile.archetype); }}
                    className="text-xl font-black uppercase tracking-[0.2em] text-[#838170] hover:text-[#37352f] transition-all flex items-center gap-3 group"
                  >
                    {profile.archetype}
                    <Edit3 size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
             </div>
             <h1 className="text-6xl font-black tracking-tighter">Identity Profile</h1>
           </div>
        </div>
      </header>

      <section className="space-y-8">
        <h3 className="text-[12px] font-black text-[#838170] uppercase tracking-[0.4em] flex items-center gap-6">
          Living Philosophy
          <div className="flex-1 h-px bg-[#f1f1f0]" />
          <button 
              onClick={() => { setEditingSection('philosophy'); setTempText(profile.philosophy); }}
              className="text-[#838170] hover:text-[#37352f] transition-colors"
            >
              <Edit3 size={18} />
          </button>
        </h3>
        {editingSection === 'philosophy' ? (
          <div className="space-y-6">
            <textarea
              autoFocus
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              className="w-full bg-[#fcfcfb] border border-[#e9e9e7] rounded-3xl p-10 text-3xl font-bold outline-none focus:border-[#37352f] transition-all h-64 leading-tight shadow-inner"
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setEditingSection(null)} className="px-6 py-3 text-sm font-bold text-[#838170]">Cancel</button>
              <button onClick={saveText} className="bg-[#37352f] text-white px-10 py-3 rounded-xl text-sm font-bold shadow-lg">Commit to Core</button>
            </div>
          </div>
        ) : (
          <p className="text-4xl md:text-5xl font-black leading-tight tracking-tight max-w-5xl">
            "{profile.philosophy}"
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <Hexagon size={24} className="text-[#37352f]" />
            <h3 className="text-[12px] font-black text-[#838170] uppercase tracking-[0.4em]">Core Axioms</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {profile.values.map((v, i) => (
              <span key={i} className="bg-white border border-[#e9e9e7] px-8 py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-[0.1em] flex items-center gap-5 group hover:border-[#37352f] hover:shadow-md transition-all">
                {v}
                <button onClick={() => removeItem('values', i)} className="text-[#d3d1cb] hover:text-[#eb5757] opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
              </span>
            ))}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('values', newValue, setNewValue)}
                placeholder="New Axiom"
                className="bg-[#f7f7f5] border border-transparent px-8 py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-[0.1em] outline-none focus:bg-white focus:border-[#e9e9e7] w-48 transition-all"
              />
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <Anchor size={24} className="text-[#37352f]" />
            <h3 className="text-[12px] font-black text-[#838170] uppercase tracking-[0.4em]">Operating Principles</h3>
          </div>
          <div className="space-y-4">
            {profile.principles.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-[#fcfcfb] rounded-[24px] border border-[#e9e9e7] hover:border-[#37352f] transition-all group shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="text-[11px] font-black text-[#d3d1cb] w-4">{i + 1}</div>
                  <div className="text-base font-bold tracking-tight">{p}</div>
                </div>
                <button onClick={() => removeItem('principles', i)} className="opacity-0 group-hover:opacity-100 text-[#d3d1cb] hover:text-[#eb5757] transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={newPrinciple}
              onChange={(e) => setNewPrinciple(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem('principles', newPrinciple, setNewPrinciple)}
              placeholder="Define operating guideline..."
              className="w-full bg-[#f7f7f5] border border-transparent px-8 py-5 rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-[#e9e9e7] transition-all"
            />
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <ShieldAlert size={24} className="text-[#eb5757]" />
            <h3 className="text-[12px] font-black text-[#838170] uppercase tracking-[0.4em]">Anti-Goals</h3>
          </div>
          <div className="space-y-4">
            {profile.antiGoals.map((ag, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-[#fffedeb] border border-[#f3ebad] rounded-[24px] hover:border-[#eb5757] transition-all group shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-2 h-2 rounded-full bg-[#eb5757]" />
                  <div className="text-base font-bold tracking-tight text-[#37352f]">{ag}</div>
                </div>
                <button onClick={() => removeItem('antiGoals', i)} className="opacity-0 group-hover:opacity-100 text-[#d3d1cb] hover:text-[#eb5757] transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={newAntiGoal}
              onChange={(e) => setNewAntiGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem('antiGoals', newAntiGoal, setNewAntiGoal)}
              placeholder="What to strictly avoid..."
              className="w-full bg-[#f7f7f5] border border-transparent px-8 py-5 rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-[#e9e9e7] transition-all"
            />
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <Target size={24} className="text-[#2383e2]" />
            <h3 className="text-[12px] font-black text-[#838170] uppercase tracking-[0.4em]">Strategic Horizons</h3>
          </div>
          <div className="space-y-4">
            {profile.longTermGoals.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white rounded-[24px] border border-[#e9e9e7] hover:border-[#2383e2] transition-all group shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="text-[11px] font-black text-[#2383e2] bg-[#ebf5fe] w-8 h-8 rounded-full flex items-center justify-center">{i + 1}</div>
                  <div className="text-base font-bold tracking-tight">{g}</div>
                </div>
                <button onClick={() => removeItem('longTermGoals', i)} className="opacity-0 group-hover:opacity-100 text-[#d3d1cb] hover:text-[#eb5757] transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem('longTermGoals', newGoal, setNewGoal)}
              placeholder="New trajectory..."
              className="w-full bg-[#f7f7f5] border border-transparent px-8 py-5 rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-[#e9e9e7] transition-all"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default IdentityModule;
