'use client';

import { useActivities } from '@/hooks/useActivities';
import { calculateActivityScore } from '@/lib/scoring';
import type { Activity, ScoredActivity } from '@/types';
import { useActiveContexts } from './useActiveContexts';

export function useScoredActivities() {
  const {
    activeContexts: contexts,
    isLoading: contextsLoading,
    error: contextsError,
  } = useActiveContexts();
  const { activities, isLoading: activitiesLoading, error: activitiesError } = useActivities();

  const isLoading = contextsLoading || activitiesLoading;
  const error = contextsError || activitiesError;

  // Calculate scored activities when both data are available
  const scoredActivities =
    activities.length > 0 && contexts.length >= 0
      ? activities
          .map((activity: Activity) => calculateActivityScore(activity, contexts))
          .sort((a: ScoredActivity, b: ScoredActivity) => (b.score || 0) - (a.score || 0))
      : [];

  return {
    scoredActivities,
    contexts,
    activities,
    isLoading,
    error,
  };
}
