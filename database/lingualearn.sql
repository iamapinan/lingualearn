-- ============================================
-- LinguaLearn Database Schema (MySQL)
-- ============================================
-- สร้างฐานข้อมูล
-- DROP DATABASE IF EXISTS lingualearn_db;
CREATE DATABASE IF NOT EXISTS lingualearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lingualearn_db;

-- ============================================
-- ตาราง: users (ผู้ใช้งาน)
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar VARCHAR(255) NULL,
    total_xp INT NOT NULL DEFAULT 0,
    lessons_completed INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    total_points INT NOT NULL DEFAULT 0,
    streak INT DEFAULT 0,
    perfect_lesson_streak INT DEFAULT 0,
    recommended_starting_lesson INT,
    speaking_practice JSON,
    games JSON,
    assessment JSON,
    practice_stats JSON,
    study_times JSON,
    completed_lessons JSON,
    timed_writing JSON,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    joined_date DATE NOT NULL,
    last_login_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: sessions (สำหรับจัดการ sessions)
-- ============================================
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: user_stats (สถิติผู้ใช้)
-- ============================================
CREATE TABLE user_stats (
    id INT PRIMARY KEY,
    total_xp INT NOT NULL DEFAULT 0,
    lessons_completed INT NOT NULL DEFAULT 0,
    joined_date DATE NOT NULL,
    level INT NOT NULL DEFAULT 1,
    total_points INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: languages (ภาษาที่รองรับ)
-- ============================================
CREATE TABLE languages (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    icon VARCHAR(10) NOT NULL,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: lessons (บทเรียน)
-- ============================================
CREATE TABLE lessons (
    id INT PRIMARY KEY,
    language_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    total_questions INT NOT NULL,
    lesson_order INT NOT NULL,
    difficulty INT NOT NULL DEFAULT 1,
    description TEXT NOT NULL,
    INDEX idx_language_id (language_id),
    INDEX idx_lesson_order (lesson_order),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: questions (คำถาม)
-- ============================================
CREATE TABLE questions (
    id INT PRIMARY KEY,
    lesson_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    prompt TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer TEXT NOT NULL,
    audio_url VARCHAR(500),
    image_url VARCHAR(500),
    INDEX idx_lesson_id (lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: user_progress (ความคืบหน้าของผู้ใช้)
-- ============================================
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    question_id INT NOT NULL,
    completed BOOLEAN NOT NULL,
    correct BOOLEAN NOT NULL,
    timestamp DATETIME NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: achievements (รางวัล/ความสำเร็จ)
-- ============================================
CREATE TABLE achievements (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL,
    requirement TEXT NOT NULL,
    xp_reward INT DEFAULT 0,
    points_reward INT DEFAULT 0,
    category VARCHAR(50),
    rarity VARCHAR(50),
    INDEX idx_category (category),
    INDEX idx_rarity (rarity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: user_achievements (รางวัลของผู้ใช้)
-- ============================================
CREATE TABLE user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    unlocked_at DATETIME,
    claimed BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_user_id (user_id),
    INDEX idx_achievement_id (achievement_id),
    UNIQUE KEY unique_user_achievement (user_id, achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: vocabulary (คำศัพท์)
-- ============================================
CREATE TABLE vocabulary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    word VARCHAR(255) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    language_id INT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    difficulty DECIMAL(3,2) NOT NULL,
    last_reviewed DATETIME NOT NULL,
    next_review DATETIME NOT NULL,
    correct_count INT NOT NULL DEFAULT 0,
    incorrect_count INT NOT NULL DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_language_id (language_id),
    INDEX idx_next_review (next_review),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: verbs (คำกริยา) - ใหม่
-- ============================================
CREATE TABLE verbs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    base_form VARCHAR(100) NOT NULL,
    past_simple VARCHAR(100) NOT NULL,
    past_participle VARCHAR(100) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    category ENUM('regular', 'irregular') NOT NULL DEFAULT 'regular',
    language_id INT NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    difficulty TINYINT NOT NULL DEFAULT 1,
    example_sentence TEXT,
    last_reviewed DATETIME NOT NULL,
    next_review DATETIME NOT NULL,
    correct_count INT NOT NULL DEFAULT 0,
    incorrect_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_language_id (language_id),
    INDEX idx_difficulty (difficulty),
    INDEX idx_category (category),
    INDEX idx_next_review (next_review)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: challenges (ภารกิจท้าทาย)
-- ============================================
CREATE TABLE challenges (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    xp_reward INT NOT NULL,
    requirement_count INT NOT NULL,
    expires_at DATETIME NOT NULL,
    INDEX idx_type (type),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: user_challenges (ภารกิจของผู้ใช้)
-- ============================================
CREATE TABLE user_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    progress INT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATETIME,
    INDEX idx_user_id (user_id),
    INDEX idx_challenge_id (challenge_id),
    UNIQUE KEY unique_user_challenge (user_id, challenge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: lesson_completions (การทำบทเรียนเสร็จ)
-- ============================================
CREATE TABLE lesson_completions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATETIME NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: missions (ภารกิจ)
-- ============================================
CREATE TABLE missions (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    requirements TEXT NOT NULL,
    xp_reward INT NOT NULL,
    points_reward INT NOT NULL,
    badge_id INT,
    expires_at DATETIME,
    mission_order INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_mission_order (mission_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: user_missions (ภารกิจของผู้ใช้)
-- ============================================
CREATE TABLE user_missions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mission_id INT NOT NULL,
    progress INT NOT NULL DEFAULT 0,
    requirement_count INT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATETIME,
    claimed BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_user_id (user_id),
    INDEX idx_mission_id (mission_id),
    UNIQUE KEY unique_user_mission (user_id, mission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: badges (เหรียญตรา)
-- ============================================
CREATE TABLE badges (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    rarity VARCHAR(50) NOT NULL,
    INDEX idx_category (category),
    INDEX idx_rarity (rarity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ตาราง: user_badges (เหรียญตราของผู้ใช้)
-- ============================================
CREATE TABLE user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at DATETIME NOT NULL,
    displayed BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_user_id (user_id),
    INDEX idx_badge_id (badge_id),
    UNIQUE KEY unique_user_badge (user_id, badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- เพิ่มข้อมูลเริ่มต้น: languages
-- ============================================
INSERT INTO languages (id, name, code, icon) VALUES
(1, 'English', 'en', '🇬🇧'),
(2, 'Thai', 'th', '🇹🇭'),
(3, 'Chinese', 'zh', '🇨🇳'),
(4, 'Italian', 'it', '🇮🇹'),
(5, 'Japanese', 'ja', '🇯🇵'),
(6, 'Korean', 'ko', '🇰🇷');

-- ============================================
-- เพิ่มข้อมูลเริ่มต้น: lessons (10 บทเรียนตัวอย่าง)
-- ============================================
INSERT INTO lessons (id, language_id, name, total_questions, lesson_order, difficulty, description) VALUES
(101, 1, 'Basic Greetings', 5, 1, 1, 'Learn basic English greetings and introductions'),
(102, 1, 'Common Phrases', 5, 2, 1, 'Essential phrases for everyday conversations'),
(103, 1, 'Numbers & Counting', 5, 3, 1, 'Learn numbers and basic counting in English'),
(104, 1, 'Colors & Descriptions', 5, 4, 2, 'Learn colors and descriptive adjectives'),
(105, 1, 'Food & Dining', 5, 5, 2, 'Vocabulary for food, restaurants, and ordering meals'),
(106, 1, 'Travel & Directions', 5, 6, 2, 'Essential vocabulary for traveling and asking for directions'),
(107, 1, 'Present Tense Verbs', 5, 7, 3, 'Learn to use verbs in the present tense'),
(108, 1, 'Past Tense Verbs', 5, 8, 3, 'Learn to use verbs in the past tense'),
(109, 1, 'Future Tense', 5, 9, 3, 'Express future actions and plans in English'),
(110, 1, 'Idioms & Expressions', 5, 10, 4, 'Common English idioms and expressions');

-- ============================================
-- เพิ่มข้อมูลเริ่มต้น: achievements (10 รายการตัวอย่าง)
-- ============================================
INSERT INTO achievements (id, name, description, icon, requirement, xp_reward, points_reward, category, rarity) VALUES
(1, 'First Steps', 'Complete your first lesson', 'Footprints', 'lessons_completed >= 1', 10, 20, 'progress', 'common'),
(2, 'Dedicated Learner', 'Complete 10 lessons', 'GraduationCap', 'lessons_completed >= 10', 50, 100, 'progress', 'uncommon'),
(3, 'On Fire', 'Maintain a 7-day streak', 'Flame', 'streak >= 7', 30, 75, 'streak', 'uncommon'),
(4, 'Vocabulary Master', 'Learn 100 new words', 'Book', 'vocabulary_count >= 100', 100, 200, 'vocabulary', 'rare'),
(5, 'Perfect Score', 'Get 100% on any lesson', 'Trophy', 'perfect_lesson >= 1', 25, 50, 'mastery', 'uncommon'),
(6, 'Early Bird', 'Complete a lesson before 8 AM', 'Sunrise', 'early_practice >= 1', 15, 30, 'special', 'common'),
(7, 'Night Owl', 'Complete a lesson after 10 PM', 'Moon', 'night_practice >= 1', 15, 30, 'special', 'common'),
(8, 'Game Champion', 'Win 10 vocabulary games', 'Gamepad2', 'games_won >= 10', 40, 80, 'games', 'uncommon'),
(9, 'Writing Expert', 'Complete 20 writing exercises', 'PenTool', 'writing_completed >= 20', 60, 120, 'writing', 'rare'),
(10, 'Speed Demon', 'Complete a lesson in under 2 minutes', 'Zap', 'speed_completion >= 1', 35, 70, 'timed_challenges', 'rare');

-- ============================================
-- เพิ่มข้อมูลเริ่มต้น: verbs (50 Irregular Verbs ที่ใช้บ่อย)
-- ============================================
INSERT INTO verbs (user_id, base_form, past_simple, past_participle, translation, category, language_id, language_code, difficulty, example_sentence, last_reviewed, next_review) VALUES
-- Difficulty 1 (Easy - 20 verbs)
(1, 'be', 'was/were', 'been', 'เป็น, อยู่, คือ', 'irregular', 1, 'en', 1, 'I am a student.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'have', 'had', 'had', 'มี', 'irregular', 1, 'en', 1, 'I have a book.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'do', 'did', 'done', 'ทำ', 'irregular', 1, 'en', 1, 'I do my homework every day.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'go', 'went', 'gone', 'ไป', 'irregular', 1, 'en', 1, 'I go to school.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'get', 'got', 'got/gotten', 'ได้รับ, กลายเป็น', 'irregular', 1, 'en', 1, 'I get up at 7 AM.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'make', 'made', 'made', 'ทำ, สร้าง', 'irregular', 1, 'en', 1, 'I make breakfast.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'see', 'saw', 'seen', 'เห็น, ดู', 'irregular', 1, 'en', 1, 'I see a bird.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'come', 'came', 'come', 'มา', 'irregular', 1, 'en', 1, 'Come here, please.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'take', 'took', 'taken', 'เอา, นำ', 'irregular', 1, 'en', 1, 'Take this pen.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'know', 'knew', 'known', 'รู้', 'irregular', 1, 'en', 1, 'I know the answer.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'give', 'gave', 'given', 'ให้', 'irregular', 1, 'en', 1, 'Give me a chance.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'find', 'found', 'found', 'หา, พบ', 'irregular', 1, 'en', 1, 'I found my keys.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'think', 'thought', 'thought', 'คิด', 'irregular', 1, 'en', 1, 'I think so.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'say', 'said', 'said', 'พูด', 'irregular', 1, 'en', 1, 'She said hello.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'tell', 'told', 'told', 'บอก', 'irregular', 1, 'en', 1, 'Tell me the truth.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'buy', 'bought', 'bought', 'ซื้อ', 'irregular', 1, 'en', 1, 'I bought a new phone.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'eat', 'ate', 'eaten', 'กิน', 'irregular', 1, 'en', 1, 'I eat breakfast at 8.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'drink', 'drank', 'drunk', 'ดื่ม', 'irregular', 1, 'en', 1, 'I drink water.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'sleep', 'slept', 'slept', 'นอน', 'irregular', 1, 'en', 1, 'I sleep 8 hours.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'sit', 'sat', 'sat', 'นั่ง', 'irregular', 1, 'en', 1, 'Sit down, please.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),

-- Difficulty 2 (Medium - 20 verbs)
(1, 'write', 'wrote', 'written', 'เขียน', 'irregular', 1, 'en', 2, 'I write a letter.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'read', 'read', 'read', 'อ่าน', 'irregular', 1, 'en', 2, 'I read books every day.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'speak', 'spoke', 'spoken', 'พูด', 'irregular', 1, 'en', 2, 'I speak English.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'run', 'ran', 'run', 'วิ่ง', 'irregular', 1, 'en', 2, 'I run every morning.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'swim', 'swam', 'swum', 'ว่ายน้ำ', 'irregular', 1, 'en', 2, 'I swim in the pool.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'sing', 'sang', 'sung', 'ร้องเพลง', 'irregular', 1, 'en', 2, 'She sings beautifully.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'drive', 'drove', 'driven', 'ขับ', 'irregular', 1, 'en', 2, 'I drive to work.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'fly', 'flew', 'flown', 'บิน', 'irregular', 1, 'en', 2, 'Birds fly in the sky.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'wear', 'wore', 'worn', 'สวมใส่', 'irregular', 1, 'en', 2, 'I wear a uniform.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'teach', 'taught', 'taught', 'สอน', 'irregular', 1, 'en', 2, 'She teaches English.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'learn', 'learnt/learned', 'learnt/learned', 'เรียนรู้', 'irregular', 1, 'en', 2, 'I learn new things.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'feel', 'felt', 'felt', 'รู้สึก', 'irregular', 1, 'en', 2, 'I feel happy.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'meet', 'met', 'met', 'พบ', 'irregular', 1, 'en', 2, 'Nice to meet you.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'leave', 'left', 'left', 'ออกจาก, ทิ้ง', 'irregular', 1, 'en', 2, 'I leave home at 8.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'hear', 'heard', 'heard', 'ได้ยิน', 'irregular', 1, 'en', 2, 'I heard a sound.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'send', 'sent', 'sent', 'ส่ง', 'irregular', 1, 'en', 2, 'I send an email.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'lose', 'lost', 'lost', 'เสีย, หาย', 'irregular', 1, 'en', 2, 'I lost my wallet.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'win', 'won', 'won', 'ชนะ', 'irregular', 1, 'en', 2, 'We won the game.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'break', 'broke', 'broken', 'หัก, แตก', 'irregular', 1, 'en', 2, 'Be careful not to break it.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'choose', 'chose', 'chosen', 'เลือก', 'irregular', 1, 'en', 2, 'Choose one option.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),

-- Difficulty 3 (Hard - 10 verbs)
(1, 'understand', 'understood', 'understood', 'เข้าใจ', 'irregular', 1, 'en', 3, 'I understand the lesson.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'forget', 'forgot', 'forgotten', 'ลืม', 'irregular', 1, 'en', 3, 'Don''t forget your homework.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'begin', 'began', 'begun', 'เริ่ม', 'irregular', 1, 'en', 3, 'Let''s begin the class.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'build', 'built', 'built', 'สร้าง', 'irregular', 1, 'en', 3, 'They built a house.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'catch', 'caught', 'caught', 'จับ', 'irregular', 1, 'en', 3, 'I caught the ball.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'draw', 'drew', 'drawn', 'วาด', 'irregular', 1, 'en', 3, 'I draw pictures.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'fall', 'fell', 'fallen', 'ตก, ล้ม', 'irregular', 1, 'en', 3, 'Be careful not to fall.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'grow', 'grew', 'grown', 'เติบโต', 'irregular', 1, 'en', 3, 'Plants grow quickly.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'throw', 'threw', 'thrown', 'โยน', 'irregular', 1, 'en', 3, 'Throw the ball to me.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'become', 'became', 'become', 'กลายเป็น', 'irregular', 1, 'en', 3, 'I want to become a teacher.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- ============================================
-- เพิ่มข้อมูลเริ่มต้น: Regular Verbs (20 คำ)
-- ============================================
INSERT INTO verbs (user_id, base_form, past_simple, past_participle, translation, category, language_id, language_code, difficulty, example_sentence, last_reviewed, next_review) VALUES
-- Regular verbs - Difficulty 1
(1, 'walk', 'walked', 'walked', 'เดิน', 'regular', 1, 'en', 1, 'I walk to school.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'talk', 'talked', 'talked', 'พูดคุย', 'regular', 1, 'en', 1, 'We talk every day.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'work', 'worked', 'worked', 'ทำงาน', 'regular', 1, 'en', 1, 'I work at a bank.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'play', 'played', 'played', 'เล่น', 'regular', 1, 'en', 1, 'I play football.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'watch', 'watched', 'watched', 'ดู', 'regular', 1, 'en', 1, 'I watch TV.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'listen', 'listened', 'listened', 'ฟัง', 'regular', 1, 'en', 1, 'I listen to music.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'help', 'helped', 'helped', 'ช่วยเหลือ', 'regular', 1, 'en', 1, 'Can you help me?', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'cook', 'cooked', 'cooked', 'ทำอาหาร', 'regular', 1, 'en', 1, 'I cook dinner.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'clean', 'cleaned', 'cleaned', 'ทำความสะอาด', 'regular', 1, 'en', 1, 'I clean my room.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'open', 'opened', 'opened', 'เปิด', 'regular', 1, 'en', 1, 'Open the door.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),

-- Regular verbs - Difficulty 2
(1, 'study', 'studied', 'studied', 'ศึกษา', 'regular', 1, 'en', 2, 'I study English.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'try', 'tried', 'tried', 'พยายาม', 'regular', 1, 'en', 2, 'Try your best.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'visit', 'visited', 'visited', 'เยี่ยมชม', 'regular', 1, 'en', 2, 'I visited Bangkok.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'travel', 'travelled', 'travelled', 'เดินทาง', 'regular', 1, 'en', 2, 'I love to travel.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'dance', 'danced', 'danced', 'เต้นรำ', 'regular', 1, 'en', 2, 'She dances well.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'live', 'lived', 'lived', 'อาศัย', 'regular', 1, 'en', 2, 'I live in Thailand.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'love', 'loved', 'loved', 'รัก', 'regular', 1, 'en', 2, 'I love chocolate.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'like', 'liked', 'liked', 'ชอบ', 'regular', 1, 'en', 2, 'I like pizza.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'want', 'wanted', 'wanted', 'ต้องการ', 'regular', 1, 'en', 2, 'I want to learn.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'need', 'needed', 'needed', 'ต้องการ, จำเป็น', 'regular', 1, 'en', 2, 'I need help.', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- ============================================
-- เพิ่มข้อมูลตัวอย่าง: vocabulary (20 คำศัพท์)
-- ============================================
INSERT INTO vocabulary (user_id, word, translation, language_id, language_code, difficulty, last_reviewed, next_review, correct_count, incorrect_count) VALUES
(1, 'hello', 'สวัสดี', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'goodbye', 'ลาก่อน', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'thank you', 'ขอบคุณ', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'please', 'กรุณา', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'sorry', 'ขอโทษ', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'yes', 'ใช่', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'no', 'ไม่', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'water', 'น้ำ', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'food', 'อาหาร', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'house', 'บ้าน', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'school', 'โรงเรียน', 1, 'en', 1.50, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'friend', 'เพื่อน', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'family', 'ครอบครัว', 1, 'en', 1.50, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'book', 'หนังสือ', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'computer', 'คอมพิวเตอร์', 1, 'en', 1.50, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'phone', 'โทรศัพท์', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'car', 'รถยนต์', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'happy', 'มีความสุข', 1, 'en', 1.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'beautiful', 'สวยงาม', 1, 'en', 2.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0),
(1, 'important', 'สำคัญ', 1, 'en', 2.00, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, 0);

-- ============================================
-- สร้าง user ตัวอย่าง (password: password123)
-- Hash: $2a$10$rZ8qPEFHVvZ8qPEFHVvZ8uK1K1K1K1K1K1K1K1K1K1K1K1K1K1K (ต้อง generate ใหม่ในโค้ด)
-- ============================================
INSERT INTO users (name, email, password_hash, total_xp, lessons_completed, level, total_points, streak, joined_date, is_active, email_verified) VALUES
('Demo User', 'demo@lingualearn.com', '$2a$10$placeholder_password_hash_here', 0, 0, 1, 0, 0, CURDATE(), TRUE, FALSE);

-- ============================================
-- สร้าง indexes เพิ่มเติมสำหรับ performance
-- ============================================
CREATE INDEX idx_verbs_user_language ON verbs(user_id, language_id);
CREATE INDEX idx_vocabulary_user_language ON vocabulary(user_id, language_id);
CREATE INDEX idx_lesson_completions_user_lesson ON lesson_completions(user_id, lesson_id);
CREATE INDEX idx_user_progress_user_lesson ON user_progress(user_id, lesson_id);

-- ============================================
-- สิ้นสุดไฟล์ SQL
-- ============================================

