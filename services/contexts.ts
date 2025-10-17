import { db } from '@/lib/db';
import type { ContextParsed } from '@/lib/types';

// ==================================================
// GET ALL CONTEXTS
// ==================================================
export async function getContexts(): Promise<ContextParsed[]> {
  const result = await db.execute('SELECT * FROM contexts ORDER BY name ASC');

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
    label: row.label as string,
    days: row.days ? JSON.parse(row.days as string) : null,
    time_start: row.time_start as string | null,
    time_end: row.time_end as string | null,
    created_at: row.created_at as string,
  }));
}

// ==================================================
// GET CONTEXT BY ID
// ==================================================
export async function getContextById(id: number): Promise<ContextParsed | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM contexts WHERE id = ?',
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id as number,
    name: row.name as string,
    label: row.label as string,
    days: row.days ? JSON.parse(row.days as string) : null,
    time_start: row.time_start as string | null,
    time_end: row.time_end as string | null,
    created_at: row.created_at as string,
  };
}

// ==================================================
// CREATE CONTEXT
// ==================================================
export async function createContext(
  name: string,
  label: string,
  days?: string[],
  time_start?: string,
  time_end?: string
): Promise<number> {
  const result = await db.execute({
    sql: 'INSERT INTO contexts (name, label, days, time_start, time_end) VALUES (?, ?, ?, ?, ?)',
    args: [
      name.trim(),
      label.trim(),
      days ? JSON.stringify(days) : null,
      time_start || null,
      time_end || null,
    ],
  });

  return Number(result.lastInsertRowid);
}

// ==================================================
// UPDATE CONTEXT
// ==================================================
export async function updateContext(
  id: number,
  data: {
    name?: string;
    label?: string;
    days?: string[];
    time_start?: string;
    time_end?: string;
  }
): Promise<void> {
  const fields: string[] = [];
  const args: (string | number | null)[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    args.push(data.name.trim());
  }

  if (data.label !== undefined) {
    fields.push('label = ?');
    args.push(data.label.trim());
  }

  if (data.days !== undefined) {
    fields.push('days = ?');
    args.push(data.days ? JSON.stringify(data.days) : null);
  }

  if (data.time_start !== undefined) {
    fields.push('time_start = ?');
    args.push(data.time_start || null);
  }

  if (data.time_end !== undefined) {
    fields.push('time_end = ?');
    args.push(data.time_end || null);
  }

  if (fields.length > 0) {
    args.push(id);
    await db.execute({
      sql: `UPDATE contexts SET ${fields.join(', ')} WHERE id = ?`,
      args,
    });
  }
}

// ==================================================
// DELETE CONTEXT
// ==================================================
export async function deleteContext(id: number): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM contexts WHERE id = ?',
    args: [id],
  });
  // Note: Cascading deletes will handle related records
}

// ==================================================
// GET ACTIVE CONTEXTS (for current time)
// ==================================================
export async function getActiveContexts(): Promise<ContextParsed[]> {
  const now = new Date();
  const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
  const currentTime = now.toTimeString().substring(0, 5); // HH:MM format

  const allContexts = await getContexts();

  return allContexts.filter((context) => {
    // Check if current day matches
    if (context.days && !context.days.includes(currentDay)) {
      return false;
    }

    // Check if current time is within range
    if (context.time_start && context.time_end) {
      // Handle time ranges that cross midnight (e.g., 23:00 to 05:00)
      if (context.time_end < context.time_start) {
        // Range crosses midnight: active if after start OR before end
        return currentTime >= context.time_start || currentTime <= context.time_end;
      }
      // Normal range: active if between start and end
      return currentTime >= context.time_start && currentTime <= context.time_end;
    }

    return true;
  });
}
