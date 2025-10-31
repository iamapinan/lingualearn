-- Fix Statistics Tracking System
-- This migration ensures that user_progress table can store userId properly
-- and all statistics tracking works correctly

-- Add userId column to user_progress table if it doesn't exist
-- Note: This is for IndexedDB schema, but we document the expected structure here

-- For MySQL/PostgreSQL databases:
-- ALTER TABLE user_progress ADD COLUMN userId INT NOT NULL DEFAULT 0 AFTER id;
-- CREATE INDEX idx_user_progress_userId ON user_progress(userId);

-- For IndexedDB (client-side), the schema is defined in JavaScript
-- The following changes ensure proper data structure:

-- 1. Ensure user_progress has userId field
-- 2. Ensure proper indexes exist for:
--    - userId + lessonId (for user progress queries)
--    - userId + questionId (for progress tracking)

-- Note: Actual database schema changes should be handled by the IndexedDB 
-- initialization code. This SQL file serves as documentation of the expected structure.

-- Verification queries (for SQL databases):
-- SELECT COUNT(*) FROM user_progress WHERE userId IS NULL OR userId = 0;
-- SELECT userId, lessonId, COUNT(*) as progress_count 
-- FROM user_progress 
-- GROUP BY userId, lessonId 
-- ORDER BY userId, lessonId;

