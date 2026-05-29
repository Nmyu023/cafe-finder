<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') — Cafe Finder</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        /* ═══════════════════════════════════════════
           Design Tokens
        ═══════════════════════════════════════════ */
        :root {
            --bg-primary: #0B0E14;
            --bg-secondary: #111520;
            --bg-card: rgba(17, 21, 32, 0.7);
            --bg-card-hover: rgba(24, 30, 46, 0.8);
            --bg-glass: rgba(255, 255, 255, 0.03);
            --bg-input: rgba(255, 255, 255, 0.05);
            --border-subtle: rgba(255, 255, 255, 0.06);
            --border-focus: rgba(42, 191, 191, 0.5);
            --text-primary: #E8ECF4;
            --text-secondary: #8B93A7;
            --text-muted: #555D72;
            --accent: #2ABFBF;
            --accent-glow: rgba(42, 191, 191, 0.15);
            --accent-hover: #25AAAA;
            --success: #34D399;
            --success-bg: rgba(52, 211, 153, 0.1);
            --warning: #FBBF24;
            --warning-bg: rgba(251, 191, 36, 0.1);
            --danger: #F87171;
            --danger-bg: rgba(248, 113, 113, 0.1);
            --info: #60A5FA;
            --info-bg: rgba(96, 165, 250, 0.1);
            --sidebar-w: 260px;
            --radius: 12px;
            --radius-sm: 8px;
            --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.3);
            --shadow-glow: 0 0 20px rgba(42, 191, 191, 0.1);
            --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ═══════════════════════════════════════════
           Reset & Base
        ═══════════════════════════════════════════ */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }
        a { color: var(--accent); text-decoration: none; transition: color var(--transition); }
        a:hover { color: var(--accent-hover); }

        /* ═══════════════════════════════════════════
           Layout
        ═══════════════════════════════════════════ */
        .admin-wrapper {
            display: flex;
            min-height: 100vh;
        }

        /* ═══════════════════════════════════════════
           Sidebar
        ═══════════════════════════════════════════ */
        .sidebar {
            width: var(--sidebar-w);
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-subtle);
            padding: 0;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 100;
            overflow-y: auto;
        }
        .sidebar-brand {
            padding: 24px 24px 20px;
            border-bottom: 1px solid var(--border-subtle);
        }
        .sidebar-brand h2 {
            font-size: 15px;
            font-weight: 700;
            letter-spacing: -0.3px;
            color: var(--text-primary);
        }
        .sidebar-brand h2 span {
            color: var(--accent);
        }
        .sidebar-brand p {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-top: 4px;
        }
        .sidebar-nav {
            flex: 1;
            padding: 16px 12px;
        }
        .sidebar-section {
            font-size: 9px;
            font-weight: 600;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--text-muted);
            padding: 12px 12px 8px;
        }
        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            border-radius: var(--radius-sm);
            color: var(--text-secondary);
            font-size: 13px;
            font-weight: 500;
            transition: all var(--transition);
            margin-bottom: 2px;
        }
        .nav-link:hover {
            background: var(--bg-glass);
            color: var(--text-primary);
        }
        .nav-link.active {
            background: var(--accent-glow);
            color: var(--accent);
            box-shadow: var(--shadow-glow);
        }
        .nav-link .nav-icon {
            font-size: 16px;
            width: 20px;
            text-align: center;
            flex-shrink: 0;
        }
        .sidebar-footer {
            padding: 16px;
            border-top: 1px solid var(--border-subtle);
        }
        .sidebar-user {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: var(--radius-sm);
            background: var(--bg-glass);
        }
        .sidebar-avatar {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent), #1B4F8A);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 700;
            color: white;
            flex-shrink: 0;
        }
        .sidebar-user-info {
            flex: 1;
            min-width: 0;
        }
        .sidebar-user-name {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .sidebar-user-email {
            font-size: 10px;
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* ═══════════════════════════════════════════
           Main Content
        ═══════════════════════════════════════════ */
        .main-content {
            flex: 1;
            margin-left: var(--sidebar-w);
            padding: 32px 40px;
            min-height: 100vh;
        }
        .page-header {
            margin-bottom: 32px;
        }
        .page-header h1 {
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: var(--text-primary);
            margin-bottom: 4px;
        }
        .page-header p {
            font-size: 13px;
            color: var(--text-secondary);
        }
        .page-header-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
        }

        /* ═══════════════════════════════════════════
           Cards
        ═══════════════════════════════════════════ */
        .card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius);
            padding: 24px;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            transition: all var(--transition);
        }
        .card:hover {
            background: var(--bg-card-hover);
            border-color: rgba(255, 255, 255, 0.1);
        }
        .card-title {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 12px;
        }

        /* ═══════════════════════════════════════════
           Stats Cards
        ═══════════════════════════════════════════ */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 28px;
        }
        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius);
            padding: 22px 24px;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            transition: all var(--transition);
            position: relative;
            overflow: hidden;
        }
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--stat-accent, var(--accent));
            opacity: 0.6;
            transition: opacity var(--transition);
        }
        .stat-card:hover::before {
            opacity: 1;
        }
        .stat-card:hover {
            background: var(--bg-card-hover);
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        .stat-icon {
            font-size: 24px;
            margin-bottom: 12px;
        }
        .stat-value {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -1px;
            color: var(--text-primary);
            line-height: 1;
            margin-bottom: 4px;
        }
        .stat-label {
            font-size: 12px;
            color: var(--text-secondary);
            font-weight: 500;
        }

        /* ═══════════════════════════════════════════
           Tables
        ═══════════════════════════════════════════ */
        .table-wrapper {
            overflow-x: auto;
            border-radius: var(--radius);
            border: 1px solid var(--border-subtle);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        thead {
            background: rgba(255, 255, 255, 0.02);
        }
        th {
            text-align: left;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--text-muted);
            padding: 14px 18px;
            border-bottom: 1px solid var(--border-subtle);
            white-space: nowrap;
        }
        td {
            padding: 14px 18px;
            font-size: 13px;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--border-subtle);
            vertical-align: middle;
        }
        tr:last-child td {
            border-bottom: none;
        }
        tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }
        .cafe-name-cell {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .cafe-accent-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .cafe-name-text {
            font-weight: 600;
            color: var(--text-primary);
        }

        /* ═══════════════════════════════════════════
           Badges
        ═══════════════════════════════════════════ */
        .badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 600;
            padding: 3px 10px;
            border-radius: 100px;
            letter-spacing: 0.3px;
        }
        .badge-success { background: var(--success-bg); color: var(--success); }
        .badge-warning { background: var(--warning-bg); color: var(--warning); }
        .badge-danger { background: var(--danger-bg); color: var(--danger); }
        .badge-info { background: var(--info-bg); color: var(--info); }
        .badge-tag {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-secondary);
            margin-right: 4px;
            margin-bottom: 4px;
        }

        /* ═══════════════════════════════════════════
           Buttons
        ═══════════════════════════════════════════ */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: var(--radius-sm);
            border: none;
            cursor: pointer;
            transition: all var(--transition);
            text-decoration: none;
            white-space: nowrap;
        }
        .btn-primary {
            background: var(--accent);
            color: #0B0E14;
        }
        .btn-primary:hover {
            background: var(--accent-hover);
            color: #0B0E14;
            box-shadow: 0 4px 16px rgba(42, 191, 191, 0.3);
            transform: translateY(-1px);
        }
        .btn-ghost {
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-subtle);
        }
        .btn-ghost:hover {
            background: var(--bg-glass);
            color: var(--text-primary);
            border-color: rgba(255, 255, 255, 0.12);
        }
        .btn-danger-ghost {
            background: transparent;
            color: var(--danger);
            border: 1px solid rgba(248, 113, 113, 0.2);
        }
        .btn-danger-ghost:hover {
            background: var(--danger-bg);
            border-color: rgba(248, 113, 113, 0.4);
        }
        .btn-sm {
            font-size: 11px;
            padding: 6px 14px;
        }
        .btn-icon {
            padding: 8px;
            font-size: 15px;
        }

        /* ═══════════════════════════════════════════
           Forms
        ═══════════════════════════════════════════ */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .form-group {
            margin-bottom: 0;
        }
        .form-group.full-width {
            grid-column: 1 / -1;
        }
        .form-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 8px;
        }
        .form-input,
        .form-select,
        .form-textarea {
            width: 100%;
            padding: 11px 16px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            color: var(--text-primary);
            background: var(--bg-input);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            outline: none;
            transition: all var(--transition);
        }
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
            border-color: var(--border-focus);
            box-shadow: 0 0 0 3px var(--accent-glow);
            background: rgba(255, 255, 255, 0.07);
        }
        .form-input::placeholder,
        .form-textarea::placeholder {
            color: var(--text-muted);
        }
        .form-select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555D72' d='M6 8.5L1 3.5h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            padding-right: 36px;
        }
        .form-textarea {
            resize: vertical;
            min-height: 80px;
        }
        .form-hint {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 6px;
        }
        .form-check {
            display: flex;
            align-items: center;
            gap: 10px;
            padding-top: 28px;
        }
        .form-check input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--accent);
            cursor: pointer;
        }
        .form-check label {
            font-size: 13px;
            color: var(--text-secondary);
            cursor: pointer;
        }
        .form-error {
            font-size: 11px;
            color: var(--danger);
            margin-top: 6px;
        }
        .form-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-top: 12px;
            grid-column: 1 / -1;
        }

        /* ═══════════════════════════════════════════
           Alerts
        ═══════════════════════════════════════════ */
        .alert {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            border-radius: var(--radius-sm);
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 24px;
            animation: slideDown 0.3s ease;
        }
        .alert-success {
            background: var(--success-bg);
            color: var(--success);
            border: 1px solid rgba(52, 211, 153, 0.2);
        }
        .alert-danger {
            background: var(--danger-bg);
            color: var(--danger);
            border: 1px solid rgba(248, 113, 113, 0.2);
        }

        /* ═══════════════════════════════════════════
           Chart Bars (Simple CSS)
        ═══════════════════════════════════════════ */
        .chart-bar-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .chart-bar-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .chart-bar-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary);
            width: 90px;
            flex-shrink: 0;
            text-align: right;
        }
        .chart-bar-track {
            flex: 1;
            height: 8px;
            background: rgba(255, 255, 255, 0.04);
            border-radius: 100px;
            overflow: hidden;
        }
        .chart-bar-fill {
            height: 100%;
            border-radius: 100px;
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .chart-bar-value {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-primary);
            width: 28px;
            text-align: right;
        }

        /* ═══════════════════════════════════════════
           Animations
        ═══════════════════════════════════════════ */
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
            animation: fadeIn 0.4s ease both;
        }
        .fade-in-delay-1 { animation-delay: 0.05s; }
        .fade-in-delay-2 { animation-delay: 0.1s; }
        .fade-in-delay-3 { animation-delay: 0.15s; }
        .fade-in-delay-4 { animation-delay: 0.2s; }

        /* ═══════════════════════════════════════════
           Responsive
        ═══════════════════════════════════════════ */
        @media (max-width: 768px) {
            .sidebar {
                display: none;
            }
            .main-content {
                margin-left: 0;
                padding: 20px;
            }
            .stats-grid {
                grid-template-columns: 1fr;
            }
            .form-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="admin-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-brand">
                <h2>☕ Cafe <span>Finder</span></h2>
                <p>Admin Panel</p>
            </div>
            <nav class="sidebar-nav">
                <div class="sidebar-section">Menu</div>
                <a href="{{ route('admin.dashboard') }}" class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                    <span class="nav-icon">📊</span>
                    ダッシュボード
                </a>
                <a href="{{ route('admin.cafes.index') }}" class="nav-link {{ request()->routeIs('admin.cafes.*') ? 'active' : '' }}">
                    <span class="nav-icon">☕</span>
                    カフェ管理
                </a>
                <a href="{{ route('admin.reviews.index') }}" class="nav-link {{ request()->routeIs('admin.reviews.*') ? 'active' : '' }}">
                    <span class="nav-icon">💬</span>
                    クチコミ管理
                </a>
                <a href="{{ route('admin.crowd-reports.index') }}" class="nav-link {{ request()->routeIs('admin.crowd-reports.*') ? 'active' : '' }}">
                    <span class="nav-icon">👀</span>
                    混雑状況管理
                </a>
                <div class="sidebar-section" style="margin-top: 20px;">Links</div>
                <a href="/" class="nav-link" target="_blank">
                    <span class="nav-icon">🌐</span>
                    サイトを表示
                </a>
            </nav>
            <div class="sidebar-footer">
                <div class="sidebar-user">
                    <div class="sidebar-avatar">{{ substr(Auth::user()->name, 0, 1) }}</div>
                    <div class="sidebar-user-info">
                        <div class="sidebar-user-name">{{ Auth::user()->name }}</div>
                        <div class="sidebar-user-email">{{ Auth::user()->email }}</div>
                    </div>
                </div>
                <form action="{{ route('admin.logout') }}" method="POST" style="margin-top: 10px;">
                    @csrf
                    <button type="submit" class="btn btn-ghost btn-sm" style="width: 100%; justify-content: center;">
                        🚪 ログアウト
                    </button>
                </form>
            </div>
        </aside>

        <!-- Main content -->
        <main class="main-content">
            @if (session('success'))
                <div class="alert alert-success">
                    <span>✅</span> {{ session('success') }}
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</body>
</html>
