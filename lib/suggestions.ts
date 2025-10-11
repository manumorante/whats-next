import { getActivities } from '@/lib/activities';
import { getActiveContexts } from '@/lib/contexts';
import type { ActivitySuggestion, ActivityWithDetails, Priority } from '@/lib/types';

// ==================================================
// GET SUGGESTED ACTIVITIES
// ==================================================
export async function getSuggestedActivities(
  limit = 10,
  filterCategory?: number
): Promise<ActivitySuggestion[]> {
  const now = new Date();
  const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
  const currentDayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

  // Get all activities (excluding completed non-recurring ones)
  const allActivities = await getActivities({
    is_completed: false,
    ...(filterCategory ? { category_id: filterCategory } : {}),
  });

  // Get active contexts for current time
  const activeContexts = await getActiveContexts();
  const activeContextIds = activeContexts.map((c) => c.id);

  const suggestions: ActivitySuggestion[] = [];

  for (const activity of allActivities) {
    let score = 0;
    const reasons: string[] = [];

    // Skip if no contexts or time slots defined (can't determine when to do it)
    if (
      (!activity.contexts || activity.contexts.length === 0) &&
      (!activity.time_slots || activity.time_slots.length === 0)
    ) {
      continue;
    }

    // Check if activity matches current time via contexts
    let matchesContext = false;
    if (activity.contexts && activity.contexts.length > 0) {
      const activityContextIds = activity.contexts.map((c) => c.id);
      matchesContext = activityContextIds.some((id) => activeContextIds.includes(id));

      if (matchesContext) {
        score += 50;
        const matchedContext = activity.contexts.find((c) => activeContextIds.includes(c.id));
        if (matchedContext) {
          reasons.push(`Contexto: ${matchedContext.label}`);
        }
      }
    }

    // Check if activity matches current time via time slots
    let matchesTimeSlot = false;
    if (activity.time_slots && activity.time_slots.length > 0) {
      for (const slot of activity.time_slots) {
        // Check day
        const dayMatches = !slot.day_of_week || slot.day_of_week === currentDayName;

        // Check time
        const timeMatches = currentTime >= slot.time_start && currentTime <= slot.time_end;

        if (dayMatches && timeMatches) {
          matchesTimeSlot = true;
          score += 60;
          reasons.push(`Horario: ${slot.time_start}-${slot.time_end}`);
          break;
        }
      }
    }

    // Skip if doesn't match current time at all
    if (!matchesContext && !matchesTimeSlot) {
      continue;
    }

    // Priority bonus
    const priorityScores: Record<Priority, number> = {
      urgent: 40,
      important: 25,
      someday: 10,
    };
    score += priorityScores[activity.priority];
    if (activity.priority === 'urgent') {
      reasons.push('Must Do');
    } else if (activity.priority === 'important') {
      reasons.push('Should Do');
    }

    // Recurring activities that haven't been done today get bonus
    if (activity.is_recurring && activity.recurrence_type === 'daily') {
      const lastCompleted = activity.last_completed ? new Date(activity.last_completed) : null;
      const today = new Date().toDateString();

      if (!lastCompleted || lastCompleted.toDateString() !== today) {
        score += 20;
        reasons.push('Pendiente hoy');
      }
    }

    // Energy level consideration (based on time of day)
    if (activity.energy_level) {
      const hour = now.getHours();

      // Morning (6-12): prefer high energy
      if (hour >= 6 && hour < 12 && activity.energy_level === 'high') {
        score += 15;
        reasons.push('Energía alta - ideal ahora');
      }
      // Afternoon (12-18): prefer medium energy
      else if (hour >= 12 && hour < 18 && activity.energy_level === 'medium') {
        score += 15;
        reasons.push('Energía media - ideal ahora');
      }
      // Evening/Night (18-24): prefer low energy
      else if (hour >= 18 && activity.energy_level === 'low') {
        score += 15;
        reasons.push('Energía baja - ideal ahora');
      }
    }

    // Penalty for recently completed
    if (activity.last_completed) {
      const hoursSinceCompleted =
        (now.getTime() - new Date(activity.last_completed).getTime()) / (1000 * 60 * 60);

      if (hoursSinceCompleted < 2) {
        score -= 30;
        reasons.push('Completada recientemente');
      } else if (hoursSinceCompleted < 6) {
        score -= 15;
      }
    }

    suggestions.push({
      activity,
      score,
      reason: reasons.join(' • '),
    });
  }

  // Sort by score (highest first) and return top N
  return suggestions.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ==================================================
// GET ACTIVITIES BY TIME OF DAY
// ==================================================
export async function getActivitiesByTimeOfDay(
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
): Promise<ActivityWithDetails[]> {
  const timeRanges = {
    morning: { start: '06:00', end: '12:00' },
    afternoon: { start: '12:00', end: '18:00' },
    evening: { start: '18:00', end: '23:00' },
    night: { start: '23:00', end: '06:00' },
  };

  const range = timeRanges[timeOfDay];
  const allActivities = await getActivities({ is_completed: false });

  return allActivities.filter((activity) => {
    // Check time slots
    if (activity.time_slots && activity.time_slots.length > 0) {
      return activity.time_slots.some((slot) => {
        return slot.time_start >= range.start && slot.time_end <= range.end;
      });
    }

    // Check contexts
    if (activity.contexts && activity.contexts.length > 0) {
      return activity.contexts.some((context) => {
        if (!context.time_start || !context.time_end) return false;
        return context.time_start >= range.start && context.time_end <= range.end;
      });
    }

    return false;
  });
}

// ==================================================
// GET ACTIVITIES BY CATEGORY
// ==================================================
export async function getActivitiesByCategory(categoryId: number): Promise<ActivitySuggestion[]> {
  return getSuggestedActivities(20, categoryId);
}
