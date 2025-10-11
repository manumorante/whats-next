import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  createContext,
  deleteContext,
  getActiveContexts,
  getContexts,
  updateContext,
} from '@/lib/contexts';

// GET /api/contexts - Get all contexts or active contexts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') === 'true';

    const contexts = active ? await getActiveContexts() : await getContexts();
    return NextResponse.json(contexts);
  } catch (error) {
    console.error('Error fetching contexts:', error);
    return NextResponse.json({ error: 'Failed to fetch contexts' }, { status: 500 });
  }
}

// POST /api/contexts - Create new context
export async function POST(request: NextRequest) {
  try {
    const { name, label, days, time_start, time_end } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!label?.trim()) {
      return NextResponse.json({ error: 'Label is required' }, { status: 400 });
    }

    const contextId = await createContext(name, label, days, time_start, time_end);

    return NextResponse.json({ success: true, id: contextId }, { status: 201 });
  } catch (error) {
    console.error('Error creating context:', error);
    return NextResponse.json({ error: 'Failed to create context' }, { status: 500 });
  }
}

// PUT /api/contexts?id=X - Update context
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Context ID is required' }, { status: 400 });
    }

    const body = await request.json();
    await updateContext(Number(id), body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating context:', error);
    return NextResponse.json({ error: 'Failed to update context' }, { status: 500 });
  }
}

// DELETE /api/contexts?id=X - Delete context
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Context ID is required' }, { status: 400 });
    }

    await deleteContext(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting context:', error);
    return NextResponse.json({ error: 'Failed to delete context' }, { status: 500 });
  }
}
