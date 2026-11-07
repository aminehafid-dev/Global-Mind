-- ============================================================
-- École Esprit Global (مدرسة العقل العالمي)
-- Unified Database Schema (MySQL & SQLite Compatible)
-- ============================================================

CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug VARCHAR(50) NOT NULL UNIQUE,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    icon VARCHAR(20) NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_slug VARCHAR(100) NOT NULL UNIQUE,
    subject_slug VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    video VARCHAR(255) DEFAULT '',
    images_json TEXT DEFAULT '[]',
    pdf_link VARCHAR(255) DEFAULT '',
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lesson_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_slug VARCHAR(100) NOT NULL,
    label VARCHAR(100) NOT NULL,
    emoji VARCHAR(20) NOT NULL,
    translation VARCHAR(100) DEFAULT '',
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_slug VARCHAR(100) NOT NULL,
    type VARCHAR(20) DEFAULT 'qcm',
    question TEXT NOT NULL,
    options_json TEXT NOT NULL,
    correct_index INT NOT NULL,
    explanation TEXT DEFAULT '',
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(50) DEFAULT '',
    status VARCHAR(20) DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name VARCHAR(100) DEFAULT 'Élève',
    subject_slug VARCHAR(50) NOT NULL,
    lesson_slug VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    stars INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
