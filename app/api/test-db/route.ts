import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/services/test-db';

// GET /api/test-db - Test database connection
export async function GET(request: NextRequest) {
  try {
    const result = await testDatabaseConnection();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error testing database:', error);
    return NextResponse.json({ error: 'Failed to test database' }, { status: 500 });
  }
}
