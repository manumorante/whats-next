import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getActiveContexts } from '@/services/contexts';
import { getTopActivities } from '@/services/suggestions';

// GET /api/suggestions - Get top scored activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = searchParams.has('limit') ? Number(searchParams.get('limit')) : 10;

    // Obtener contextos activos una sola vez
    const activeContexts = await getActiveContexts();

    // Usar los contextos activos para calcular puntuaciones
    const topActivities = await getTopActivities(activeContexts, limit);

    return NextResponse.json(topActivities);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return NextResponse.json({ error: 'Failed to get suggestions' }, { status: 500 });
  }
}
