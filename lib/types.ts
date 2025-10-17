// ==================================================
// CATEGORIES
// ==================================================
export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string | null;
  created_at: string;
}

// ==================================================
// CONTEXTS
// ==================================================
export interface Context {
  id: number;
  name: string;
  label: string;
  days: string | null; // JSON string: ["Mon","Tue","Wed","Thu","Fri"]
  time_start: string | null;
  time_end: string | null;
  created_at: string;
}

export interface ContextParsed extends Omit<Context, 'days'> {
  days: string[] | null; // Parsed array
}

// ==================================================
// ACTIVITIES
// ==================================================
export type Energy = 1 | 2 | 3;
export type Priority = 1 | 2 | 3;
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

// ==================================================
// CONSTANTS FOR UI DISPLAY
// ==================================================
export const ENERGY_OPTIONS = [
  { value: 1 as const, label: 'Baja energía' },
  { value: 2 as const, label: 'Media energía' },
  { value: 3 as const, label: 'Alta energía' },
] as const;

export const PRIORITY_OPTIONS = [
  { value: 1 as const, label: 'Alta prioridad' },
  { value: 2 as const, label: 'Media prioridad' },
  { value: 3 as const, label: 'Baja prioridad' },
] as const;

export interface Activity {
  id: number;
  title: string;
  description: string | null;
  category_id: number | null;
  energy: Energy | null;
  priority: Priority;
  created_at: string;
}

// ==================================================
// ACTIVITY CONTEXTS (Many-to-Many)
// ==================================================
export interface ActivityContext {
  id: number;
  activity_id: number;
  context_id: number;
}

// ==================================================
// ACTIVITY COMPLETIONS
// ==================================================
export interface ActivityCompletion {
  id: number;
  activity_id: number;
  completed_at: string;
  notes: string | null;
}

// ==================================================
// EXTENDED TYPES (WITH RELATIONS)
// ==================================================
export interface ActivityWithDetails extends Activity {
  category?: Category;
  contexts?: ContextParsed[];
  completions_count?: number;
  last_completed?: string | null;
  next_completion?: string | null; // For recurring activities
}

// ==================================================
// API REQUEST/RESPONSE TYPES
// ==================================================
export interface CreateActivityRequest {
  title: string;
  description?: string;
  category_id?: number;
  energy?: Energy;
  priority?: Priority;
  contexts?: number[]; // Array of context IDs
}

export interface UpdateActivityRequest {
  title?: string | null;
  description?: string | null;
  category_id?: number | null;
  energy?: Energy | null;
  priority?: Priority;
  contexts?: number[]; // Array of context IDs
}

export interface ActivitySuggestion {
  activity: ActivityWithDetails;
  score: number;
  reason: string;
}

export interface GetActivitiesFilters {
  category_id?: number;
  priority?: Priority;
  energy?: Energy;
}
