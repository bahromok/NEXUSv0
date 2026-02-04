
export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  NOTES = 'NOTES',
  GRAPH = 'GRAPH',
  TASKS = 'TASKS',
  HABITS = 'HABITS',
  STUDY = 'STUDY',
  AI_HUB = 'AI_HUB',
  DECISIONS = 'DECISIONS',
  IDENTITY = 'IDENTITY',
  SETTINGS = 'SETTINGS'
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: number;
  createdAt: number;
  folder: string;
  pinned?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedAt?: number;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  logs: string[]; // dates in YYYY-MM-DD
  frequency: 'DAILY' | 'WEEKLY';
  impact: 'LOW' | 'HIGH';
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  lastReviewed: number;
  interval: number;
  ease: number;
  successCount: number;
}

// Added Decision interface to resolve type errors
export interface Decision {
  id: string;
  title: string;
  date: number;
  context: string;
  pros: string[];
  cons: string[];
  impact: 'low' | 'medium' | 'high';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  folder: string;
  questions: QuizQuestion[];
  bestScore?: number;
  lastAttempted?: number;
  createdAt: number;
}

export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
  value?: number;
}

export interface NexusNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'ai';
  timestamp: number;
}

export interface IdentityProfile {
  name: string;
  archetype: string;
  philosophy: string;
  values: string[];
  principles: string[];
  antiGoals: string[];
  longTermGoals: string[];
}