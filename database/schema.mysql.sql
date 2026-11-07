-- ============================================================
-- École Esprit Global (مدرسة العقل العالمي)
-- MySQL Specific Database Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    icon VARCHAR(20) NOT NULL,
    display_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_slug VARCHAR(100) NOT NULL UNIQUE,
    subject_slug VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content LONGTEXT,
    video VARCHAR(255) DEFAULT '',
    images_json TEXT,
    pdf_link VARCHAR(255) DEFAULT '',
    display_order INT DEFAULT 0,
    INDEX idx_subject (subject_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lesson_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_slug VARCHAR(100) NOT NULL,
    label VARCHAR(100) NOT NULL,
    emoji VARCHAR(20) NOT NULL,
    translation VARCHAR(100) DEFAULT '',
    display_order INT DEFAULT 0,
    INDEX idx_lesson (lesson_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_slug VARCHAR(100) NOT NULL,
    type VARCHAR(20) DEFAULT 'qcm',
    question TEXT NOT NULL,
    options_json TEXT NOT NULL,
    correct_index INT NOT NULL,
    explanation TEXT,
    display_order INT DEFAULT 0,
    INDEX idx_lesson_quiz (lesson_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(50) DEFAULT '',
    status VARCHAR(20) DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) DEFAULT 'Élève',
    subject_slug VARCHAR(50) NOT NULL,
    lesson_slug VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    stars INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_subject_score (subject_slug),
    INDEX idx_lesson_score (lesson_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
