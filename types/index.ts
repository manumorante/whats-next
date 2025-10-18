// Base types
export type Energy = 1 | 2 | 3;
export type Priority = 1 | 2 | 3;
export type Category = 1 | 2 | 3 | 4 | 5;
export type Theme = 'light' | 'dark';

// Database entities
export interface Context {
  id: number;
  name: string;
  label: string;
  days: string[] | null;
  time_start: string | null;
  time_end: string | null;
}

export interface Activity {
  id: number;
  title: string;
  category: Category;
  energy: Energy;
  priority: Priority;
  contexts?: Context[];
  completions_count?: number;
  last_completed?: string | null;
}

// UI types
export interface ScoredActivity {
  activity: Activity;
  score?: number;
  reasons?: string[];
}
