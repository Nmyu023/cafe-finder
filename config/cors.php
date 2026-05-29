<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure CORS settings for your application. This
    | configuration is used by the CORS middleware to handle preflight requests
    | and determine what headers are allowed for actual requests.
    |
    */

    'paths' => ['api/*', 'admin/*', 'storage/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('APP_URL'),
        // 本番環境ではAPP_URLのみに限定
        // ローカル開発時はコメント解除
        // 'http://localhost:3000',
        // 'http://localhost:8000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
