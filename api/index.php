<?php

/**
 * Vercel Serverless PHP entry point.
 * This forwards serverless requests directly to Laravel's main entry point,
 * dynamically adjusting storage paths to be writable on Vercel's serverless environment.
 */

// Vercel only allows writing to the temporary directory /tmp
$storagePath = '/tmp/storage';

// Ensure the storage subdirectories exist inside /tmp/storage
$storageDirs = [
    $storagePath . '/bootstrap/cache',
    $storagePath . '/framework/sessions',
    $storagePath . '/framework/views',
    $storagePath . '/framework/cache',
    $storagePath . '/logs',
];

foreach ($storageDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Set temporary configuration environment variables for Vercel
putenv("VIEW_COMPILED_PATH={$storagePath}/framework/views");
putenv("SESSION_DRIVER=cookie"); // Use client cookie session as Vercel has no persistent storage
putenv("LOG_CHANNEL=stderr"); // Stream logs to Vercel dashboard console
putenv("CACHE_STORE=array");

// Get the Laravel application instance and override storage path
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->useStoragePath($storagePath);

// Handle the request
$app->handleRequest(Illuminate\Http\Request::capture());

