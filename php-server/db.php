<?php
/**
 * École Esprit Global - Database Connection & Operations (PDO)
 */

function getDatabaseConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $config = require __DIR__ . '/config.php';
    $dbType = $config['db_type'];

    try {
        if ($dbType === 'mysql') {
            $m = $config['mysql'];
            $dsn = "mysql:host={$m['host']};port={$m['port']};dbname={$m['database']};charset={$m['charset']}";
            $pdo = new PDO($dsn, $m['username'], $m['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } else {
            $sqlitePath = $config['sqlite_path'];
            $dir = dirname($sqlitePath);
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }
            $pdo = new PDO("sqlite:" . $sqlitePath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $pdo->exec('PRAGMA journal_mode = WAL;');
            $pdo->exec('PRAGMA foreign_keys = ON;');
        }

        // Auto-initialize tables if not yet created
        initDatabaseIfNeeded($pdo, $dbType);

        return $pdo;
    } catch (Exception $e) {
        // Fallback to SQLite if MySQL fails
        if ($dbType === 'mysql') {
            $sqlitePath = $config['sqlite_path'];
            $pdo = new PDO("sqlite:" . $sqlitePath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            initDatabaseIfNeeded($pdo, 'sqlite');
            return $pdo;
        }
        throw $e;
    }
}

function initDatabaseIfNeeded(PDO $pdo, $type) {
    try {
        $check = $pdo->query("SELECT count(*) as count FROM subjects")->fetch();
        if ($check && (int)$check['count'] > 0) {
            return; // Already initialized & seeded
        }
    } catch (Exception $e) {
        // Table doesn't exist yet, run schema
    }

    $root = dirname(__DIR__);
    $schemaFile = $type === 'mysql' 
        ? $root . '/database/schema.mysql.sql' 
        : $root . '/database/schema.sql';

    if (file_exists($schemaFile)) {
        $schemaSql = file_get_contents($schemaFile);
        $pdo->exec($schemaSql);
    }

    $seedFile = $root . '/database/seed.sql';
    if (file_exists($seedFile)) {
        $seedSql = file_get_contents($seedFile);
        $pdo->exec($seedSql);
    }
}

function fetchAllLessonsHierarchy() {
    $pdo = getDatabaseConnection();

    $subjectsStmt = $pdo->query("SELECT * FROM subjects ORDER BY display_order ASC");
    $subjects = $subjectsStmt->fetchAll();

    $lessonsStmt = $pdo->prepare("SELECT * FROM lessons WHERE subject_slug = :sub ORDER BY display_order ASC");
    $wordsStmt = $pdo->prepare("SELECT label, emoji, translation FROM lesson_words WHERE lesson_slug = :les ORDER BY display_order ASC");
    $quizzesStmt = $pdo->prepare("SELECT type, question, options_json, correct_index, explanation FROM quizzes WHERE lesson_slug = :les ORDER BY display_order ASC");

    $result = [];

    foreach ($subjects as $s) {
        $lessonsStmt->execute([':sub' => $s['slug']]);
        $lessonsList = $lessonsStmt->fetchAll();

        $formattedLessons = [];
        foreach ($lessonsList as $l) {
            $images = json_decode($l['images_json'] ?: '[]', true) ?: [];

            // Words
            $wordsStmt->execute([':les' => $l['lesson_slug']]);
            $words = $wordsStmt->fetchAll();

            // Quizzes
            $quizzesStmt->execute([':les' => $l['lesson_slug']]);
            $qList = $quizzesStmt->fetchAll();

            $questions = [];
            foreach ($qList as $q) {
                $options = json_decode($q['options_json'] ?: '[]', true) ?: [];
                $questions[] = [
                    'type' => $q['type'] ?: 'qcm',
                    'question' => $q['question'],
                    'options' => $options,
                    'correct' => (int)$q['correct_index'],
                    'explanation' => $q['explanation'] ?: ''
                ];
            }

            $lessonItem = [
                'id' => $l['lesson_slug'],
                'title' => $l['title'],
                'description' => $l['description'],
                'video' => $l['video'] ?: '',
                'images' => $images,
                'content' => $l['content'] ?: '',
                'pdfLink' => $l['pdf_link'] ?: '',
                'questions' => $questions
            ];

            if (!empty($words)) {
                $lessonItem['words'] = $words;
            }

            $formattedLessons[] = $lessonItem;
        }

        $result[$s['slug']] = [
            'title' => $s['name_ar'],
            'titleEn' => $s['name_en'],
            'icon' => $s['icon'],
            'lessons' => $formattedLessons
        ];
    }

    return $result;
}

function insertContact($name, $email, $message, $ip = '') {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare("INSERT INTO contacts (name, email, message, ip_address, status) VALUES (:name, :email, :message, :ip, 'new')");
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':message' => $message,
        ':ip' => $ip
    ]);
    return $pdo->lastInsertId();
}

function insertScore($studentName, $subjectSlug, $lessonSlug, $score, $total, $stars) {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare("INSERT INTO scores (student_name, subject_slug, lesson_slug, score, total, stars) VALUES (:name, :sub, :les, :sc, :tot, :stars)");
    $stmt->execute([
        ':name' => $studentName ?: 'Élève',
        ':sub' => $subjectSlug,
        ':les' => $lessonSlug,
        ':sc' => (int)$score,
        ':tot' => (int)$total,
        ':stars' => (int)$stars
    ]);
    return $pdo->lastInsertId();
}

function fetchScores($limit = 10, $subjectSlug = null) {
    $pdo = getDatabaseConnection();
    if ($subjectSlug) {
        $stmt = $pdo->prepare("SELECT * FROM scores WHERE subject_slug = :sub ORDER BY created_at DESC LIMIT :lim");
        $stmt->bindValue(':sub', $subjectSlug);
        $stmt->bindValue(':lim', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
    } else {
        $stmt = $pdo->prepare("SELECT * FROM scores ORDER BY created_at DESC LIMIT :lim");
        $stmt->bindValue(':lim', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
    }
    return $stmt->fetchAll();
}

function fetchStats() {
    $pdo = getDatabaseConnection();
    $subjectsCount = (int)$pdo->query("SELECT count(*) FROM subjects")->fetchColumn();
    $lessonsCount = (int)$pdo->query("SELECT count(*) FROM lessons")->fetchColumn();
    $quizzesCount = (int)$pdo->query("SELECT count(*) FROM quizzes")->fetchColumn();
    
    $scoreRow = $pdo->query("SELECT count(*) as count, COALESCE(SUM(stars), 0) as total_stars FROM scores")->fetch();
    $contactsCount = (int)$pdo->query("SELECT count(*) FROM contacts")->fetchColumn();

    return [
        'subjectsCount' => $subjectsCount,
        'lessonsCount' => $lessonsCount,
        'quizzesCount' => $quizzesCount,
        'completedQuizzes' => (int)$scoreRow['count'],
        'totalStarsAwarded' => (int)$scoreRow['total_stars'],
        'messagesCount' => $contactsCount
    ];
}
