import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '@/services/categories';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    execute: vi.fn().mockResolvedValue({
      rows: [],
      columns: [],
      columnTypes: [],
      rowsAffected: 0,
      lastInsertRowid: 1,
      toJSON: () => ({}),
    }),
  },
}));

describe('Categories Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should return all categories sorted by name', async () => {
      const mockDbResult = {
        rows: [
          {
            id: 1,
            name: 'A Category',
            color: '#00ff00',
            icon: 'a-icon',
            created_at: '2023-01-01',
            length: 5,
          },
          {
            id: 2,
            name: 'Z Category',
            color: '#ff0000',
            icon: 'z-icon',
            created_at: '2023-01-02',
            length: 5,
          },
        ],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(1),
        toJSON: () => ({}),
      };

      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue(mockDbResult);

      const categories = await getCategories();

      expect(vi.mocked(db.execute)).toHaveBeenCalledWith(
        'SELECT * FROM categories ORDER BY name ASC'
      );
      expect(categories).toHaveLength(2);
      expect(categories[0].name).toBe('A Category'); // Should be sorted
      expect(categories[1].name).toBe('Z Category');
    });

    it('should handle empty result', async () => {
      const mockDbResult = {
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(1),
        toJSON: () => ({}),
      };

      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue(mockDbResult);

      const categories = await getCategories();

      expect(categories).toHaveLength(0);
    });
  });

  describe('getCategoryById', () => {
    it('should return category when found', async () => {
      const mockDbResult = {
        rows: [
          {
            id: 1,
            name: 'Test Category',
            color: '#ff0000',
            icon: 'test-icon',
            created_at: '2023-01-01',
            length: 5,
          },
        ],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(1),
        toJSON: () => ({}),
      };

      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue(mockDbResult);

      const category = await getCategoryById(1);

      expect(vi.mocked(db.execute)).toHaveBeenCalledWith({
        sql: 'SELECT * FROM categories WHERE id = ?',
        args: [1],
      });
      expect(category).toEqual({
        id: 1,
        name: 'Test Category',
        color: '#ff0000',
        icon: 'test-icon',
        created_at: '2023-01-01',
      });
    });

    it('should return null when not found', async () => {
      const mockDbResult = {
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(1),
        toJSON: () => ({}),
      };

      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue(mockDbResult);

      const category = await getCategoryById(999);

      expect(category).toBeNull();
    });
  });

  describe('createCategory', () => {
    it('should create category with all fields', async () => {
      const mockDbResult = {
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(123),
        toJSON: () => ({}),
      };

      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue(mockDbResult);

      const categoryId = await createCategory('Test Category', '#ff0000', 'test-icon');

      expect(vi.mocked(db.execute)).toHaveBeenCalledWith({
        sql: 'INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)',
        args: ['Test Category', '#ff0000', 'test-icon'],
      });
      expect(categoryId).toBe(123);
    });

    it('should create category without icon', async () => {
      const mockDbResult = {
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(123),
        toJSON: () => ({}),
      };

      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue(mockDbResult);

      const categoryId = await createCategory('Test Category', '#ff0000');

      expect(vi.mocked(db.execute)).toHaveBeenCalledWith({
        sql: 'INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)',
        args: ['Test Category', '#ff0000', null],
      });
      expect(categoryId).toBe(123);
    });

    it('should trim name', async () => {
      const mockDbResult = {
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(123),
        toJSON: () => ({}),
      };

      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue(mockDbResult);

      await createCategory('  Test Category  ', '#ff0000');

      expect(vi.mocked(db.execute)).toHaveBeenCalledWith({
        sql: 'INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)',
        args: ['Test Category', '#ff0000', null],
      });
    });
  });

  describe('updateCategory', () => {
    it('should update all fields', async () => {
      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue({
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(1),
        toJSON: () => ({}),
      });

      await updateCategory(1, { name: 'New Name', color: '#00ff00', icon: 'new-icon' });

      expect(vi.mocked(db.execute)).toHaveBeenCalledWith({
        sql: 'UPDATE categories SET name = ?, color = ?, icon = ? WHERE id = ?',
        args: ['New Name', '#00ff00', 'new-icon', 1],
      });
    });

    it('should update only provided fields', async () => {
      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue({
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(1),
        toJSON: () => ({}),
      });

      await updateCategory(1, { name: 'New Name' });

      expect(vi.mocked(db.execute)).toHaveBeenCalledWith({
        sql: 'UPDATE categories SET name = ? WHERE id = ?',
        args: ['New Name', 1],
      });
    });

    it('should not execute query if no fields provided', async () => {
      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue({
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(1),
        toJSON: () => ({}),
      });

      await updateCategory(1, {});

      expect(vi.mocked(db.execute)).not.toHaveBeenCalled();
    });

    it('should handle null icon', async () => {
      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue({
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(1),
        toJSON: () => ({}),
      });

      await updateCategory(1, { icon: null });

      expect(vi.mocked(db.execute)).toHaveBeenCalledWith({
        sql: 'UPDATE categories SET icon = ? WHERE id = ?',
        args: [null, 1],
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete category by id', async () => {
      const { db } = await import('@/lib/db');
      vi.mocked(db.execute).mockResolvedValue({
        rows: [],
        columns: [],
        columnTypes: [],
        rowsAffected: 0,
        lastInsertRowid: BigInt(1),
        toJSON: () => ({}),
      });

      await deleteCategory(1);

      expect(vi.mocked(db.execute)).toHaveBeenCalledWith({
        sql: 'DELETE FROM categories WHERE id = ?',
        args: [1],
      });
    });
  });
});
