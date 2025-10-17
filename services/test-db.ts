import { db } from '@/lib/db';

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    const result = await db.execute('SELECT 1 as test');
    console.log('Database test result:', result.rows);
    
    return {
      success: true,
      message: 'Database connection successful',
      result: result.rows
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
