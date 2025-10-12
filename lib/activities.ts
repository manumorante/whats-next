import { db } from '@/lib/db';
import type {
  ActivityCompletion,
  ActivityWithDetails,
  CreateActivityRequest,
  GetActivitiesFilters,
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
      a.*,
      c.id as category_id,
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

  if (filters?.energy_level) {
    conditions.push('a.energy_level = ?');
    args.push(filters.energy_level);
  }

  if (filters?.is_completed !== undefined) {
    conditions.push('a.is_completed = ?');
    args.push(filters.is_completed ? 1 : 0);
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
      energy_level: row.energy_level as string | null as ActivityWithDetails['energy_level'],
      priority: row.priority as string as ActivityWithDetails['priority'],
      is_completed: row.is_completed as number,
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
    const timeSlotsResult = await db.execute({
      sql: 'SELECT * FROM activity_time_slots WHERE activity_id = ?',
      args: [activity.id],
    });

    activity.time_slots = timeSlotsResult.rows.map((slot) => ({
      id: slot.id as number,
      activity_id: slot.activity_id as number,
      day_of_week: slot.day_of_week as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun' | null,
      time_start: slot.time_start as string,
      time_end: slot.time_end as string,
    }));

    activities.push(activity);
  }

  return activities;
}

// ==================================================
// GET ACTIVITY BY ID
// ==================================================
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
        energy_level, priority
      ) VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      data.title.trim(),
      data.description || null,
      data.category_id || null,
      data.energy_level || null,
      data.priority || 'someday',
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

  // Insert time slots if provided
  if (data.time_slots && data.time_slots.length > 0) {
    for (const slot of data.time_slots) {
      await db.execute({
        sql: `
          INSERT INTO activity_time_slots (activity_id, day_of_week, time_start, time_end)
          VALUES (?, ?, ?, ?)
        `,
        args: [activityId, slot.day_of_week || null, slot.time_start, slot.time_end],
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

  if (data.energy_level !== undefined) {
    fields.push('energy_level = ?');
    args.push(data.energy_level || null);
  }

  if (data.priority !== undefined) {
    fields.push('priority = ?');
    args.push(data.priority);
  }

  if (data.is_completed !== undefined) {
    fields.push('is_completed = ?');
    args.push(data.is_completed ? 1 : 0);
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

  // Update time slots if provided
  if (data.time_slots !== undefined) {
    // Delete existing slots
    await db.execute({
      sql: 'DELETE FROM activity_time_slots WHERE activity_id = ?',
      args: [id],
    });

    // Insert new slots
    for (const slot of data.time_slots) {
      await db.execute({
        sql: `
          INSERT INTO activity_time_slots (activity_id, day_of_week, time_start, time_end)
          VALUES (?, ?, ?, ?)
        `,
        args: [id, slot.day_of_week || null, slot.time_start, slot.time_end],
      });
    }
  }
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
// TOGGLE ACTIVITY COMPLETION
// ==================================================
export async function toggleActivity(id: number): Promise<void> {
  // Get current activity
  const activity = await getActivityById(id);

  if (!activity) {
    throw new Error('Activity not found');
  }

  const newCompleted = activity.is_completed === 1 ? 0 : 1;

  // Update completion status
  await db.execute({
    sql: 'UPDATE activities SET is_completed = ? WHERE id = ?',
    args: [newCompleted, id],
  });

  // If marking as completed, add to completions
  if (newCompleted === 1) {
    await db.execute({
      sql: 'INSERT INTO activity_completions (activity_id) VALUES (?)',
      args: [id],
    });
  }
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
