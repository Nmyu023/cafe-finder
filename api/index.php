<?php

/**
 * Here is the serverless function entry
 * for deployment with Vercel.
 */
// Copy SQLite database to /tmp to ensure it is writable
$sqliteDb = '/tmp/database.sqlite';
if (!file_exists($sqliteDb)) {
    copy(__DIR__ . '/database.sqlite', $sqliteDb);
}
putenv("DB_CONNECTION=sqlite");
putenv("DB_DATABASE={$sqliteDb}");
putenv("APP_KEY=base64:qWYGUAk5tcIeOfQIkpMUglLXmpN/qE6q8AMZ/M5N8Rk=");

require __DIR__.'/../public/index.php';
