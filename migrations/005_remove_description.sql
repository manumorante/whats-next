-- Migration: Remove description field from activities table
-- Date: 2025-01-18

-- Remove description column from activities table
ALTER TABLE activities DROP COLUMN description;
