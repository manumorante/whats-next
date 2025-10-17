import { db } from '@/lib/db';
import type { Category } from '@/lib/types';

// ==================================================
// GET ALL CATEGORIES
// ==================================================
export async function getCategories(): Promise<Category[]> {
  const result = await db.execute('SELECT * FROM categories ORDER BY name ASC');

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
    color: row.color as string,
    icon: row.icon as string | null,
    created_at: row.created_at as string,
  }));
}

// ==================================================
// GET CATEGORY BY ID
// ==================================================
export async function getCategoryById(id: number): Promise<Category | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM categories WHERE id = ?',
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    name: row.name as string,
    color: row.color as string,
    icon: row.icon as string | null,
    created_at: row.created_at as string,
  };
}

// ==================================================
// CREATE CATEGORY
// ==================================================
export async function createCategory(name: string, color: string, icon?: string): Promise<number> {
  const result = await db.execute({
    sql: 'INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)',
    args: [name.trim(), color, icon || null],
  });

  return Number(result.lastInsertRowid);
}

// ==================================================
// UPDATE CATEGORY
// ==================================================
export async function updateCategory(
  id: number,
  data: { name?: string; color?: string; icon?: string }
): Promise<void> {
  const fields: string[] = [];
  const args: (string | number | null)[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    args.push(data.name.trim());
  }

  if (data.color !== undefined) {
    fields.push('color = ?');
    args.push(data.color);
  }

  if (data.icon !== undefined) {
    fields.push('icon = ?');
    args.push(data.icon || null);
  }

  if (fields.length > 0) {
    args.push(id);
    await db.execute({
      sql: `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      args,
    });
  }
}

// ==================================================
// DELETE CATEGORY
// ==================================================
export async function deleteCategory(id: number): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM categories WHERE id = ?',
    args: [id],
  });
  // Note: Activities will have category_id set to NULL due to ON DELETE SET NULL
}
