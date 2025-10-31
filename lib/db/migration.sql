-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    total_xp INTEGER NOT NULL DEFAULT 0,
    lessons_completed INTEGER NOT NULL DEFAULT 0,
    joined_date TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    total_points INTEGER NOT NULL DEFAULT 0,
    streak INTEGER DEFAULT 0,
    perfect_lesson_streak INTEGER DEFAULT 0,
    recommended_starting_lesson INTEGER,
    speaking_practice TEXT,
    games TEXT,
    assessment TEXT,
    practice_stats TEXT,
    study_times TEXT,
    completed_lessons TEXT,
    timed_writing TEXT
);

-- User stats table
CREATE TABLE user_stats (
    id INTEGER PRIMARY KEY,
    total_xp INTEGER NOT NULL DEFAULT 0,
    lessons_completed INTEGER NOT NULL DEFAULT 0,
    joined_date TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    total_points INTEGER NOT NULL DEFAULT 0
);

-- Languages table
CREATE TABLE languages (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- Lessons table
CREATE TABLE lessons (
    id INTEGER PRIMARY KEY,
    language_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    lesson_order INTEGER NOT NULL,
    difficulty INTEGER NOT NULL DEFAULT 1,
    description TEXT NOT NULL
);

-- Questions table
CREATE TABLE questions (
    id INTEGER PRIMARY KEY,
    lesson_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    prompt TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    audio_url TEXT,
    image_url TEXT
);

-- User progress table
CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    completed INTEGER NOT NULL,
    correct INTEGER NOT NULL,
    timestamp TEXT NOT NULL
);

-- Achievements table
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    requirement TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    points_reward INTEGER DEFAULT 0,
    category TEXT,
    rarity TEXT
);

-- User achievements table
CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    unlocked INTEGER NOT NULL DEFAULT 0,
    unlocked_at TEXT,
    claimed INTEGER NOT NULL DEFAULT 0
);

-- Vocabulary table
CREATE TABLE vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    language_id INTEGER NOT NULL,
    language_code TEXT NOT NULL,
    difficulty REAL NOT NULL,
    last_reviewed TEXT NOT NULL,
    next_review TEXT NOT NULL,
    correct_count INTEGER NOT NULL DEFAULT 0,
    incorrect_count INTEGER NOT NULL DEFAULT 0
);

-- Challenges table
CREATE TABLE challenges (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    xp_reward INTEGER NOT NULL,
    requirement_count INTEGER NOT NULL,
    expires_at TEXT NOT NULL
);

-- User challenges table
CREATE TABLE user_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT
);

-- Lesson completions table
CREATE TABLE lesson_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL
);

-- Missions table
CREATE TABLE missions (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    requirements TEXT NOT NULL,
    xp_reward INTEGER NOT NULL,
    points_reward INTEGER NOT NULL,
    badge_id INTEGER,
    expires_at TEXT,
    mission_order INTEGER NOT NULL,
    category TEXT NOT NULL
);

-- User missions table
CREATE TABLE user_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mission_id INTEGER NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    requirement_count INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT,
    claimed INTEGER NOT NULL DEFAULT 0
);

-- Badges table
CREATE TABLE badges (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity TEXT NOT NULL
);

-- User badges table
CREATE TABLE user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TEXT NOT NULL,
    displayed INTEGER NOT NULL DEFAULT 1
);