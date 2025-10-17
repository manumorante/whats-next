import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateActivity } from '@/services/activities';
import * as dbModule from '@/lib/db';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    execute: vi.fn(),
  },
}));

describe('updateActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle null title without throwing error', async () => {
    const mockExecute = vi.spyOn(dbModule.db, 'execute');

    await updateActivity(1, { title: null });

    expect(mockExecute).toHaveBeenCalledWith({
      sql: 'UPDATE activities SET title = ? WHERE id = ?',
      args: [null, 1],
    });
  });

  it('should handle empty string title', async () => {
    const mockExecute = vi.spyOn(dbModule.db, 'execute');

    await updateActivity(1, { title: '' });

    expect(mockExecute).toHaveBeenCalledWith({
      sql: 'UPDATE activities SET title = ? WHERE id = ?',
      args: [null, 1],
    });
  });

  it('should trim valid title', async () => {
    const mockExecute = vi.spyOn(dbModule.db, 'execute');

    await updateActivity(1, { title: '  Test Title  ' });

    expect(mockExecute).toHaveBeenCalledWith({
      sql: 'UPDATE activities SET title = ? WHERE id = ?',
      args: ['Test Title', 1],
    });
  });

  it('should update multiple fields', async () => {
    const mockExecute = vi.spyOn(dbModule.db, 'execute');

    await updateActivity(1, {
      title: 'New Title',
      description: 'New description',
      priority: 'urgent',
    });

    expect(mockExecute).toHaveBeenCalledWith({
      sql: 'UPDATE activities SET title = ?, description = ?, priority = ? WHERE id = ?',
      args: ['New Title', 'New description', 'urgent', 1],
    });
  });

  it('should handle null description', async () => {
    const mockExecute = vi.spyOn(dbModule.db, 'execute');

    await updateActivity(1, { description: null });

    expect(mockExecute).toHaveBeenCalledWith({
      sql: 'UPDATE activities SET description = ? WHERE id = ?',
      args: [null, 1],
    });
  });

  it('should not execute query if no fields to update', async () => {
    const mockExecute = vi.spyOn(dbModule.db, 'execute');

    await updateActivity(1, {});

    expect(mockExecute).not.toHaveBeenCalled();
  });
});
