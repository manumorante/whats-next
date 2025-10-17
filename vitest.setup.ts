import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock database operations
vi.mock('@/lib/db', () => ({
  db: {
    execute: vi.fn().mockResolvedValue({
      rows: [],
      lastInsertRowid: 1,
    }),
  },
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});
