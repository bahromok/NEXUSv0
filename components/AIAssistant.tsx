
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Brain, Bot, User } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';

interface AIAssistantProps {
  onClose: () => void;
  context: {
    notes: any[];
    tasks: any[];
    habits: any[];
  };
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose, context }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hello! I am your NEXUS Neural Assistant. I have indexed your second brain. How can I assist your thinking today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateChatResponse(userMsg, context);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Forgive me, my neural link is temporarily unstable. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 bg-white">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Nexus Core</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Synchronized</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-black transition-colors">
          <X size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center border ${msg.role === 'user' ? 'bg-black border-black' : 'bg-slate-50 border-slate-100'}`}>
                {msg.role === 'user' ? <User size={12} className="text-white" /> : <Bot size={12} className="text-black" />}
              </div>
              <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-black text-white rounded-tr-none' 
                  : 'bg-slate-50 text-black border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="flex gap-3 items-center bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100">
               <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.2s]" />
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
               <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black ml-1">Reasoning</span>
             </div>
           </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type your command..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-black transition-all resize-none max-h-32"
            rows={1}
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 bottom-2 p-2 bg-black text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[8px] text-slate-300 mt-3 text-center uppercase tracking-[0.2em] font-bold">
          Nexus Neural Interface • Local Only
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
