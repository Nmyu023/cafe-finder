<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // CORS ミドルウェアを登録
        $middleware->alias([
            'cors' => \Illuminate\Http\Middleware\HandleCors::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // 本番環境では詳細なエラーメッセージを隠す
        $exceptions->shouldRenderJsonWhen(function ($request) {
            return $request->expectsJson();
        });

        // 例外のカスタムレスポンス
        $exceptions->render(function (Throwable $e, $request) {
            if (app()->isProduction()) {
                // 本番環境：通常のエラーメッセージは表示しない
                if ($e instanceof \Illuminate\Database\QueryException) {
                    return response()->json([
                        'message' => 'Database error occurred',
                        'code' => 500,
                    ], 500);
                }

                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors' => $e->errors(),
                        'code' => 422,
                    ], 422);
                }
            }
        });
    })->create();
