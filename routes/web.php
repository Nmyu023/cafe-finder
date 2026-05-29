<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CafeController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminCafeController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\AdminCrowdReportController;

Route::get('/', function () {
    return view('cafe-finder');
});

// Auth API routes - Rate Limited (5 attempts per minute for register/login)
Route::middleware(['cors', 'throttle:60,1'])->group(function () {
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/api/register', [AuthController::class, 'register']);
        Route::post('/api/login', [AuthController::class, 'login']);
    });
    Route::post('/api/logout', [AuthController::class, 'logout']);
    Route::get('/api/user', [AuthController::class, 'user']);

    // Review API routes
    Route::middleware('throttle:100,1')->group(function () {
        Route::get('/api/reviews/{cafeId}', [ReviewController::class, 'index']);
        Route::post('/api/reviews', [ReviewController::class, 'store']);
        Route::get('/api/review-counts', [ReviewController::class, 'counts']);
        Route::middleware('auth')->group(function () {
            Route::put('/api/reviews/{review}', [ReviewController::class, 'update']);
            Route::delete('/api/reviews/{review}', [ReviewController::class, 'destroy']);
        });
    });

    // Cafe API routes
    Route::middleware('throttle:120,1')->group(function () {
        Route::get('/api/cafes', [CafeController::class, 'apiIndex']);
        Route::middleware('auth')->group(function () {
            Route::post('/api/cafes', [CafeController::class, 'apiStore']);
            Route::post('/api/cafes/{cafe}/crowd-status', [CafeController::class, 'reportCrowdStatus']);
        });
    });
});

// Admin Auth (public)
Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->name('login');
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

// Admin Panel (auth + admin protected)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::post('cafes/update-order', [AdminCafeController::class, 'updateOrder'])->name('cafes.update-order');
    Route::get('cafes/{cafe}/stats', [AdminCafeController::class, 'stats'])->name('cafes.stats');
    Route::resource('cafes', AdminCafeController::class)->except(['show']);
    Route::resource('reviews', AdminReviewController::class)->only(['index', 'edit', 'update', 'destroy'])->withTrashed();
    Route::post('reviews/{review}', [AdminReviewController::class, 'restore'])->name('reviews.restore');
    Route::resource('crowd-reports', AdminCrowdReportController::class)->only(['index', 'destroy']);
});

