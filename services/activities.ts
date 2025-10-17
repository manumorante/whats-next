import { db } from '@/lib/db';
import type {
  ActivityCompletion,
  ActivityWithDetails,
  CreateActivityRequest,
  Energy,
  GetActivitiesFilters,
  Priority,
  UpdateActivityRequest,
} from '@/lib/types';

// ==================================================
// GET ACTIVITIES
// ==================================================
export async function getActivities(
  filters?: GetActivitiesFilters
): Promise<ActivityWithDetails[]> {
  let sql = `
    SELECT
      a.id,
      a.title,
      a.description,
      a.category_id,
      a.energy,
      a.priority,
      a.created_at,
      c.name as category_name,
      c.color as category_color,
      c.icon as category_icon,
      COUNT(DISTINCT ac.completed_at) as completions_count,
      MAX(ac.completed_at) as last_completed
    FROM activities a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN activity_completions ac ON a.id = ac.activity_id
  `;

  const conditions: string[] = [];
  const args: (string | number)[] = [];

  if (filters?.category_id) {
    conditions.push('a.category_id = ?');
    args.push(filters.category_id);
  }

  if (filters?.priority) {
    conditions.push('a.priority = ?');
    args.push(filters.priority);
  }

  if (filters?.energy) {
    conditions.push('a.energy = ?');
    args.push(filters.energy);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  sql += ' GROUP BY a.id ORDER BY a.priority DESC, a.created_at DESC';

  const result = await db.execute({ sql, args });

  const activities: ActivityWithDetails[] = [];

  for (const row of result.rows) {
    const activity: ActivityWithDetails = {
      id: row.id as number,
      title: row.title as string,
      description: row.description as string | null,
      category_id: row.category_id as number | null,
      energy: row.energy as Energy | null,
      priority: row.priority as Priority,
      created_at: row.created_at as string,
      completions_count: row.completions_count as number,
      last_completed: row.last_completed as string | null,
    };

    // Add category if exists
    if (row.category_name) {
      activity.category = {
        id: row.category_id as number,
        name: row.category_name as string,
        color: row.category_color as string,
        icon: row.category_icon as string | null,
        created_at: '',
      };
    }

    // Get contexts for this activity
    const contextsResult = await db.execute({
      sql: `
        SELECT ctx.* FROM contexts ctx
        INNER JOIN activity_contexts ac ON ctx.id = ac.context_id
        WHERE ac.activity_id = ?
      `,
      args: [activity.id],
    });

    activity.contexts = contextsResult.rows.map((ctx) => ({
      id: ctx.id as number,
      name: ctx.name as string,
      label: ctx.label as string,
      days: ctx.days ? JSON.parse(ctx.days as string) : null,
      time_start: ctx.time_start as string | null,
      time_end: ctx.time_end as string | null,
      created_at: ctx.created_at as string,
    }));

    // Get time slots for this activity
    activities.push(activity);
  }

  return activities;
}

// ==================================================
// TEST FUNCTION
// ==================================================
export async function testGetActivities(): Promise<{
  success: boolean;
  count: number;
  activities: Array<{
    id: number;
    title: string;
    energy: number;
    priority: number;
  }>;
}> {
  try {
    console.log('Testing getActivities...');

    const result = await db.execute({
      sql: 'SELECT id, title, energy, priority FROM activities LIMIT 3',
    });

    console.log('Raw result:', result.rows);

    return {
      success: true,
      count: result.rows.length,
      activities: result.rows.map((row) => ({
        id: row.id as number,
        title: row.title as string,
        energy: row.energy as number,
        priority: row.priority as number,
      })),
    };
  } catch (error) {
    console.error('Error in testGetActivities:', error);
    throw error;
  }
}
export async function getActivityById(id: number): Promise<ActivityWithDetails | null> {
  const activities = await getActivities();
  return activities.find((a) => a.id === id) || null;
}

// ==================================================
// CREATE ACTIVITY
// ==================================================
export async function createActivity(data: CreateActivityRequest): Promise<number> {
  // Insert activity
  const result = await db.execute({
    sql: `
      INSERT INTO activities (
        title, description, category_id,
        energy, priority
      ) VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      data.title.trim(),
      data.description || null,
      data.category_id || null,
      data.energy || null,
      data.priority || 3,
    ],
  });

  const activityId = Number(result.lastInsertRowid);

  // Insert contexts if provided
  if (data.contexts && data.contexts.length > 0) {
    for (const contextId of data.contexts) {
      await db.execute({
        sql: 'INSERT INTO activity_contexts (activity_id, context_id) VALUES (?, ?)',
        args: [activityId, contextId],
      });
    }
  }

  return activityId;
}

// ==================================================
// UPDATE ACTIVITY
// ==================================================
export async function updateActivity(id: number, data: UpdateActivityRequest): Promise<void> {
  const fields: string[] = [];
  const args: (string | number | null)[] = [];

  if (data.title !== undefined) {
    fields.push('title = ?');
    args.push(data.title ? data.title.trim() : null);
  }

  if (data.description !== undefined) {
    fields.push('description = ?');
    args.push(data.description || null);
  }

  if (data.category_id !== undefined) {
    fields.push('category_id = ?');
    args.push(data.category_id || null);
  }

  if (data.energy !== undefined) {
    fields.push('energy = ?');
    args.push(data.energy || null);
  }

  if (data.priority !== undefined) {
    fields.push('priority = ?');
    args.push(data.priority);
  }

  if (fields.length > 0) {
    args.push(id);
    await db.execute({
      sql: `UPDATE activities SET ${fields.join(', ')} WHERE id = ?`,
      args,
    });
  }

  // Update contexts if provided
  if (data.contexts !== undefined) {
    // Delete existing contexts
    await db.execute({
      sql: 'DELETE FROM activity_contexts WHERE activity_id = ?',
      args: [id],
    });

    // Insert new contexts
    for (const contextId of data.contexts) {
      await db.execute({
        sql: 'INSERT INTO activity_contexts (activity_id, context_id) VALUES (?, ?)',
        args: [id, contextId],
      });
    }
  }

  // Los horarios ahora están dentro de los contextos, no en time_slots separados
}

// ==================================================
// DELETE ACTIVITY
// ==================================================
export async function deleteActivity(id: number): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM activities WHERE id = ?',
    args: [id],
  });
  // Note: Cascading deletes will handle related records
}

// ==================================================
// COMPLETE ACTIVITY (for recurring activities)
// ==================================================
export async function completeActivity(id: number, notes?: string): Promise<void> {
  await db.execute({
    sql: 'INSERT INTO activity_completions (activity_id, notes) VALUES (?, ?)',
    args: [id, notes || null],
  });
}

// ==================================================
// GET ACTIVITY COMPLETIONS
// ==================================================
export async function getActivityCompletions(activityId: number): Promise<ActivityCompletion[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM activity_completions WHERE activity_id = ? ORDER BY completed_at DESC',
    args: [activityId],
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    activity_id: row.activity_id as number,
    completed_at: row.completed_at as string,
    notes: row.notes as string | null,
  }));
}
