import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ActivityWithDetails, ContextParsed } from '@/lib/types';
import {
  getActivitiesByCategory,
  getActivitiesByTimeOfDay,
  getSuggestedActivities,
} from '@/services/suggestions';

// Mock the dependencies
vi.mock('@/services/activities', () => ({
  getActivities: vi.fn(),
}));

vi.mock('@/services/contexts', () => ({
  getActiveContexts: vi.fn(),
}));

describe('Suggestions Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSuggestedActivities', () => {
    it('should return activities sorted by score', async () => {
      const mockActivities: ActivityWithDetails[] = [
        {
          id: 1,
          title: 'Test Activity 1',
          description: 'Test description',
          priority: 'urgent',
          energy_level: 'high',
          is_completed: 0,
          category_id: 1,
          category: {
            id: 1,
            name: 'Test Category',
            color: '#ff0000',
            icon: 'test-icon',
            created_at: '2023-01-01',
          },
          created_at: '2023-01-01',
          contexts: [
            {
              id: 1,
              name: 'test',
              label: 'Test Context',
              days: ['Mon'],
              time_start: '09:00',
              time_end: '17:00',
              created_at: '2023-01-01',
            },
          ],
          time_slots: [],
          completions_count: 0,
          last_completed: null,
        },
        {
          id: 2,
          title: 'Test Activity 2',
          description: 'Test description',
          priority: 'someday',
          energy_level: 'low',
          is_completed: 0,
          category_id: 1,
          category: {
            id: 1,
            name: 'Test Category',
            color: '#ff0000',
            icon: 'test-icon',
            created_at: '2023-01-01',
          },
          created_at: '2023-01-01',
          contexts: [],
          time_slots: [],
          completions_count: 0,
          last_completed: null,
        },
      ];

      const mockActiveContexts: ContextParsed[] = [
        {
          id: 1,
          name: 'test',
          label: 'Test Context',
          days: ['Mon'],
          time_start: '09:00',
          time_end: '17:00',
          created_at: '2023-01-01',
        },
      ];

      const { getActivities } = await import('@/services/activities');
      const { getActiveContexts } = await import('@/services/contexts');

      vi.mocked(getActivities).mockResolvedValue(mockActivities);
      vi.mocked(getActiveContexts).mockResolvedValue(mockActiveContexts);

      // Mock current time to Monday 10:00
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-01-02T10:00:00Z')); // Monday

      const suggestions = await getSuggestedActivities(2);

      expect(suggestions).toHaveLength(1); // Only activity 1 matches context
      expect(suggestions[0].activity.id).toBe(1);
      expect(suggestions[0].score).toBeGreaterThan(0);
      expect(suggestions[0].reason).toContain('Contexto: Test Context');

      vi.useRealTimers();
    });

    it('should filter by category when provided', async () => {
      const mockActivities: ActivityWithDetails[] = [
        {
          id: 1,
          title: 'Test Activity 1',
          description: 'Test description',
          priority: 'urgent',
          energy_level: 'high',
          is_completed: 0,
          category_id: 1,
          category: {
            id: 1,
            name: 'Test Category',
            color: '#ff0000',
            icon: 'test-icon',
            created_at: '2023-01-01',
          },
          created_at: '2023-01-01',
          contexts: [],
          time_slots: [],
          completions_count: 0,
          last_completed: null,
        },
        {
          id: 2,
          title: 'Test Activity 2',
          description: 'Test description',
          priority: 'urgent',
          energy_level: 'high',
          is_completed: 0,
          category_id: 2,
          category: {
            id: 2,
            name: 'Other Category',
            color: '#00ff00',
            icon: 'other-icon',
            created_at: '2023-01-01',
          },
          created_at: '2023-01-01',
          contexts: [],
          time_slots: [],
          completions_count: 0,
          last_completed: null,
        },
      ];

      const { getActivities } = await import('@/services/activities');
      const { getActiveContexts } = await import('@/services/contexts');

      vi.mocked(getActivities).mockResolvedValue(mockActivities);
      vi.mocked(getActiveContexts).mockResolvedValue([]);

      const suggestions = await getSuggestedActivities(10, 1);

      expect(vi.mocked(getActivities)).toHaveBeenCalledWith({
        is_completed: false,
        category_id: 1,
      });
    });

    it('should skip activities without contexts or time slots', async () => {
      const mockActivities: ActivityWithDetails[] = [
        {
          id: 1,
          title: 'Test Activity 1',
          description: 'Test description',
          priority: 'urgent',
          energy_level: 'high',
          is_completed: 0,
          category_id: 1,
          category: {
            id: 1,
            name: 'Test Category',
            color: '#ff0000',
            icon: 'test-icon',
            created_at: '2023-01-01',
          },
          created_at: '2023-01-01',
          contexts: [],
          time_slots: [],
          completions_count: 0,
          last_completed: null,
        },
      ];

      const { getActivities } = await import('@/services/activities');
      const { getActiveContexts } = await import('@/services/contexts');

      vi.mocked(getActivities).mockResolvedValue(mockActivities);
      vi.mocked(getActiveContexts).mockResolvedValue([]);

      const suggestions = await getSuggestedActivities(10);

      expect(suggestions).toHaveLength(0);
    });

    it('should apply priority scoring correctly', async () => {
      const mockActivities: ActivityWithDetails[] = [
        {
          id: 1,
          title: 'Urgent Activity',
          description: 'Test description',
          priority: 'urgent',
          energy_level: 'high',
          is_completed: 0,
          category_id: 1,
          category: {
            id: 1,
            name: 'Test Category',
            color: '#ff0000',
            icon: 'test-icon',
            created_at: '2023-01-01',
          },
          created_at: '2023-01-01',
          contexts: [
            {
              id: 1,
              name: 'test',
              label: 'Test Context',
              days: ['Mon'],
              time_start: '09:00',
              time_end: '17:00',
              created_at: '2023-01-01',
            },
          ],
          time_slots: [],
          completions_count: 0,
          last_completed: null,
        },
        {
          id: 2,
          title: 'Someday Activity',
          description: 'Test description',
          priority: 'someday',
          energy_level: 'high',
          is_completed: 0,
          category_id: 1,
          category: {
            id: 1,
            name: 'Test Category',
            color: '#ff0000',
            icon: 'test-icon',
            created_at: '2023-01-01',
          },
          created_at: '2023-01-01',
          contexts: [
            {
              id: 1,
              name: 'test',
              label: 'Test Context',
              days: ['Mon'],
              time_start: '09:00',
              time_end: '17:00',
              created_at: '2023-01-01',
            },
          ],
          time_slots: [],
          completions_count: 0,
          last_completed: null,
        },
      ];

      const mockActiveContexts: ContextParsed[] = [
        {
          id: 1,
          name: 'test',
          label: 'Test Context',
          days: ['Mon'],
          time_start: '09:00',
          time_end: '17:00',
          created_at: '2023-01-01',
        },
      ];

      const { getActivities } = await import('@/services/activities');
      const { getActiveContexts } = await import('@/services/contexts');

      vi.mocked(getActivities).mockResolvedValue(mockActivities);
      vi.mocked(getActiveContexts).mockResolvedValue(mockActiveContexts);

      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-01-02T10:00:00Z')); // Monday

      const suggestions = await getSuggestedActivities(10);

      expect(suggestions).toHaveLength(2);
      expect(suggestions[0].activity.priority).toBe('urgent');
      expect(suggestions[1].activity.priority).toBe('someday');
      expect(suggestions[0].score).toBeGreaterThan(suggestions[1].score);

      vi.useRealTimers();
    });
  });

  describe('getActivitiesByTimeOfDay', () => {
    it('should filter activities by morning time range', async () => {
      const mockActivities: ActivityWithDetails[] = [
        {
          id: 1,
          title: 'Morning Activity',
          description: 'Test description',
          priority: 'urgent',
          energy_level: 'high',
          is_completed: 0,
          category_id: 1,
          category: {
            id: 1,
            name: 'Test Category',
            color: '#ff0000',
            icon: 'test-icon',
            created_at: '2023-01-01',
          },
          created_at: '2023-01-01',
          contexts: [],
          time_slots: [
            { id: 1, activity_id: 1, day_of_week: 'Mon', time_start: '08:00', time_end: '10:00' },
          ],
          completions_count: 0,
          last_completed: null,
        },
        {
          id: 2,
          title: 'Evening Activity',
          description: 'Test description',
          priority: 'urgent',
          energy_level: 'high',
          is_completed: 0,
          category_id: 1,
          category: {
            id: 1,
            name: 'Test Category',
            color: '#ff0000',
            icon: 'test-icon',
            created_at: '2023-01-01',
          },
          created_at: '2023-01-01',
          contexts: [],
          time_slots: [
            { id: 2, activity_id: 2, day_of_week: 'Mon', time_start: '20:00', time_end: '22:00' },
          ],
          completions_count: 0,
          last_completed: null,
        },
      ];

      const { getActivities } = await import('@/services/activities');
      vi.mocked(getActivities).mockResolvedValue(mockActivities);

      const morningActivities = await getActivitiesByTimeOfDay('morning');

      expect(morningActivities).toHaveLength(1);
      expect(morningActivities[0].id).toBe(1);
    });
  });

  describe('getActivitiesByCategory', () => {
    it('should call getSuggestedActivities with correct parameters', async () => {
      const { getActivities } = await import('@/services/activities');
      const { getActiveContexts } = await import('@/services/contexts');

      vi.mocked(getActivities).mockResolvedValue([]);
      vi.mocked(getActiveContexts).mockResolvedValue([]);

      await getActivitiesByCategory(1);

      expect(vi.mocked(getActivities)).toHaveBeenCalledWith({
        is_completed: false,
        category_id: 1,
      });
    });
  });
});
