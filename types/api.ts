// API Request/Response types
import type { Activity, Category, Energy, Priority } from './index';

export interface CreateActivityRequest {
  title: string;
  category?: Category;
  energy?: Energy;
  priority?: Priority;
  contexts?: number[]; // Array of context IDs
}

export interface UpdateActivityRequest {
  title?: string | null;
  category?: Category;
  energy?: Energy;
  priority?: Priority;
  contexts?: number[]; // Array of context IDs
}

export interface UpdateContextRequest {
  name?: string;
  label?: string;
  days?: string[];
  time_start?: string;
  time_end?: string;
}

// Response types
export interface GetActivitiesResponse {
  success: true;
  data: Activity[];
}

export interface CreateActivityResponse {
  success: true;
  id: number;
}

export interface UpdateActivityResponse {
  success: true;
}

export interface DeleteActivityResponse {
  success: true;
}

export interface ErrorResponse {
  error: string;
}
