@extends('admin.layouts.app')

@section('title', 'ダッシュボード')

@section('content')
<div class="page-header">
    <h1>ダッシュボード</h1>
    <p>IT Park Cafe Finder の統計情報</p>
</div>

<!-- Stats Cards -->
<div class="stats-grid">
    <div class="stat-card fade-in fade-in-delay-1" style="--stat-accent: #2ABFBF;">
        <div class="stat-icon">☕</div>
        <div class="stat-value">{{ $totalCafes }}</div>
        <div class="stat-label">登録カフェ数</div>
    </div>
    <div class="stat-card fade-in fade-in-delay-2" style="--stat-accent: #60A5FA;">
        <div class="stat-icon">🌙</div>
        <div class="stat-value">{{ $cafes24h }}</div>
        <div class="stat-label">24時間営業</div>
    </div>
    <div class="stat-card fade-in fade-in-delay-3" style="--stat-accent: #FBBF24;">
        <div class="stat-icon">💰</div>
        <div class="stat-value">₱{{ number_format($avgPrice) }}</div>
        <div class="stat-label">平均予算</div>
    </div>
    <div class="stat-card fade-in fade-in-delay-4" style="--stat-accent: #34D399;">
        <div class="stat-icon">📶</div>
        <div class="stat-value">{{ $wifiExcellent }}</div>
        <div class="stat-label">WiFi EXCELLENT</div>
    </div>
</div>

<!-- Charts Row -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px;">

    <!-- WiFi Distribution -->
    <div class="card fade-in fade-in-delay-2">
        <div class="card-title">📶 WiFi レベル分布</div>
        <div class="chart-bar-group">
            <div class="chart-bar-row">
                <div class="chart-bar-label">EXCELLENT</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ $totalCafes > 0 ? ($wifiExcellent / $totalCafes * 100) : 0 }}%; background: linear-gradient(90deg, #2ABFBF, #35D1D1);"></div>
                </div>
                <div class="chart-bar-value">{{ $wifiExcellent }}</div>
            </div>
            <div class="chart-bar-row">
                <div class="chart-bar-label">GOOD</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ $totalCafes > 0 ? ($wifiGood / $totalCafes * 100) : 0 }}%; background: linear-gradient(90deg, #34D399, #6EE7B7);"></div>
                </div>
                <div class="chart-bar-value">{{ $wifiGood }}</div>
            </div>
            <div class="chart-bar-row">
                <div class="chart-bar-label">AVERAGE</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ $totalCafes > 0 ? ($wifiAverage / $totalCafes * 100) : 0 }}%; background: linear-gradient(90deg, #FBBF24, #FDE68A);"></div>
                </div>
                <div class="chart-bar-value">{{ $wifiAverage }}</div>
            </div>
            <div class="chart-bar-row">
                <div class="chart-bar-label">NOT EXIST</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ $totalCafes > 0 ? ($wifiNotExist / $totalCafes * 100) : 0 }}%; background: linear-gradient(90deg, #94A3B8, #CBD5E1);"></div>
                </div>
                <div class="chart-bar-value">{{ $wifiNotExist }}</div>
            </div>
        </div>
    </div>

    <!-- Outlet Distribution -->
    <div class="card fade-in fade-in-delay-3">
        <div class="card-title">🔌 電源状況</div>
        <div class="chart-bar-group">
            <div class="chart-bar-row">
                <div class="chart-bar-label">YES</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ $totalCafes > 0 ? ($outletYes / $totalCafes * 100) : 0 }}%; background: linear-gradient(90deg, #34D399, #6EE7B7);"></div>
                </div>
                <div class="chart-bar-value">{{ $outletYes }}</div>
            </div>
            <div class="chart-bar-row">
                <div class="chart-bar-label">LIMITED</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ $totalCafes > 0 ? ($outletLimited / $totalCafes * 100) : 0 }}%; background: linear-gradient(90deg, #FBBF24, #FDE68A);"></div>
                </div>
                <div class="chart-bar-value">{{ $outletLimited }}</div>
            </div>
            <div class="chart-bar-row">
                <div class="chart-bar-label">NO</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ $totalCafes > 0 ? ($outletNo / $totalCafes * 100) : 0 }}%; background: linear-gradient(90deg, #F87171, #FCA5A5);"></div>
                </div>
                <div class="chart-bar-value">{{ $outletNo }}</div>
            </div>
        </div>
    </div>
</div>

<!-- Bottom Row -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">

    <!-- Tags -->
    <div class="card fade-in fade-in-delay-3">
        <div class="card-title">🏷️ タグ別カフェ数</div>
        <div class="chart-bar-group">
            @foreach (collect($allTags)->sortDesc() as $tag => $count)
            <div class="chart-bar-row">
                <div class="chart-bar-label">#{{ $tag }}</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ $totalCafes > 0 ? ($count / $totalCafes * 100) : 0 }}%; background: linear-gradient(90deg, #818CF8, #A5B4FC);"></div>
                </div>
                <div class="chart-bar-value">{{ $count }}</div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Recent Cafes -->
    <div class="card fade-in fade-in-delay-4">
        <div class="card-title">🕐 最近追加されたカフェ</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            @foreach ($recentCafes as $cafe)
            <a href="{{ route('admin.cafes.edit', $cafe) }}" style="text-decoration: none; color: inherit;">
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid transparent; transition: all 0.2s;"
                     onmouseenter="this.style.background='rgba(255,255,255,0.05)';this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='translateX(4px)';"
                     onmouseleave="this.style.background='rgba(255,255,255,0.02)';this.style.borderColor='transparent';this.style.transform='none';">
                    <div class="cafe-accent-dot" style="background: {{ $cafe->accent }};"></div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $cafe->name }}</div>
                        <div style="font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                            <span>{{ $cafe->hours }}</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                        @if ($cafe->wifi === 'EXCELLENT')
                            <span class="badge badge-success" style="font-size: 8px; padding: 2px 6px;">📶 EXCELLENT</span>
                        @elseif ($cafe->wifi === 'GOOD')
                            <span class="badge badge-info" style="font-size: 8px; padding: 2px 6px;">📶 GOOD</span>
                        @elseif ($cafe->wifi === 'NOT_EXIST')
                            <span class="badge badge-danger" style="font-size: 8px; padding: 2px 6px;">🚫 NO WiFi</span>
                        @else
                            <span class="badge badge-warning" style="font-size: 8px; padding: 2px 6px;">📶 AVG</span>
                        @endif
                        @if ($cafe->is_24h)
                            <span class="badge badge-info" style="font-size: 8px; padding: 2px 6px;">24h</span>
                        @endif
                    </div>
                </div>
            </a>
            @endforeach
        </div>
    </div>
</div>
@endsection
