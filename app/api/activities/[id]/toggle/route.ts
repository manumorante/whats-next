import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { completeActivity } from '@/services/activities';

// POST /api/activities/[id]/toggle - Complete activity (recurring)
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    await completeActivity(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing activity:', error);
    return NextResponse.json({ error: 'Failed to complete activity' }, { status: 500 });
  }
}
