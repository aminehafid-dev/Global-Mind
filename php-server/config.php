<?php
/**
 * École Esprit Global - PHP Backend Configuration
 */

// Load .env if present (simple custom parser)
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (strpos($line, '#') === 0 || empty($line)) continue;
        if (strpos($line, '=') !== false) {
            list($key, $val) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($val);
            putenv(trim($key) . '=' . trim($val));
        }
    }
}

return [
    'db_type' => getenv('DB_TYPE') ?: 'sqlite', // 'sqlite' or 'mysql'
    'sqlite_path' => getenv('SQLITE_FILE') ?: dirname(__DIR__) . '/database/ecole.sqlite',
    'mysql' => [
        'host' => getenv('DB_HOST') ?: '127.0.0.1',
        'port' => getenv('DB_PORT') ?: 3306,
        'database' => getenv('DB_NAME') ?: 'ecole_esprit_global',
        'username' => getenv('DB_USER') ?: 'root',
        'password' => getenv('DB_PASSWORD') ?: '',
        'charset' => 'utf8mb4'
    ],
    'cors' => [
        'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000', '*']
    ],
    'env' => getenv('APP_ENV') ?: 'production'
];
