-- Migration: Remove duration_minutes column from activities table
-- Date: 2025-10-11

ALTER TABLE activities DROP COLUMN duration_minutes;

