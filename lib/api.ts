import type {
  ActivitySuggestion,
  ActivityWithDetails,
  Category,
  ContextParsed,
  CreateActivityRequest,
  GetActivitiesFilters,
  UpdateActivityRequest,
} from '@/lib/types';

// ==================================================
// BASE API CONFIGURATION
// ==================================================
const API_BASE_URL = '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.error || 'Request failed', response.status, error);
  }

  return response.json();
}

// ==================================================
// ACTIVITIES API
// ==================================================
export const activitiesApi = {
  /**
   * Get all activities with optional filters
   */
  getAll: async (filters?: GetActivitiesFilters): Promise<ActivityWithDetails[]> => {
    const params = new URLSearchParams();

    if (filters?.category_id) params.set('category_id', filters.category_id.toString());
    if (filters?.priority) params.set('priority', filters.priority);
    if (filters?.energy_level) params.set('energy_level', filters.energy_level);
    if (filters?.is_completed !== undefined)
      params.set('is_completed', filters.is_completed.toString());
    if (filters?.is_recurring !== undefined)
      params.set('is_recurring', filters.is_recurring.toString());
    if (filters?.location) params.set('location', filters.location);

    const query = params.toString();
    return fetchApi<ActivityWithDetails[]>(`/activities${query ? `?${query}` : ''}`);
  },

  /**
   * Create a new activity
   */
  create: async (data: CreateActivityRequest): Promise<{ success: boolean; id: number }> => {
    return fetchApi<{ success: boolean; id: number }>('/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing activity
   */
  update: async (id: number, data: UpdateActivityRequest): Promise<{ success: boolean }> => {
    return fetchApi<{ success: boolean }>(`/activities?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an activity
   */
  delete: async (id: number): Promise<{ success: boolean }> => {
    return fetchApi<{ success: boolean }>(`/activities?id=${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Toggle activity completion status
   */
  toggle: async (id: number): Promise<{ success: boolean }> => {
    return fetchApi<{ success: boolean }>(`/activities/${id}/toggle`, {
      method: 'POST',
    });
  },

  /**
   * Mark recurring activity as completed (adds to completions history)
   */
  complete: async (id: number, notes?: string): Promise<{ success: boolean }> => {
    return fetchApi<{ success: boolean }>(`/activities/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },
};

// ==================================================
// CATEGORIES API
// ==================================================
export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    return fetchApi<Category[]>('/categories');
  },

  /**
   * Create a new category
   */
  create: async (
    name: string,
    color: string,
    icon?: string
  ): Promise<{ success: boolean; id: number }> => {
    return fetchApi<{ success: boolean; id: number }>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name, color, icon }),
    });
  },

  /**
   * Update a category
   */
  update: async (
    id: number,
    data: { name?: string; color?: string; icon?: string }
  ): Promise<{ success: boolean }> => {
    return fetchApi<{ success: boolean }>(`/categories?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a category
   */
  delete: async (id: number): Promise<{ success: boolean }> => {
    return fetchApi<{ success: boolean }>(`/categories?id=${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================================================
// CONTEXTS API
// ==================================================
export const contextsApi = {
  /**
   * Get all contexts
   */
  getAll: async (): Promise<ContextParsed[]> => {
    return fetchApi<ContextParsed[]>('/contexts');
  },

  /**
   * Get currently active contexts (based on current time)
   */
  getActive: async (): Promise<ContextParsed[]> => {
    return fetchApi<ContextParsed[]>('/contexts?active=true');
  },

  /**
   * Create a new context
   */
  create: async (
    name: string,
    label: string,
    days?: string[],
    time_start?: string,
    time_end?: string
  ): Promise<{ success: boolean; id: number }> => {
    return fetchApi<{ success: boolean; id: number }>('/contexts', {
      method: 'POST',
      body: JSON.stringify({ name, label, days, time_start, time_end }),
    });
  },

  /**
   * Update a context
   */
  update: async (
    id: number,
    data: {
      name?: string;
      label?: string;
      days?: string[];
      time_start?: string;
      time_end?: string;
    }
  ): Promise<{ success: boolean }> => {
    return fetchApi<{ success: boolean }>(`/contexts?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a context
   */
  delete: async (id: number): Promise<{ success: boolean }> => {
    return fetchApi<{ success: boolean }>(`/contexts?id=${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================================================
// SUGGESTIONS API
// ==================================================
export const suggestionsApi = {
  /**
   * Get activity suggestions for current time
   */
  get: async (limit = 10, category?: number): Promise<ActivitySuggestion[]> => {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    if (category) params.set('category', category.toString());

    return fetchApi<ActivitySuggestion[]>(`/suggestions?${params.toString()}`);
  },
};

// Export ApiError for error handling
export { ApiError };
