'use client';

import useSWR from 'swr';
import type { Context } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useActiveContexts() {
  const { data, error, isLoading } = useSWR<Context[]>('/api/contexts', fetcher, {
    refreshInterval: 60000, // Refresh every minute to update active contexts
  });

  // Calculate active contexts on the client side
  const activeContexts = data ? calculateActiveContexts(data) : [];

  return {
    activeContexts,
    allContexts: data,
    isLoading,
    error,
  };
}

function calculateActiveContexts(contexts: Context[]): Context[] {
  const now = new Date();
  const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
  const currentTime = now.toTimeString().substring(0, 5); // HH:MM format

  return contexts.filter((context) => {
    // Check if current day matches
    if (context.days && !context.days.includes(currentDay)) {
      return false;
    }

    // Check if current time is within range
    if (context.time_start && context.time_end) {
      // Handle time ranges that cross midnight (e.g., 23:00 to 05:00)
      if (context.time_end < context.time_start) {
        // Range crosses midnight: active if after start OR before end
        return currentTime >= context.time_start || currentTime <= context.time_end;
      }
      // Normal range: active if between start and end
      return currentTime >= context.time_start && currentTime <= context.time_end;
    }

    return true;
  });
}
