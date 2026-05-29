<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン — Cafe Finder Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0B0E14;
            color: #E8ECF4;
            -webkit-font-smoothing: antialiased;
            position: relative;
            overflow: hidden;
        }

        /* Animated gradient background */
        body::before {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(ellipse at 30% 20%, rgba(42, 191, 191, 0.08) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, rgba(27, 79, 138, 0.06) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 50%, rgba(92, 74, 138, 0.04) 0%, transparent 70%);
            animation: bgFloat 20s ease-in-out infinite;
            z-index: 0;
        }

        @keyframes bgFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(2%, -1%) rotate(1deg); }
            66% { transform: translate(-1%, 2%) rotate(-1deg); }
        }

        /* Floating orbs */
        .orb {
            position: fixed;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.4;
            z-index: 0;
        }
        .orb-1 {
            width: 300px; height: 300px;
            background: rgba(42, 191, 191, 0.1);
            top: 10%; left: 15%;
            animation: orbFloat1 15s ease-in-out infinite;
        }
        .orb-2 {
            width: 200px; height: 200px;
            background: rgba(27, 79, 138, 0.12);
            bottom: 20%; right: 10%;
            animation: orbFloat2 18s ease-in-out infinite;
        }
        .orb-3 {
            width: 150px; height: 150px;
            background: rgba(92, 74, 138, 0.08);
            top: 60%; left: 60%;
            animation: orbFloat3 12s ease-in-out infinite;
        }

        @keyframes orbFloat1 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, -20px); }
        }
        @keyframes orbFloat2 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-20px, 25px); }
        }
        @keyframes orbFloat3 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(15px, 15px); }
        }

        .login-container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 420px;
            padding: 20px;
            animation: slideUp 0.6s ease;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .login-card {
            background: rgba(17, 21, 32, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 16px;
            padding: 44px 40px;
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            box-shadow: 0 8px 48px rgba(0, 0, 0, 0.4),
                        0 0 0 1px rgba(255, 255, 255, 0.03) inset;
        }

        .login-header {
            text-align: center;
            margin-bottom: 36px;
        }
        .login-logo {
            font-size: 36px;
            margin-bottom: 16px;
        }
        .login-header h1 {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 6px;
        }
        .login-header h1 span {
            color: #2ABFBF;
        }
        .login-header p {
            font-size: 13px;
            color: #8B93A7;
        }

        .form-group {
            margin-bottom: 20px;
        }
        .form-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #555D72;
            margin-bottom: 8px;
        }
        .form-input {
            width: 100%;
            padding: 12px 16px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: #E8ECF4;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 10px;
            outline: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .form-input:focus {
            border-color: rgba(42, 191, 191, 0.5);
            box-shadow: 0 0 0 3px rgba(42, 191, 191, 0.15);
            background: rgba(255, 255, 255, 0.07);
        }
        .form-input::placeholder {
            color: #555D72;
        }

        .remember-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 28px;
        }
        .remember-row input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: #2ABFBF;
            cursor: pointer;
        }
        .remember-row label {
            font-size: 12px;
            color: #8B93A7;
            cursor: pointer;
        }

        .login-btn {
            width: 100%;
            padding: 13px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #0B0E14;
            background: linear-gradient(135deg, #2ABFBF, #25AAAA);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            letter-spacing: 0.3px;
        }
        .login-btn:hover {
            background: linear-gradient(135deg, #35D1D1, #2ABFBF);
            box-shadow: 0 4px 24px rgba(42, 191, 191, 0.35);
            transform: translateY(-1px);
        }
        .login-btn:active {
            transform: translateY(0);
        }

        .error-msg {
            background: rgba(248, 113, 113, 0.1);
            border: 1px solid rgba(248, 113, 113, 0.2);
            color: #F87171;
            font-size: 12px;
            padding: 12px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            animation: shake 0.4s ease;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
        }

        .login-footer {
            text-align: center;
            margin-top: 24px;
        }
        .login-footer a {
            font-size: 12px;
            color: #555D72;
            text-decoration: none;
            transition: color 0.2s;
        }
        .login-footer a:hover {
            color: #2ABFBF;
        }
    </style>
</head>
<body>
    <!-- Floating orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <div class="login-logo">☕</div>
                <h1>Cafe <span>Finder</span></h1>
                <p>管理画面にログイン</p>
            </div>

            @if ($errors->any())
                <div class="error-msg">
                    @foreach ($errors->all() as $error)
                        {{ $error }}
                    @endforeach
                </div>
            @endif

            <form method="POST" action="/admin/login">
                @csrf
                <div class="form-group">
                    <label class="form-label" for="email">メールアドレス</label>
                    <input
                        class="form-input"
                        type="email"
                        id="email"
                        name="email"
                        value="{{ old('email') }}"
                        placeholder="admin@cafefinder.com"
                        required
                        autofocus
                    >
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">パスワード</label>
                    <input
                        class="form-input"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    >
                </div>

                <div class="remember-row">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">ログイン状態を保持する</label>
                </div>

                <button type="submit" class="login-btn">ログイン</button>
            </form>

            <div class="login-footer">
                <a href="/">← サイトに戻る</a>
            </div>
        </div>
    </div>
</body>
</html>
