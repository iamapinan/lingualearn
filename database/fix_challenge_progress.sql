-- Fix Challenge Progress for Users
-- This SQL script fixes challenge progress tracking issues where progress is not being updated correctly
-- Run this script to sync challenge progress based on actual lesson completions

-- Step 1: Fix "Complete 3 Lessons" challenge progress
-- Update challenge progress based on actual lessons completed count for each user
UPDATE user_challenges uc
INNER JOIN (
    SELECT 
        u.id as user_id,
        c.id as challenge_id,
        COALESCE(COUNT(DISTINCT lc.lesson_id), 0) as actual_progress
    FROM users u
    CROSS JOIN challenges c
    LEFT JOIN lesson_completions lc ON lc.user_id = u.id
    WHERE c.type = 'lesson' 
      AND c.title LIKE '%Complete 3 Lessons%'
    GROUP BY u.id, c.id
) AS progress_data ON uc.user_id = progress_data.user_id AND uc.challenge_id = progress_data.challenge_id
SET 
    uc.progress = LEAST(progress_data.actual_progress, (SELECT requirement_count FROM challenges WHERE id = progress_data.challenge_id)),
    uc.completed = CASE 
        WHEN progress_data.actual_progress >= (SELECT requirement_count FROM challenges WHERE id = progress_data.challenge_id) THEN 1 
        ELSE 0 
    END,
    uc.completed_at = CASE 
        WHEN progress_data.actual_progress >= (SELECT requirement_count FROM challenges WHERE id = progress_data.challenge_id) 
             AND uc.completed_at IS NULL 
        THEN NOW()
        ELSE uc.completed_at
    END
WHERE EXISTS (
    SELECT 1 FROM challenges c 
    WHERE c.id = progress_data.challenge_id 
      AND c.type = 'lesson' 
      AND c.title LIKE '%Complete 3 Lessons%'
);

-- Step 2: Create missing challenge progress entries for users who completed lessons but don't have challenge records
INSERT INTO user_challenges (user_id, challenge_id, progress, completed, completed_at)
SELECT 
    u.id as user_id,
    c.id as challenge_id,
    LEAST(
        COALESCE(COUNT(DISTINCT lc.lesson_id), 0),
        c.requirement_count
    ) as progress,
    CASE 
        WHEN COALESCE(COUNT(DISTINCT lc.lesson_id), 0) >= c.requirement_count THEN 1 
        ELSE 0 
    END as completed,
    CASE 
        WHEN COALESCE(COUNT(DISTINCT lc.lesson_id), 0) >= c.requirement_count THEN NOW()
        ELSE NULL
    END as completed_at
FROM users u
CROSS JOIN challenges c
LEFT JOIN lesson_completions lc ON lc.user_id = u.id
WHERE c.type = 'lesson' 
  AND c.title LIKE '%Complete 3 Lessons%'
  AND NOT EXISTS (
      SELECT 1 FROM user_challenges uc 
      WHERE uc.user_id = u.id AND uc.challenge_id = c.id
  )
GROUP BY u.id, c.id
HAVING COUNT(DISTINCT lc.lesson_id) > 0;

-- Step 3: Fix "Perfect Score" challenge progress
-- Update perfect score challenge based on lesson completions with score = 100
UPDATE user_challenges uc
INNER JOIN (
    SELECT 
        u.id as user_id,
        c.id as challenge_id,
        COALESCE(COUNT(DISTINCT CASE WHEN lc.score = 100 THEN lc.lesson_id END), 0) as perfect_lessons
    FROM users u
    CROSS JOIN challenges c
    LEFT JOIN lesson_completions lc ON lc.user_id = u.id AND lc.score = 100
    WHERE c.type = 'perfect_score'
    GROUP BY u.id, c.id
) AS progress_data ON uc.user_id = progress_data.user_id AND uc.challenge_id = progress_data.challenge_id
SET 
    uc.progress = LEAST(progress_data.perfect_lessons, (SELECT requirement_count FROM challenges WHERE id = progress_data.challenge_id)),
    uc.completed = CASE 
        WHEN progress_data.perfect_lessons >= (SELECT requirement_count FROM challenges WHERE id = progress_data.challenge_id) THEN 1 
        ELSE 0 
    END,
    uc.completed_at = CASE 
        WHEN progress_data.perfect_lessons >= (SELECT requirement_count FROM challenges WHERE id = progress_data.challenge_id) 
             AND uc.completed_at IS NULL 
        THEN NOW()
        ELSE uc.completed_at
    END
WHERE EXISTS (
    SELECT 1 FROM challenges c 
    WHERE c.id = progress_data.challenge_id 
      AND c.type = 'perfect_score'
);

-- Step 4: Create missing perfect score challenge entries
INSERT INTO user_challenges (user_id, challenge_id, progress, completed, completed_at)
SELECT 
    u.id as user_id,
    c.id as challenge_id,
    LEAST(
        COALESCE(COUNT(DISTINCT CASE WHEN lc.score = 100 THEN lc.lesson_id END), 0),
        c.requirement_count
    ) as progress,
    CASE 
        WHEN COALESCE(COUNT(DISTINCT CASE WHEN lc.score = 100 THEN lc.lesson_id END), 0) >= c.requirement_count THEN 1 
        ELSE 0 
    END as completed,
    CASE 
        WHEN COALESCE(COUNT(DISTINCT CASE WHEN lc.score = 100 THEN lc.lesson_id END), 0) >= c.requirement_count THEN NOW()
        ELSE NULL
    END as completed_at
FROM users u
CROSS JOIN challenges c
LEFT JOIN lesson_completions lc ON lc.user_id = u.id AND lc.score = 100
WHERE c.type = 'perfect_score'
  AND NOT EXISTS (
      SELECT 1 FROM user_challenges uc 
      WHERE uc.user_id = u.id AND uc.challenge_id = c.id
  )
GROUP BY u.id, c.id
HAVING COUNT(DISTINCT CASE WHEN lc.score = 100 THEN lc.lesson_id END) > 0;

-- Step 5: Fix mission progress for lesson-related missions
UPDATE user_missions um
INNER JOIN (
    SELECT 
        u.id as user_id,
        m.id as mission_id,
        COALESCE(COUNT(DISTINCT lc.lesson_id), 0) as actual_progress,
        JSON_EXTRACT(m.requirements, '$.count') as required_count
    FROM users u
    CROSS JOIN missions m
    LEFT JOIN lesson_completions lc ON lc.user_id = u.id
    WHERE JSON_EXTRACT(m.requirements, '$.type') = 'lesson'
    GROUP BY u.id, m.id
) AS progress_data ON um.user_id = progress_data.user_id AND um.mission_id = progress_data.mission_id
SET 
    um.progress = LEAST(progress_data.actual_progress, progress_data.required_count),
    um.completed = CASE 
        WHEN progress_data.actual_progress >= progress_data.required_count THEN 1 
        ELSE 0 
    END,
    um.completed_at = CASE 
        WHEN progress_data.actual_progress >= progress_data.required_count 
             AND um.completed_at IS NULL 
        THEN NOW()
        ELSE um.completed_at
    END,
    um.requirement_count = progress_data.required_count
WHERE EXISTS (
    SELECT 1 FROM missions m 
    WHERE m.id = progress_data.mission_id 
      AND JSON_EXTRACT(m.requirements, '$.type') = 'lesson'
);

-- Step 6: Create missing mission progress entries for lesson-related missions
INSERT INTO user_missions (user_id, mission_id, progress, requirement_count, completed, completed_at, claimed)
SELECT 
    u.id as user_id,
    m.id as mission_id,
    LEAST(
        COALESCE(COUNT(DISTINCT lc.lesson_id), 0),
        JSON_EXTRACT(m.requirements, '$.count')
    ) as progress,
    JSON_EXTRACT(m.requirements, '$.count') as requirement_count,
    CASE 
        WHEN COALESCE(COUNT(DISTINCT lc.lesson_id), 0) >= JSON_EXTRACT(m.requirements, '$.count') THEN 1 
        ELSE 0 
    END as completed,
    CASE 
        WHEN COALESCE(COUNT(DISTINCT lc.lesson_id), 0) >= JSON_EXTRACT(m.requirements, '$.count') THEN NOW()
        ELSE NULL
    END as completed_at,
    0 as claimed
FROM users u
CROSS JOIN missions m
LEFT JOIN lesson_completions lc ON lc.user_id = u.id
WHERE JSON_EXTRACT(m.requirements, '$.type') = 'lesson'
  AND NOT EXISTS (
      SELECT 1 FROM user_missions um 
      WHERE um.user_id = u.id AND um.mission_id = m.id
  )
GROUP BY u.id, m.id
HAVING COUNT(DISTINCT lc.lesson_id) > 0;

-- Step 7: Ensure progress doesn't exceed requirement count
UPDATE user_challenges uc
INNER JOIN challenges c ON c.id = uc.challenge_id
SET uc.progress = LEAST(uc.progress, c.requirement_count)
WHERE uc.progress > c.requirement_count;

UPDATE user_missions um
INNER JOIN missions m ON m.id = um.mission_id
SET um.progress = LEAST(um.progress, um.requirement_count)
WHERE um.progress > um.requirement_count;

-- Verification queries (run these to check results):
-- SELECT u.id, u.name, c.title, uc.progress, c.requirement_count, uc.completed 
-- FROM user_challenges uc
-- INNER JOIN users u ON u.id = uc.user_id
-- INNER JOIN challenges c ON c.id = uc.challenge_id
-- WHERE c.type = 'lesson'
-- ORDER BY u.id, c.id;

-- SELECT u.id, u.name, m.title, um.progress, um.requirement_count, um.completed 
-- FROM user_missions um
-- INNER JOIN users u ON u.id = um.user_id
-- INNER JOIN missions m ON m.id = um.mission_id
-- WHERE JSON_EXTRACT(m.requirements, '$.type') = 'lesson'
-- ORDER BY u.id, m.id;

