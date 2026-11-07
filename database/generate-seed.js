import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lessonsPath = path.resolve(__dirname, '../data/lessons.json');
const outputPath = path.resolve(__dirname, 'seed.sql');

const rawData = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));

let sql = `-- ============================================================
-- École Esprit Global (مدرسة العقل العالمي)
-- Complete Seed Data
-- ============================================================

-- Clean existing data
DELETE FROM quizzes;
DELETE FROM lesson_words;
DELETE FROM lessons;
DELETE FROM subjects;

-- 1. Insert Subjects
INSERT INTO subjects (slug, name_ar, name_en, icon, display_order) VALUES
('arabic', 'اللغة العربية', 'Arabic', '📚', 1),
('math', 'الرياضيات', 'Mathematics', '🔢', 2),
('french', 'اللغة الفرنسية', 'French', '🇫🇷', 3),
('science', 'النشاط العلمي', 'Science', '🔬', 4);

`;

function escapeSql(str) {
  if (str === null || str === undefined) return "''";
  return "'" + String(str).replace(/'/g, "''") + "'";
}

for (const [subjectSlug, subjectData] of Object.entries(rawData)) {
  const lessons = subjectData.lessons || [];
  let lessonOrder = 1;

  for (const lesson of lessons) {
    const imagesJson = JSON.stringify(lesson.images || []);
    sql += `\n-- Lesson: ${subjectSlug} / ${lesson.id}\n`;
    sql += `INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (\n`;
    sql += `  ${escapeSql(lesson.id)},\n`;
    sql += `  ${escapeSql(subjectSlug)},\n`;
    sql += `  ${escapeSql(lesson.title)},\n`;
    sql += `  ${escapeSql(lesson.description || '')},\n`;
    sql += `  ${escapeSql(lesson.content || '')},\n`;
    sql += `  ${escapeSql(lesson.video || '')},\n`;
    sql += `  ${escapeSql(imagesJson)},\n`;
    sql += `  ${escapeSql(lesson.pdfLink || '')},\n`;
    sql += `  ${lessonOrder++}\n`;
    sql += `);\n`;

    // Words
    if (lesson.words && lesson.words.length > 0) {
      let wordOrder = 1;
      for (const w of lesson.words) {
        sql += `INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (\n`;
        sql += `  ${escapeSql(lesson.id)},\n`;
        sql += `  ${escapeSql(w.label)},\n`;
        sql += `  ${escapeSql(w.emoji)},\n`;
        sql += `  ${escapeSql(w.translation || '')},\n`;
        sql += `  ${wordOrder++}\n`;
        sql += `);\n`;
      }
    }

    // Quizzes
    if (lesson.questions && lesson.questions.length > 0) {
      let qOrder = 1;
      for (const q of lesson.questions) {
        const optionsJson = JSON.stringify(q.options || []);
        sql += `INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (\n`;
        sql += `  ${escapeSql(lesson.id)},\n`;
        sql += `  ${escapeSql(q.type || 'qcm')},\n`;
        sql += `  ${escapeSql(q.question)},\n`;
        sql += `  ${escapeSql(optionsJson)},\n`;
        sql += `  ${q.correct},\n`;
        sql += `  ${escapeSql(q.explanation || '')},\n`;
        sql += `  ${qOrder++}\n`;
        sql += `);\n`;
      }
    }
  }
}

// Sample score and contact
sql += `\n-- Sample Contact & Scores\n`;
sql += `INSERT INTO contacts (name, email, message, ip_address, status) VALUES ('Parent Test', 'parent@example.com', 'Bravo pour cette magnifique plateforme éducative !', '127.0.0.1', 'replied');\n`;
sql += `INSERT INTO scores (student_name, subject_slug, lesson_slug, score, total, stars) VALUES ('Adam', 'french', 'fr-1', 4, 4, 3);\n`;
sql += `INSERT INTO scores (student_name, subject_slug, lesson_slug, score, total, stars) VALUES ('Sara', 'arabic', 'AR_N1_P1_SEM5_S1', 4, 4, 3);\n`;
sql += `INSERT INTO scores (student_name, subject_slug, lesson_slug, score, total, stars) VALUES ('Youssef', 'math', 'ma-1', 1, 1, 3);\n`;

fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`[Seed Generator] Generated ${outputPath}`);
