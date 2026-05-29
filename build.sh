#!/usr/bin/env bash

# Exit on error
set -o errexit

echo "Installing PHP dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "Installing Node.js dependencies..."
npm install

echo "Building frontend assets..."
npm run build

echo "Clearing application cache..."
php artisan optimize:clear

echo "Running database migrations..."
# Render deployment runs in non-interactive mode. Force flag is required for production.
php artisan migrate --force

echo "Build successful!"
