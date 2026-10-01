-- Migration: Simplify contexts table
-- Date: 2025-01-27
-- Description: Remove label field from contexts table, keep only id and name

-- First, update existing data to use label as name (since label was more descriptive)
UPDATE contexts SET name = label WHERE label IS NOT NULL;

-- Drop the label column
ALTER TABLE contexts DROP COLUMN label;

-- Update the table structure comment
-- contexts table now has: id (PK), name (unique), days, time_start, time_end, created_at
