import { describe, expect, it } from 'vitest';
import type {
  ActivityWithDetails,
  DayOfWeek,
  EnergyLevel,
  Priority,
  RecurrenceType,
} from '@/lib/types';

describe('Type Definitions', () => {
  it('should validate EnergyLevel values', () => {
    const validLevels: EnergyLevel[] = ['low', 'medium', 'high'];

    validLevels.forEach((level) => {
      expect(['low', 'medium', 'high']).toContain(level);
    });
  });

  it('should validate Priority values', () => {
    const validPriorities: Priority[] = ['urgent', 'important', 'someday'];

    validPriorities.forEach((priority) => {
      expect(['urgent', 'important', 'someday']).toContain(priority);
    });
  });

  it('should validate RecurrenceType values', () => {
    const validRecurrences: (RecurrenceType | null)[] = ['daily', 'weekly', 'monthly', null];

    validRecurrences.forEach((recurrence) => {
      expect(['daily', 'weekly', 'monthly', null]).toContain(recurrence);
    });
  });

  it('should validate DayOfWeek values', () => {
    const validDays: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    expect(validDays).toHaveLength(7);
    validDays.forEach((day) => {
      expect(day.length).toBe(3);
    });
  });

  it('should validate Activity structure', () => {
    const activity: Partial<ActivityWithDetails> = {
      id: 1,
      title: 'Test Activity',
      priority: 'important',
      energy_level: 'medium',
      is_recurring: 0,
      is_completed: 0,
    };

    expect(activity.id).toBeDefined();
    expect(activity.title).toBeDefined();
    expect(activity.priority).toBeDefined();
    expect(activity.is_recurring).toBeTypeOf('number');
    expect(activity.is_completed).toBeTypeOf('number');
  });

  it('should handle optional fields', () => {
    const minimalActivity: Partial<ActivityWithDetails> = {
      id: 1,
      title: 'Minimal',
      priority: 'someday',
      is_recurring: 0,
      is_completed: 0,
      created_at: new Date().toISOString(),
    };

    expect(minimalActivity.description).toBeUndefined();
    expect(minimalActivity.category_id).toBeUndefined();
    expect(minimalActivity.duration_minutes).toBeUndefined();
  });
});
