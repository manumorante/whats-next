import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { completeActivity } from '@/lib/activities';

// POST /api/activities/[id]/complete - Mark recurring activity as completed
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { notes } = body;

    await completeActivity(Number(id), notes);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing activity:', error);
    return NextResponse.json({ error: 'Failed to complete activity' }, { status: 500 });
  }
}
