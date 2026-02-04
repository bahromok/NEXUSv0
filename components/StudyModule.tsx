
import React, { useState, useMemo } from 'react';
import { Quiz, Note, MindMapNode } from '../types';
import { 
  GraduationCap, BrainCircuit, CheckCircle2, ArrowRight, RotateCcw, Timer, Trophy, 
  BookOpen, ChevronLeft, Keyboard, Network, ClipboardList, Play, AlertCircle, HelpCircle,
  Plus, Sparkles, Folder, Search
} from 'lucide-react';
import { generateQuiz, generateMindMap } from '../services/aiService';
import MindMap from './MindMap';
import ActionMenu from './ActionMenu';

interface StudyModuleProps {
  quizzes: Quiz[];
  setQuizzes: (qs: Quiz[]) => void;
  notes: Note[];
  // Added onNotify to handle notifications within the module
  onNotify: (message: string, type: 'info' | 'success' | 'ai') => void;
}

type Mode = 'VAULT' | 'QUIZ_PLAY' | 'MINDMAP' | 'LAB';

const StudyModule: React.FC<StudyModuleProps> = ({ quizzes, setQuizzes, notes, onNotify }) => {
  const [mode, setMode] = useState<Mode>('VAULT');
  const [activeMindMap, setActiveMindMap] = useState<MindMapNode | null>(null);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Quiz Session State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string>('');

  const folders = useMemo(() => Array.from(new Set(quizzes.map(q => q.folder))), [quizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => 
      (searchQuery === '' || q.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!activeFolder || q.folder === activeFolder)
    );
  }, [quizzes, searchQuery, activeFolder]);

  const handleGenerateContent = async (type: 'quiz' | 'map') => {
    const note = notes.find(n => n.id === activeNoteId);
    if (!note) return;

    setIsGenerating(true);
    try {
      if (type === 'quiz') {
        const result = await generateQuiz(note.title, note.content);
        if (result && result.length > 0) {
          const newQuiz: Quiz = {
            id: Math.random().toString(36).substr(2, 9),
            title: `Simulation: ${note.title}`,
            folder: note.folder,
            questions: result,
            createdAt: Date.now()
          };
          setQuizzes([...quizzes, newQuiz]);
          setMode('VAULT');
          // Fix: Using onNotify instead of unhandled success state
          onNotify("Neural simulation constructed successfully.", "success");
        }
      } else if (type === 'map') {
        const result = await generateMindMap(note.title, note.content);
        setActiveMindMap(result);
        setMode('MINDMAP');
        // Fix: Using onNotify instead of unhandled success state
        onNotify("Hierarchical map rendered.", "success");
      }
    } catch (err) {
      // Fix: Using onNotify instead of alert
      onNotify("Neural extraction failed. Please check your connectivity and try again.", "info");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (opt: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt);
    if (opt === activeQuiz?.questions[qIndex].correctAnswer) setQuizScore(prev => prev + 1);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    if (qIndex < activeQuiz.questions.length - 1) {
      setQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQIndex(0);
    setQuizFinished(false);
    setQuizScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setMode('QUIZ_PLAY');
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
  };

  // --- RENDERING MODES ---

  if (mode === 'VAULT') {
    return (
      <div className="p-12 md:p-20 max-w-7xl mx-auto h-full flex flex-col gap-16 animate-in fade-in duration-500 overflow-hidden text-[#37352f]">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-3">Academy Vault</h1>
            <p className="text-[#5f5e5b] text-lg font-medium italic">Simulations and hierarchical maps of your intelligence.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative border-b-2 border-[#e9e9e7] focus-within:border-[#37352f] transition-all pb-2 group">
              <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#838170]" />
              <input type="text" placeholder="Search simulations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent pl-8 pr-4 py-2 text-base outline-none w-full sm:w-64 font-medium" />
            </div>
            <button onClick={() => setMode('LAB')} className="flex items-center gap-2.5 px-8 py-3.5 bg-[#37352f] text-white rounded-2xl text-sm font-bold hover:opacity-95 shadow-xl transition-all">
              <Plus size={20} /> Synthesize Asset
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row gap-20 overflow-hidden">
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1.5 overflow-y-auto pr-4 scrollbar-hide">
            <h3 className="text-[12px] font-bold text-[#838170] uppercase tracking-[0.3em] mb-6 flex items-center gap-2 px-3">
              <Folder size={14} /> Clusters
            </h3>
            <button onClick={() => setActiveFolder(null)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${!activeFolder ? 'bg-[#efefed]' : 'text-[#5f5e5b] hover:bg-[#efefed]'}`}>
              Global Simulations
            </button>
            {folders.map(f => (
              <button key={f} onClick={() => setActiveFolder(f)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${activeFolder === f ? 'bg-[#efefed]' : 'text-[#5f5e5b] hover:bg-[#efefed]'}`}>
                <span className="truncate">{f}</span>
              </button>
            ))}
          </aside>

          <div className="flex-1 overflow-y-auto pr-6 pb-40 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredQuizzes.map(quiz => (
                <div key={quiz.id} className="group border border-[#e9e9e7] bg-white p-8 rounded-3xl hover:bg-[#f7f7f5] transition-all cursor-pointer shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 bg-[#f7f7f5] rounded-xl flex items-center justify-center text-[#2383e2] group-hover:bg-white">
                      <ClipboardList size={20} />
                    </div>
                    <ActionMenu onDelete={() => deleteQuiz(quiz.id)} />
                  </div>
                  <h3 className="text-xl font-extrabold mb-2 tracking-tight">{quiz.title}</h3>
                  <p className="text-xs font-bold text-[#838170] uppercase tracking-widest mb-6">{quiz.folder} Cluster</p>
                  
                  <div className="mt-auto pt-6 border-t border-[#f1f1f0] flex items-center justify-between">
                     <span className="text-[10px] font-black text-[#d3d1cb] uppercase">{quiz.questions.length} Concepts</span>
                     <button onClick={() => startQuiz(quiz)} className="p-3 bg-[#37352f] text-white rounded-xl shadow-lg active:scale-95 transition-all">
                       <Play size={16} fill="currentColor" />
                     </button>
                  </div>
                </div>
              ))}
              {filteredQuizzes.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#d3d1cb] border-2 border-dashed border-[#e9e9e7] rounded-[40px]">
                  <AlertCircle size={48} strokeWidth={1} />
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em]">Queue Cleared</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'LAB') {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-12 overflow-auto animate-in fade-in duration-500">
        <button onClick={() => setMode('VAULT')} className="absolute top-12 left-12 p-4 text-[#838170] hover:text-[#37352f] transition-all">
          <ChevronLeft size={32} />
        </button>
        <div className="max-w-3xl w-full space-y-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-[#37352f] rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl rotate-3">
              <Sparkles size={40} />
            </div>
            <h2 className="text-5xl font-black tracking-tighter">Deconstructive AI Lab</h2>
            <p className="text-xl text-[#838170] font-medium leading-tight">Extract simulations or map topological hierarchies.</p>
          </div>
          <div className="space-y-8 bg-[#f7f7f5] p-12 rounded-[48px] border border-[#e9e9e7]">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-[#838170] uppercase tracking-[0.3em] ml-2">Knowledge Source</label>
               <select value={activeNoteId} onChange={(e) => setActiveNoteId(e.target.value)} className="w-full bg-white border border-[#e9e9e7] px-8 py-5 rounded-[24px] text-lg font-bold outline-none">
                 <option value="">Select a Note...</option>
                 {notes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
               </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <button disabled={!activeNoteId || isGenerating} onClick={() => handleGenerateContent('quiz')} className="p-8 bg-white border-2 border-transparent hover:border-[#37352f] rounded-[32px] flex flex-col items-center gap-4 transition-all shadow-sm group disabled:opacity-30">
                 <ClipboardList size={24} className="group-hover:text-[#2383e2]" />
                 <div className="text-center">
                   <div className="text-sm font-black uppercase tracking-widest">Construct Quiz</div>
                   <div className="text-[9px] font-bold text-[#d3d1cb] uppercase mt-1">5 Multiple Choice Items</div>
                 </div>
               </button>
               <button disabled={!activeNoteId || isGenerating} onClick={() => handleGenerateContent('map')} className="p-8 bg-white border-2 border-transparent hover:border-[#37352f] rounded-[32px] flex flex-col items-center gap-4 transition-all shadow-sm group disabled:opacity-30">
                 <Network size={24} className="group-hover:text-[#2383e2]" />
                 <div className="text-center">
                   <div className="text-sm font-black uppercase tracking-widest">Generate Mind Map</div>
                   <div className="text-[9px] font-bold text-[#d3d1cb] uppercase mt-1">Hierarchical visualization</div>
                 </div>
               </button>
            </div>
            {isGenerating && (
              <div className="flex flex-col items-center gap-4 pt-8 animate-pulse text-[10px] font-black text-[#37352f] uppercase tracking-[0.4em]">
                Synchronizing with Neural Core...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'QUIZ_PLAY' && activeQuiz) {
    const currentQ = activeQuiz.questions[qIndex];
    if (quizFinished) {
      return (
        <div className="min-h-full flex flex-col items-center justify-center p-12 bg-white animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-[#37352f] rounded-[32px] flex items-center justify-center text-white shadow-2xl mb-8">
             <Trophy size={48} />
           </div>
           <h2 className="text-5xl font-black tracking-tighter mb-4">Simulation Terminated</h2>
           <p className="text-2xl font-bold text-[#838170] mb-12 uppercase tracking-widest">Score: {quizScore} / {activeQuiz.questions.length}</p>
           <button onClick={() => setMode('VAULT')} className="px-10 py-4 bg-[#37352f] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">End Session</button>
        </div>
      );
    }
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-500">
         <header className="h-24 px-12 border-b border-[#f1f1f0] flex items-center justify-between">
            <button onClick={() => setMode('VAULT')} className="flex items-center gap-3 text-sm font-bold text-[#838170]">
              <ChevronLeft size={20} /> Terminate
            </button>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-[#838170] uppercase tracking-[0.4em]">Progression: {qIndex + 1} / {activeQuiz.questions.length}</span>
              <div className="w-48 h-1 bg-[#f7f7f5] rounded-full overflow-hidden">
                <div className="h-full bg-[#37352f] transition-all duration-500" style={{ width: `${((qIndex + 1) / activeQuiz.questions.length) * 100}%` }} />
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#2383e2]">Active Feed</div>
         </header>
         <main className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-3xl w-full space-y-12">
               <h3 className="text-4xl font-black text-[#37352f] leading-tight tracking-tight text-center">{currentQ.question}</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {currentQ.options.map((opt, i) => {
                   const isSelected = selectedOption === opt;
                   const isCorrect = opt === currentQ.correctAnswer;
                   const showResult = selectedOption !== null;
                   return (
                     <button key={i} onClick={() => handleOptionSelect(opt)} disabled={showResult} className={`p-6 rounded-[32px] border-2 text-left transition-all flex items-center gap-6 ${showResult ? (isCorrect ? 'bg-[#0f766e] border-[#0f766e] text-white' : isSelected ? 'bg-[#eb5757] border-[#eb5757] text-white' : 'bg-[#f7f7f5] border-transparent opacity-40') : 'bg-white border-[#e9e9e7] hover:border-[#37352f]'}`}>
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${showResult ? 'bg-white/10' : 'bg-[#f7f7f5]'}`}>{String.fromCharCode(65 + i)}</div>
                       <span className="text-lg font-bold">{opt}</span>
                     </button>
                   );
                 })}
               </div>
               {showExplanation && (
                 <div className="p-8 bg-[#fcfcfb] border-2 border-[#f1f1f0] rounded-[40px] animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 mb-4">
                       <HelpCircle size={20} className="text-[#2383e2]" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Neural Insight</span>
                    </div>
                    <p className="text-lg font-medium text-[#5f5e5b] italic">{currentQ.explanation}</p>
                    <div className="flex justify-end mt-8">
                      <button onClick={nextQuestion} className="flex items-center gap-3 bg-[#37352f] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">Proceed <ArrowRight size={16} /></button>
                    </div>
                 </div>
               )}
            </div>
         </main>
      </div>
    );
  }

  if (mode === 'MINDMAP' && activeMindMap) {
    return (
      <div className="fixed inset-0 z-50 bg-[#fcfcfb] flex flex-col animate-in fade-in duration-500">
        <header className="h-24 px-12 flex items-center justify-between border-b border-[#f1f1f0] bg-white">
           <button onClick={() => setMode('VAULT')} className="flex items-center gap-3 text-[#838170] font-bold text-sm hover:text-[#37352f]"><ChevronLeft size={20} /> Return</button>
           <h2 className="text-xl font-black tracking-tight">{activeMindMap.name}</h2>
           <div className="text-[10px] font-black text-[#838170] uppercase tracking-widest">Topology View</div>
        </header>
        <div className="flex-1 overflow-hidden"><MindMap data={activeMindMap} /></div>
      </div>
    );
  }

  return null;
};

export default StudyModule;
