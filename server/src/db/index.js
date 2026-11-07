import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbType = process.env.DB_TYPE || 'sqlite';
const sqliteFilePath = process.env.SQLITE_FILE || path.resolve(__dirname, '../../../database/ecole.sqlite');

let sqliteDb = null;
let mysqlPool = null;

/**
 * Initialize SQLite database using native Node 22+ node:sqlite
 */
async function initSqlite() {
  const dir = path.dirname(sqliteFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const { DatabaseSync } = await import('node:sqlite');
  sqliteDb = new DatabaseSync(sqliteFilePath);

  // Enable WAL mode & foreign keys
  sqliteDb.exec('PRAGMA journal_mode = WAL;');
  sqliteDb.exec('PRAGMA foreign_keys = ON;');

  // Run schema
  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    sqliteDb.exec(schemaSql);
  }

  // Check if seeded
  const checkStmt = sqliteDb.prepare('SELECT COUNT(*) as count FROM subjects');
  const result = checkStmt.get();
  if (!result || result.count === 0) {
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      sqliteDb.exec(seedSql);
      console.log('[Database] SQLite seeded with subjects, lessons, words, and quizzes.');
    }
  }

  console.log(`[Database] SQLite connected at: ${sqliteFilePath}`);
}

/**
 * Initialize MySQL database if configured
 */
async function initMysql() {
  const mysql = await import('mysql2/promise');
  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecole_esprit_global',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const schemaPath = path.resolve(__dirname, '../../../database/schema.mysql.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const statements = schemaSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      await mysqlPool.query(stmt);
    }
  }

  const [rows] = await mysqlPool.query('SELECT COUNT(*) as count FROM subjects');
  if (!rows[0] || rows[0].count === 0) {
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      const seedStatements = seedSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
      for (const stmt of seedStatements) {
        await mysqlPool.query(stmt);
      }
      console.log('[Database] MySQL seeded successfully.');
    }
  }

  console.log('[Database] MySQL connected successfully.');
}

/**
 * Initialize DB on startup
 */
export async function initDb() {
  try {
    if (dbType === 'mysql') {
      await initMysql();
    } else {
      await initSqlite();
    }
  } catch (err) {
    console.error(`[Database] Failed to initialize ${dbType} database:`, err.message);
    if (dbType === 'mysql') {
      console.log('[Database] Falling back to SQLite...');
      await initSqlite();
    } else {
      throw err;
    }
  }
}

/**
 * Get all subjects
 */
export async function getSubjects() {
  if (mysqlPool) {
    const [rows] = await mysqlPool.query('SELECT * FROM subjects ORDER BY display_order ASC');
    return rows;
  }
  return sqliteDb.prepare('SELECT * FROM subjects ORDER BY display_order ASC').all();
}

/**
 * Get full hierarchical lessons structure matching lessons.json
 */
export async function getAllLessonsHierarchy() {
  const subjects = await getSubjects();
  const result = {};

  for (const subject of subjects) {
    let lessonsList = [];
    if (mysqlPool) {
      const [lRows] = await mysqlPool.query('SELECT * FROM lessons WHERE subject_slug = ? ORDER BY display_order ASC', [subject.slug]);
      lessonsList = lRows;
    } else {
      lessonsList = sqliteDb.prepare('SELECT * FROM lessons WHERE subject_slug = ? ORDER BY display_order ASC').all(subject.slug);
    }

    const formattedLessons = [];
    for (const l of lessonsList) {
      let images = [];
      try {
        images = JSON.parse(l.images_json || '[]');
      } catch {
        images = [];
      }

      // Words
      let words = [];
      if (mysqlPool) {
        const [wRows] = await mysqlPool.query('SELECT label, emoji, translation FROM lesson_words WHERE lesson_slug = ? ORDER BY display_order ASC', [l.lesson_slug]);
        words = wRows;
      } else {
        words = sqliteDb.prepare('SELECT label, emoji, translation FROM lesson_words WHERE lesson_slug = ? ORDER BY display_order ASC').all(l.lesson_slug);
      }

      // Quizzes
      let questions = [];
      let qList = [];
      if (mysqlPool) {
        const [qRows] = await mysqlPool.query('SELECT type, question, options_json, correct_index, explanation FROM quizzes WHERE lesson_slug = ? ORDER BY display_order ASC', [l.lesson_slug]);
        qList = qRows;
      } else {
        qList = sqliteDb.prepare('SELECT type, question, options_json, correct_index, explanation FROM quizzes WHERE lesson_slug = ? ORDER BY display_order ASC').all(l.lesson_slug);
      }

      for (const q of qList) {
        let opts = [];
        try {
          opts = JSON.parse(q.options_json || '[]');
        } catch {
          opts = [];
        }
        questions.push({
          type: q.type || 'qcm',
          question: q.question,
          options: opts,
          correct: q.correct_index,
          explanation: q.explanation || ''
        });
      }

      const lessonObj = {
        id: l.lesson_slug,
        title: l.title,
        description: l.description,
        video: l.video || '',
        images: images,
        content: l.content || '',
        pdfLink: l.pdf_link || '',
        questions: questions
      };

      if (words.length > 0) {
        lessonObj.words = words;
      }

      formattedLessons.push(lessonObj);
    }

    result[subject.slug] = {
      title: subject.name_ar,
      titleEn: subject.name_en,
      icon: subject.icon,
      lessons: formattedLessons
    };
  }

  return result;
}

/**
 * Save Contact Message
 */
export async function saveContactMessage({ name, email, message, ip = '' }) {
  if (mysqlPool) {
    const [result] = await mysqlPool.query(
      'INSERT INTO contacts (name, email, message, ip_address, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, message, ip, 'new']
    );
    return { id: result.insertId, name, email, message };
  }

  const stmt = sqliteDb.prepare(
    'INSERT INTO contacts (name, email, message, ip_address, status) VALUES (?, ?, ?, ?, ?)'
  );
  const info = stmt.run(name, email, message, ip, 'new');
  return { id: info.lastInsertRowid, name, email, message };
}

/**
 * Save Student Quiz Score
 */
export async function saveStudentScore({ studentName = 'Élève', subjectSlug, lessonSlug, score, total, stars }) {
  if (mysqlPool) {
    const [result] = await mysqlPool.query(
      'INSERT INTO scores (student_name, subject_slug, lesson_slug, score, total, stars) VALUES (?, ?, ?, ?, ?, ?)',
      [studentName, subjectSlug, lessonSlug, score, total, stars]
    );
    return { id: result.insertId, studentName, subjectSlug, lessonSlug, score, total, stars };
  }

  const stmt = sqliteDb.prepare(
    'INSERT INTO scores (student_name, subject_slug, lesson_slug, score, total, stars) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const info = stmt.run(studentName, subjectSlug, lessonSlug, score, total, stars);
  return { id: info.lastInsertRowid, studentName, subjectSlug, lessonSlug, score, total, stars };
}

/**
 * Get Recent Scores & Leaderboard
 */
export async function getScores(limit = 10, subjectSlug = null) {
  let query = 'SELECT * FROM scores';
  const params = [];

  if (subjectSlug) {
    query += ' WHERE subject_slug = ?';
    params.push(subjectSlug);
  }
  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  if (mysqlPool) {
    const [rows] = await mysqlPool.query(query, params);
    return rows;
  }
  return sqliteDb.prepare(query).all(...params);
}

/**
 * Get Platform Stats
 */
export async function getStats() {
  if (mysqlPool) {
    const [[sCount]] = await mysqlPool.query('SELECT COUNT(*) as count FROM subjects');
    const [[lCount]] = await mysqlPool.query('SELECT COUNT(*) as count FROM lessons');
    const [[qCount]] = await mysqlPool.query('SELECT COUNT(*) as count FROM quizzes');
    const [[scCount]] = await mysqlPool.query('SELECT COUNT(*) as count, COALESCE(SUM(stars), 0) as total_stars FROM scores');
    const [[mCount]] = await mysqlPool.query('SELECT COUNT(*) as count FROM contacts');
    return {
      subjectsCount: sCount.count,
      lessonsCount: lCount.count,
      quizzesCount: qCount.count,
      completedQuizzes: scCount.count,
      totalStarsAwarded: scCount.total_stars,
      messagesCount: mCount.count
    };
  }

  const sCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM subjects').get().count;
  const lCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM lessons').get().count;
  const qCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM quizzes').get().count;
  const scStats = sqliteDb.prepare('SELECT COUNT(*) as count, COALESCE(SUM(stars), 0) as total_stars FROM scores').get();
  const mCount = sqliteDb.prepare('SELECT COUNT(*) as count FROM contacts').get().count;

  return {
    subjectsCount: sCount,
    lessonsCount: lCount,
    quizzesCount: qCount,
    completedQuizzes: scStats.count,
    totalStarsAwarded: scStats.total_stars,
    messagesCount: mCount
  };
}
