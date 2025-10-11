import { db, initDb } from '@/lib/db';
import type { Task } from '@/lib/types';

// Ensure table exists
initDb().catch(console.error);

export async function getTasks(): Promise<Task[]> {
  const result = await db.execute('SELECT * FROM tasks ORDER BY id DESC');
  return result.rows.map((row) => ({
    id: row.id as number,
    title: row.title as string,
    completed: row.completed as number,
    created_at: row.created_at as string,
  }));
}

export async function createTask(title: string): Promise<void> {
  await db.execute({
    sql: 'INSERT INTO tasks (title, completed) VALUES (?, 0)',
    args: [title.trim()],
  });
}

export async function toggleTask(id: number): Promise<void> {
  await db.execute({
    sql: 'UPDATE tasks SET completed = NOT completed WHERE id = ?',
    args: [id],
  });
}

export async function deleteTask(id: number): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM tasks WHERE id = ?',
    args: [id],
  });
}
