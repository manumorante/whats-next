import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getActivityById } from '@/services/activities';
import type { ErrorResponse } from '@/types/api';

// GET /api/activities/[id] - Get activity by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      const errorResponse: ErrorResponse = { error: 'Invalid activity ID' };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const activity = await getActivityById(id);

    if (!activity) {
      const errorResponse: ErrorResponse = { error: 'Activity not found' };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching activity:', error);
    const errorResponse: ErrorResponse = { error: 'Failed to fetch activity' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
