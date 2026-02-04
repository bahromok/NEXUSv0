
import React, { useState } from 'react';
import { Task } from '../types';
import { 
  Plus, 
  Trash2, 
  Archive,
  Calendar,
  MoreVertical,
  CheckCircle,
  LayoutList,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const moveTask = (id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { 
      ...t, 
      status: newStatus,
      completedAt: newStatus === 'done' ? Date.now() : undefined
    } : t));
  };

  const handlePurge = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (!newTask.title?.trim()) return;
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title.trim(),
      description: newTask.description,
      status: newTask.status as Task['status'],
      priority: newTask.priority as Task['priority'],
      dueDate: newTask.dueDate
    };
    setTasks(prev => [task, ...prev]);
    setShowAddModal(false);
    setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: new Date().toISOString().split('T')[0] });
  };

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col p-4 md:p-12 lg:p-20 space-y-6 md:space-y-12 animate-in fade-in duration-500 pb-32 text-[#37352f]">
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Focus</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="md:hidden p-3 bg-[#37352f] text-white rounded-2xl shadow-lg"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Quick Filter Bar - Swipeable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          {(['all', 'todo', 'in-progress', 'done'] as const).map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)} 
              className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                filter === f ? 'bg-[#37352f] text-white border-[#37352f] shadow-md' : 'bg-[#f7f7f5] text-[#838170] border-[#e9e9e7]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'todo' ? 'Backlog' : f === 'in-progress' ? 'Active' : 'Closed'}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
        {filteredTasks.map(task => (
          <div 
            key={task.id} 
            className={`flex items-center gap-4 p-4 md:p-6 rounded-3xl border transition-all ${
              task.status === 'done' ? 'bg-[#fcfcfb] border-[#f1f1f0] opacity-60' : 'bg-white border-[#e9e9e7] shadow-sm'
            }`}
          >
            <button 
              onClick={() => moveTask(task.id, task.status === 'done' ? 'todo' : 'done')}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                task.status === 'done' ? 'bg-[#2383e2] border-[#2383e2] text-white' : 'border-[#d3d1cb] hover:border-[#37352f]'
              }`}
            >
              {task.status === 'done' && <CheckCircle2 size={20} />}
            </button>

            <div className="flex-1 min-w-0" onClick={() => moveTask(task.id, task.status === 'in-progress' ? 'todo' : 'in-progress')}>
              <h2 className={`text-base md:text-xl font-bold tracking-tight truncate ${task.status === 'done' ? 'line-through text-[#d3d1cb]' : 'text-[#37352f]'}`}>
                {task.title}
              </h2>
              <div className="flex items-center gap-3 mt-1 overflow-hidden">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${
                  task.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {task.priority}
                </span>
                <span className="text-[10px] font-bold text-[#d3d1cb] truncate">{task.dueDate || 'No Target'}</span>
              </div>
            </div>

            <button 
              onClick={() => handlePurge(task.id)}
              className="p-2 text-[#d3d1cb] hover:text-[#eb5757] transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-[#d3d1cb]">
            <LayoutList size={64} strokeWidth={1} className="opacity-30" />
            <p className="text-[10px] font-black mt-6 uppercase tracking-[0.4em]">All Objectives Clear</p>
          </div>
        )}
      </div>

      {/* Persistent Desktop Add Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="hidden md:flex items-center justify-center gap-3 w-full py-4 bg-[#37352f] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
      >
        <Plus size={20} /> Create Objective
      </button>

      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95">
            <h2 className="text-2xl font-black mb-8 tracking-tighter">New Focus</h2>
            <div className="space-y-6">
              <input
                autoFocus
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="What needs attention?"
                className="w-full text-xl md:text-2xl font-bold border-b-2 border-[#f1f1f0] focus:border-[#37352f] outline-none pb-3 transition-all placeholder-[#d3d1cb]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-black text-[#838170] uppercase tracking-widest ml-1">Priority</label>
                   <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="bg-[#f7f7f5] text-sm font-bold px-4 py-3 rounded-xl border border-[#e9e9e7] outline-none"
                  >
                    <option value="low">Standard</option>
                    <option value="medium">Important</option>
                    <option value="high">Urgent</option>
                  </select>
                 </div>
                 <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-black text-[#838170] uppercase tracking-widest ml-1">Target Date</label>
                   <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="bg-[#f7f7f5] text-sm font-bold px-4 py-3 rounded-xl border border-[#e9e9e7] outline-none"
                  />
                 </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-sm font-bold text-[#838170] bg-[#f7f7f5] rounded-2xl">Cancel</button>
                <button onClick={addTask} className="flex-[2] bg-[#37352f] text-white py-3 rounded-2xl text-sm font-bold shadow-lg">Commit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
