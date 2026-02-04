
import React from 'react';
import { NexusNotification } from '../types';
import { Sparkles, Info, CheckCircle, X } from 'lucide-react';

interface NotificationSystemProps {
  notifications: NexusNotification[];
  removeNotification: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-[200] space-y-4 max-w-sm w-full pointer-events-none">
      {notifications.map(n => (
        <div 
          key={n.id} 
          className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-[#e9e9e7] p-5 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300 group"
        >
          <div className={`p-2.5 rounded-xl ${
            n.type === 'ai' ? 'bg-[#ebf5fe] text-[#2383e2]' :
            n.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
            'bg-[#f7f7f5] text-[#838170]'
          }`}>
            {n.type === 'ai' ? <Sparkles size={18} /> : n.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
          </div>
          <p className="text-sm font-bold text-[#37352f] flex-1 leading-tight">{n.message}</p>
          <button 
            onClick={() => removeNotification(n.id)}
            className="p-1 text-[#d3d1cb] hover:text-[#37352f] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
