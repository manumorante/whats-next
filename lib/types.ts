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
export type EnergyLevel = 'low' | 'medium' | 'high';
export type Priority = 'urgent' | 'important' | 'someday';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | null;
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Activity {
  id: number;
  title: string;
  description: string | null;
  category_id: number | null;
  duration_minutes: number | null;
  energy_level: EnergyLevel | null;
  location: string | null;
  priority: Priority;
  is_recurring: number; // 0 or 1
  recurrence_type: RecurrenceType;
  is_completed: number; // 0 or 1
  created_at: string;
}

// ==================================================
// ACTIVITY TIME SLOTS
// ==================================================
export interface ActivityTimeSlot {
  id: number;
  activity_id: number;
  day_of_week: DayOfWeek | null;
  time_start: string;
  time_end: string;
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
  time_slots?: ActivityTimeSlot[];
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
  duration_minutes?: number;
  energy_level?: EnergyLevel;
  location?: string;
  priority?: Priority;
  is_recurring?: boolean;
  recurrence_type?: RecurrenceType;
  contexts?: number[]; // Array of context IDs
  time_slots?: Omit<ActivityTimeSlot, 'id' | 'activity_id'>[];
}

export interface UpdateActivityRequest extends Partial<CreateActivityRequest> {
  is_completed?: boolean;
}

export interface ActivitySuggestion {
  activity: ActivityWithDetails;
  score: number;
  reason: string;
}

export interface GetActivitiesFilters {
  category_id?: number;
  priority?: Priority;
  energy_level?: EnergyLevel;
  is_completed?: boolean;
  is_recurring?: boolean;
  location?: string;
}
