<?php
/**
 * École Esprit Global - PHP API Router
 */

// Enable error logging, suppress direct HTML errors in production
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Set CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once dirname(__DIR__) . '/db.php';

// Parse URI path
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$uriPath = parse_url($requestUri, PHP_URL_PATH);

// Normalize path: strip script name or base directory if nested
$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
$baseDir = dirname($scriptName);
if ($baseDir !== '/' && strpos($uriPath, $baseDir) === 0) {
    $uriPath = substr($uriPath, strlen($baseDir));
}
$uriPath = rtrim($uriPath, '/');
if (empty($uriPath)) {
    $uriPath = '/';
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    // 1. Health check
    if ($uriPath === '/api/health' || $uriPath === '/health') {
        echo json_encode([
            'status' => 'ok',
            'engine' => 'PHP ' . PHP_VERSION,
            'time' => date('c'),
            'service' => 'École Esprit Global PHP API'
        ]);
        exit;
    }

    // 2. Lessons
    if ($uriPath === '/api/lessons' || $uriPath === '/lessons') {
        if ($method === 'GET') {
            $data = fetchAllLessonsHierarchy();
            // Cache control for 5 mins
            header('Cache-Control: public, max-age=300');
            echo json_encode($data, JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // 3. Contact Form Submission
    if ($uriPath === '/api/contact' || $uriPath === '/contact') {
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON body']);
                exit;
            }

            // Anti-spam Honeypot protection
            if (!empty($input['_gotcha'])) {
                // Silently succeed
                echo json_encode(['success' => true, 'message' => 'Thank you for reaching out! We will reply soon.']);
                exit;
            }

            $name = trim($input['name'] ?? '');
            $email = trim($input['email'] ?? '');
            $message = trim($input['message'] ?? '');

            if (empty($name) || strlen($name) < 2) {
                http_response_code(400);
                echo json_encode(['error' => 'Name must be at least 2 characters']);
                exit;
            }

            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['error' => 'Please provide a valid email address']);
                exit;
            }

            if (empty($message) || strlen($message) < 5) {
                http_response_code(400);
                echo json_encode(['error' => 'Message must be at least 5 characters']);
                exit;
            }

            $ip = $_SERVER['REMOTE_ADDR'] ?? '';
            $insertId = insertContact($name, $email, $message, $ip);

            echo json_encode([
                'success' => true,
                'message' => 'Thank you for reaching out! We will reply soon.',
                'id' => $insertId
            ]);
            exit;
        }
    }

    // 4. Scores / Quiz Results
    if ($uriPath === '/api/scores' || $uriPath === '/scores') {
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON body']);
                exit;
            }

            $studentName = trim($input['studentName'] ?? 'Élève');
            $subjectSlug = trim($input['subjectSlug'] ?? '');
            $lessonSlug = trim($input['lessonSlug'] ?? '');
            $score = (int)($input['score'] ?? 0);
            $total = (int)($input['total'] ?? 1);
            $stars = (int)($input['stars'] ?? 0);

            if (empty($subjectSlug) || empty($lessonSlug)) {
                http_response_code(400);
                echo json_encode(['error' => 'subjectSlug and lessonSlug are required']);
                exit;
            }

            $id = insertScore($studentName, $subjectSlug, $lessonSlug, $score, $total, $stars);

            echo json_encode([
                'success' => true,
                'id' => $id,
                'stars' => $stars,
                'message' => 'Score recorded successfully!'
            ]);
            exit;
        }

        if ($method === 'GET') {
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $subject = isset($_GET['subject']) ? trim($_GET['subject']) : null;
            $scores = fetchScores($limit, $subject);
            echo json_encode($scores, JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // 5. Platform Stats
    if ($uriPath === '/api/stats' || $uriPath === '/stats') {
        if ($method === 'GET') {
            $stats = fetchStats();
            echo json_encode($stats);
            exit;
        }
    }

    // Default 404
    http_response_code(404);
    echo json_encode(['error' => 'NotFound', 'message' => 'Endpoint does not exist', 'path' => $uriPath]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'InternalServerError', 'message' => $e->getMessage()]);
}
