import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { toggleActivity } from '@/services/activities';

// POST /api/activities/[id]/toggle - Toggle activity completion
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    await toggleActivity(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling activity:', error);
    return NextResponse.json({ error: 'Failed to toggle activity' }, { status: 500 });
  }
}
