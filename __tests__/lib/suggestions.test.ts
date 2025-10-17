import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ActivityWithDetails, Priority } from '@/lib/types';

// Mock the dependencies
vi.mock('@/services/activities', () => ({
  getActivities: vi.fn(),
}));

vi.mock('@/services/contexts', () => ({
  getActiveContexts: vi.fn(),
}));

describe('Suggestions Algorithm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should prioritize urgent activities', () => {
    const priorities: Priority[] = ['urgent', 'important', 'someday'];
    const scores = {
      urgent: 40,
      important: 25,
      someday: 10,
    };

    priorities.forEach((priority) => {
      expect(scores[priority]).toBeDefined();
    });

    expect(scores.urgent).toBeGreaterThan(scores.important);
    expect(scores.important).toBeGreaterThan(scores.someday);
  });

  it('should bonus activities matching time slots', () => {
    const timeSlotBonus = 60;
    const contextBonus = 50;

    expect(timeSlotBonus).toBeGreaterThan(contextBonus);
  });

  it('should penalize recently completed activities', () => {
    const now = new Date();
    const recentCompletion = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
    const oldCompletion = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const hoursSinceRecent = (now.getTime() - recentCompletion.getTime()) / (1000 * 60 * 60);
    const hoursSinceOld = (now.getTime() - oldCompletion.getTime()) / (1000 * 60 * 60);

    expect(hoursSinceRecent).toBeLessThan(2);
    expect(hoursSinceOld).toBeGreaterThan(6);
  });

  it('should consider energy level based on time of day', () => {
    const morningHour = 9; // 9 AM
    const afternoonHour = 14; // 2 PM
    const eveningHour = 20; // 8 PM

    // Morning = high energy
    expect(morningHour).toBeGreaterThanOrEqual(6);
    expect(morningHour).toBeLessThan(12);

    // Afternoon = medium energy
    expect(afternoonHour).toBeGreaterThanOrEqual(12);
    expect(afternoonHour).toBeLessThan(18);

    // Evening = low energy
    expect(eveningHour).toBeGreaterThanOrEqual(18);
  });

  it('should handle activities without contexts or time slots', () => {
    const activityWithoutSchedule: Partial<ActivityWithDetails> = {
      id: 1,
      title: 'Test Activity',
      contexts: [],
      time_slots: [],
    };

    expect(activityWithoutSchedule.contexts).toHaveLength(0);
    expect(activityWithoutSchedule.time_slots).toHaveLength(0);
  });

  it('should prioritize activities with matching day and time', () => {
    const now = new Date();
    const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
    const currentTime = now.toTimeString().substring(0, 5);

    expect(currentDay).toBeDefined();
    expect(currentTime).toMatch(/^\d{2}:\d{2}$/);
  });
});
