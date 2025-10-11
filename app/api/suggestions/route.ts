import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSuggestedActivities } from '@/lib/suggestions';

// GET /api/suggestions - Get suggested activities for current time
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = searchParams.has('limit') ? Number(searchParams.get('limit')) : 10;

    const category = searchParams.has('category')
      ? Number(searchParams.get('category'))
      : undefined;

    const suggestions = await getSuggestedActivities(limit, category);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return NextResponse.json({ error: 'Failed to get suggestions' }, { status: 500 });
  }
}
