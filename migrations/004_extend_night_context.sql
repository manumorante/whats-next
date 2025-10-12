-- Migration: Extend night context hours
-- Date: 2025-10-12
-- Description: Extend "Noche" context from 02:00 to 06:00 to cover early morning hours

UPDATE contexts 
SET time_end = '06:00' 
WHERE name = 'late_night';

