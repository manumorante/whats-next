-- Migration: Rename category_id to category for consistency
-- Date: 2024-12-19

-- Rename the column from category_id to category
ALTER TABLE activities RENAME COLUMN category_id TO category;
