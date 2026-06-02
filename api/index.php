<?php

/**
 * Here is the serverless function entry
 * for deployment with Vercel.
 */
// Copy SQLite database to /tmp to ensure it is writable
$originalDb = __DIR__ . '/database.sqlite';
$sqliteDb = '/tmp/database.sqlite';
if (!file_exists($sqliteDb) || filesize($sqliteDb) < filesize($originalDb)) {
    copy($originalDb, $sqliteDb);
}
putenv("DB_CONNECTION=sqlite");
putenv("DB_DATABASE={$sqliteDb}");
putenv("APP_KEY=base64:qWYGUAk5tcIeOfQIkpMUglLXmpN/qE6q8AMZ/M5N8Rk=");
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
putenv("APP_URL=https://{$host}");
putenv("ASSET_URL=https://{$host}");

// Prevent Laravel from stripping /api/ from the URL by pretending the script is at the root
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/../public/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

require __DIR__.'/../public/index.php';
