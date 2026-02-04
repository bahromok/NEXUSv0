
import React, { useState, useEffect } from 'react';
import { ViewType, Note, Task, Habit, IdentityProfile, Quiz, NexusNotification } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import NoteEditor from './components/NoteEditor';
import NotesVault from './components/NotesVault';
import KnowledgeGraph from './components/KnowledgeGraph';
import TaskManager from './components/TaskManager';
import HabitTracker from './components/HabitTracker';
import CommandPalette from './components/CommandPalette';
import StudyModule from './components/StudyModule';
import IdentityModule from './components/IdentityModule';
import SettingsView from './components/SettingsView';
import NotificationSystem from './components/NotificationSystem';
import HelpModal from './components/HelpModal';
import { initialNotes, initialTasks, initialHabits, initialIdentity } from './constants';

const App: React.FC = () => {
  const loadState = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(`nexus_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [notes, setNotes] = useState<Note[]>(() => loadState('notes', initialNotes));
  const [tasks, setTasks] = useState<Task[]>(() => loadState('tasks', initialTasks));
  const [habits, setHabits] = useState<Habit[]>(() => loadState('habits', initialHabits));
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => loadState('quizzes', []));
  const [identity, setIdentity] = useState<IdentityProfile>(() => loadState('identity', initialIdentity));
  const [notifications, setNotifications] = useState<NexusNotification[]>([]);
  
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexus_notes', JSON.stringify(notes));
    localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
    localStorage.setItem('nexus_habits', JSON.stringify(habits));
    localStorage.setItem('nexus_quizzes', JSON.stringify(quizzes));
    localStorage.setItem('nexus_identity', JSON.stringify(identity));
  }, [notes, tasks, habits, quizzes, identity]);

  const addNotification = (message: string, type: 'info' | 'success' | 'ai') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type, timestamp: Date.now() }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleImport = (jsonData: any) => {
    try {
      if (jsonData.notes) setNotes(jsonData.notes);
      if (jsonData.tasks) setTasks(jsonData.tasks);
      if (jsonData.habits) setHabits(jsonData.habits);
      if (jsonData.quizzes) setQuizzes(jsonData.quizzes);
      if (jsonData.identity) setIdentity(jsonData.identity);
      addNotification("Neural Data Imported Successfully.", "success");
    } catch (e) {
      addNotification("Data Corruption in Import File.", "info");
    }
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
    addNotification("Note Purged.", "info");
  };

  const handleCreateNote = (title?: any, content?: string, folder?: string) => {
    const finalTitle = (typeof title === 'string' ? title : '') || 'Untitled Insight';
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: finalTitle,
      content: content || '',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      folder: folder || 'General',
      pinned: false
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setCurrentView(ViewType.NOTES);
    addNotification("New Thought Anchored.", "success");
  };

  const renderView = () => {
    const containerClass = "h-full w-full custom-scroll pb-24 md:pb-0";
    switch (currentView) {
      case ViewType.DASHBOARD:
        return <div className={containerClass}><Dashboard notes={notes} tasks={tasks} habits={habits} onSelectNote={(id) => { setSelectedNoteId(id); setCurrentView(ViewType.NOTES); }} /></div>;
      case ViewType.NOTES:
        if (selectedNoteId && notes.find(n => n.id === selectedNoteId)) {
          return <div className="h-full w-full"><NoteEditor 
            note={notes.find(n => n.id === selectedNoteId)!} 
            allNotes={notes} 
            onUpdate={handleUpdateNote} 
            onDelete={handleDeleteNote} 
            onSelectNote={setSelectedNoteId} 
            onClose={() => setSelectedNoteId(null)}
            notesList={notes} 
          /></div>;
        }
        return <div className={containerClass}><NotesVault 
          notes={notes} 
          onSelectNote={(id) => setSelectedNoteId(id)} 
          onCreateNote={handleCreateNote} 
          onDeleteNote={handleDeleteNote}
          onUpdateNote={handleUpdateNote}
        /></div>;
      case ViewType.GRAPH:
        return <KnowledgeGraph notes={notes} onSelectNote={(id) => { setSelectedNoteId(id); setCurrentView(ViewType.NOTES); }} />;
      case ViewType.TASKS:
        return <div className={containerClass}><TaskManager tasks={tasks} setTasks={setTasks} /></div>;
      case ViewType.HABITS:
        return <div className={containerClass}><HabitTracker habits={habits} setHabits={setHabits} /></div>;
      case ViewType.STUDY:
        return <div className={containerClass}><StudyModule quizzes={quizzes} setQuizzes={setQuizzes} notes={notes} onNotify={addNotification} /></div>;
      case ViewType.IDENTITY:
        return <div className={containerClass}><IdentityModule profile={identity} setProfile={setIdentity} /></div>;
      case ViewType.SETTINGS:
        return <div className={containerClass}><SettingsView allData={{ notes, tasks, habits, quizzes, identity }} onImport={handleImport} /></div>;
      default:
        return <Dashboard notes={notes} tasks={tasks} habits={habits} onSelectNote={(id) => { setSelectedNoteId(id); setCurrentView(ViewType.NOTES); }} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full text-[#37352f] bg-white overflow-hidden">
      <Sidebar currentView={currentView} setView={setCurrentView} onCreateNote={() => handleCreateNote()} />
      <main className="flex-1 flex flex-col min-w-0 bg-white relative overflow-hidden">
        <Header 
          currentView={currentView} 
          onOpenPalette={() => setIsCommandPaletteOpen(true)} 
          onOpenHelp={() => setIsHelpOpen(true)}
        />
        <div className="flex-1 relative overflow-hidden">{renderView()}</div>
      </main>

      <NotificationSystem notifications={notifications} removeNotification={removeNotification} />
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      {isCommandPaletteOpen && (
        <CommandPalette 
          onClose={() => setIsCommandPaletteOpen(false)} 
          notes={notes} 
          onSelectView={setCurrentView} 
          onSelectNote={(id) => { setSelectedNoteId(id); setCurrentView(ViewType.NOTES); setIsCommandPaletteOpen(false); }} 
        />
      )}
    </div>
  );
};

export default App;
