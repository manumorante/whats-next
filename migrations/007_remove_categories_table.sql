-- Migration: Remove categories table and make category_id a simple field
-- Date: 2024-12-19

-- First, create a new activities table without foreign key constraint
CREATE TABLE activities_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category_id INTEGER DEFAULT 1,
  energy INTEGER DEFAULT 2,
  priority INTEGER DEFAULT 3,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Copy data from old table to new table
INSERT INTO activities_new (id, title, category_id, energy, priority, created_at)
SELECT id, title, category_id, energy, priority, created_at
FROM activities;

-- Drop old table
DROP TABLE activities;

-- Rename new table to original name
ALTER TABLE activities_new RENAME TO activities;

-- Drop the categories table
DROP TABLE categories;
