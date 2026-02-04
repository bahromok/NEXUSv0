
import { Note, Task, Habit, Flashcard, Decision, IdentityProfile } from './types';

export const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Project NEXUS Vision',
    content: '# The Vision for NEXUS\n\nNexus is a local-first **Second Brain**. It aims to solve the fragmentation of information across tools like Obsidian, Todoist, and Trello by unifying them into a single, elegant workspace.\n\n## Core Principles\n- Local Only\n- Calm UI\n- High Performance\n- AI Augmented\n\n[[Development Roadmap]]',
    tags: ['vision', 'roadmap'],
    folder: 'Product',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: '2',
    title: 'Development Roadmap',
    content: '# Phase 1: Core Architecture\n- [x] Basic Note Editor\n- [x] Task Management\n- [ ] Graph Visualization\n- [ ] AI Integration\n\nSee [[Project NEXUS Vision]] for context.',
    tags: ['dev', 'nexus'],
    folder: 'Engineering',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 1
  }
];

export const initialTasks: Task[] = [
  { id: 't1', title: 'Implement Graphite Engine', status: 'in-progress', priority: 'high' },
  { id: 't2', title: 'Design System Polish', status: 'todo', priority: 'medium' },
  { id: 't3', title: 'Local SQLite Indexer', status: 'done', priority: 'high' }
];

export const initialHabits: Habit[] = [
  { id: 'h1', name: 'Deep Work (4h)', streak: 12, logs: ['2023-10-24', '2023-10-25'], frequency: 'DAILY', impact: 'HIGH' },
  { id: 'h2', name: 'Knowledge Review', streak: 5, logs: ['2023-10-25'], frequency: 'DAILY', impact: 'HIGH' }
];

export const initialFlashcards: Flashcard[] = [
  { 
    id: 'f1', 
    question: 'What is a LAVA flow in coding?', 
    answer: 'Large And Vulnerable Architecture. Code that has grown so complex it is hard to move.', 
    category: 'Engineering',
    lastReviewed: Date.now(), 
    interval: 1, 
    ease: 2.5,
    successCount: 0
  },
  { 
    id: 'f2', 
    question: 'Difference between Zettelkasten and traditional notes?', 
    answer: 'Zettelkasten focuses on atomic links between ideas, not just linear storage.', 
    category: 'Systems',
    lastReviewed: Date.now(), 
    interval: 4, 
    ease: 2.5,
    successCount: 1
  },
  { 
    id: 'f3', 
    question: 'What is the Lindy Effect?', 
    answer: 'The idea that the future life expectancy of non-perishable things like ideas is proportional to their current age.', 
    category: 'Philosophy',
    lastReviewed: Date.now(), 
    interval: 1, 
    ease: 2.5,
    successCount: 0
  },
  { 
    id: 'f4', 
    question: 'What defines a "High Agency" individual?', 
    answer: 'A person who acts to achieve their goals despite obstacles and finds ways to succeed when others see only barriers.', 
    category: 'Philosophy',
    lastReviewed: Date.now(), 
    interval: 2, 
    ease: 2.5,
    successCount: 1
  }
];

export const initialDecisions: Decision[] = [
  { id: 'd1', title: 'Switch to SQLite for Local Storage', date: Date.now(), context: 'Browser storage limits are becoming an issue for high-volume notes.', pros: ['Native speed', 'Complex queries'], cons: ['Setup complexity'], impact: 'high' }
];

export const initialIdentity: IdentityProfile = {
  name: 'Nexus Pilot',
  archetype: 'The Strategic Architect',
  philosophy: 'Aggressive intellectual compounding through structural consistency.',
  values: ['Clarity', 'Privacy', 'Elegance', 'Compounding'],
  principles: [
    'Systems over goals.',
    'Privacy is a prerequisite for honest thought.',
    'Compounding is the 8th wonder of the world.'
  ],
  antiGoals: [
    'Do not sacrifice local privacy for cloud convenience.',
    'Avoid shallow work during peak cognitive hours.',
    'Reject cluttered information environments.'
  ],
  longTermGoals: ['Neural mesh v1.0', 'Mastery of specialized AI systems']
};
