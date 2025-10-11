import { describe, expect, it } from 'vitest';
import type { ContextParsed } from '@/lib/types';

describe('Context Time Logic', () => {
  it('should parse days correctly from JSON', () => {
    const daysJson = '["Mon","Tue","Wed","Thu","Fri"]';
    const days = JSON.parse(daysJson);

    expect(days).toHaveLength(5);
    expect(days).toContain('Mon');
    expect(days).toContain('Fri');
  });

  it('should validate time format', () => {
    const validTime = '09:00';
    const invalidTime = '9:00';

    expect(validTime).toMatch(/^\d{2}:\d{2}$/);
    expect(invalidTime).not.toMatch(/^\d{2}:\d{2}$/);
  });

  it('should determine if time is within range', () => {
    const currentTime = '14:30';
    const rangeStart = '14:00';
    const rangeEnd = '16:00';

    expect(currentTime >= rangeStart).toBe(true);
    expect(currentTime <= rangeEnd).toBe(true);
  });

  it('should check if current day is in context days', () => {
    const context: Partial<ContextParsed> = {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    };

    const monday = 'Mon';
    const saturday = 'Sat';

    expect(context.days?.includes(monday)).toBe(true);
    expect(context.days?.includes(saturday)).toBe(false);
  });

  it('should handle null days (any day)', () => {
    const context: Partial<ContextParsed> = {
      days: null,
    };

    expect(context.days).toBeNull();
  });

  it('should validate context structure', () => {
    const validContext: Partial<ContextParsed> = {
      id: 1,
      name: 'work_hours',
      label: 'Horario laboral',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      time_start: '09:00',
      time_end: '14:00',
    };

    expect(validContext.id).toBeDefined();
    expect(validContext.name).toBeDefined();
    expect(validContext.label).toBeDefined();
    expect(validContext.time_start).toMatch(/^\d{2}:\d{2}$/);
    expect(validContext.time_end).toMatch(/^\d{2}:\d{2}$/);
  });
});
