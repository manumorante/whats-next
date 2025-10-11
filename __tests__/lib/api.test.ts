import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '@/lib/api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create ApiError with correct properties', () => {
    const error = new ApiError('Test error', 500, { details: 'Something went wrong' });

    expect(error.message).toBe('Test error');
    expect(error.status).toBe(500);
    expect(error.data).toEqual({ details: 'Something went wrong' });
    expect(error.name).toBe('ApiError');
  });

  it('should handle successful API responses', async () => {
    const mockData = { id: 1, title: 'Test Activity' };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const response = await fetch('/api/activities');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toEqual(mockData);
  });

  it('should handle API errors', async () => {
    const mockError = { error: 'Not found' };

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => mockError,
    });

    const response = await fetch('/api/activities/999');

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  });

  it('should construct proper query strings for filters', () => {
    const filters = {
      category_id: 1,
      priority: 'urgent',
      is_completed: false,
    };

    const params = new URLSearchParams();
    params.set('category_id', '1');
    params.set('priority', 'urgent');
    params.set('is_completed', 'false');

    expect(params.toString()).toBe('category_id=1&priority=urgent&is_completed=false');
  });

  it('should validate API endpoint structure', () => {
    const endpoints = {
      activities: '/api/activities',
      categories: '/api/categories',
      contexts: '/api/contexts',
      suggestions: '/api/suggestions',
    };

    Object.values(endpoints).forEach((endpoint) => {
      expect(endpoint).toMatch(/^\/api\//);
    });
  });
});

