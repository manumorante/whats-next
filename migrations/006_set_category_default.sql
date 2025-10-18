-- Migration: Set default category_id to 1 (General) for activities table
-- Date: 2024-12-19

-- First, update existing NULL category_id values to 1
UPDATE activities SET category_id = 1 WHERE category_id IS NULL;

-- Add default constraint to category_id column
-- Note: SQLite doesn't support ALTER COLUMN with DEFAULT, so we need to recreate the table
-- But since we're just adding a default, we can use a simpler approach

-- Create a new table with the default constraint
CREATE TABLE activities_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category_id INTEGER DEFAULT 1,
  energy INTEGER DEFAULT 2,
  priority INTEGER DEFAULT 3,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Copy data from old table to new table
INSERT INTO activities_new (id, title, category_id, energy, priority, created_at)
SELECT id, title, COALESCE(category_id, 1), energy, priority, created_at
FROM activities;

-- Drop old table
DROP TABLE activities;

-- Rename new table to original name
ALTER TABLE activities_new RENAME TO activities;

-- Recreate indexes if any existed
-- (Add any indexes that were on the original table)
