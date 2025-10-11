import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const db = createClient({
  // biome-ignore lint/style/noNonNullAssertion: Environment variables are required
  url: process.env.TURSO_DATABASE_URL!,
  // biome-ignore lint/style/noNonNullAssertion: Environment variables are required
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Initialize database
async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

initDb().catch(console.error);

// GET - List all tasks
export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM tasks ORDER BY id DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();
    
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await db.execute({
      sql: 'INSERT INTO tasks (title, completed) VALUES (?, 0)',
      args: [title.trim()],
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PUT - Update task (toggle completed)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await db.execute({
      sql: 'UPDATE tasks SET completed = NOT completed WHERE id = ?',
      args: [Number(id)],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE - Delete task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await db.execute({
      sql: 'DELETE FROM tasks WHERE id = ?',
      args: [Number(id)],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

