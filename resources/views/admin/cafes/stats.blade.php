@extends('admin.layouts.app')

@section('title', $cafe->name . ' - 統計情報')

@section('content')
<div class="page-header">
    <div class="page-header-actions">
        <div>
            <h1>📊 {{ $cafe->name }}</h1>
            <p>カフェ詳細統計 · レビュー {{ $reviewCount }} 件</p>
        </div>
        <div style="display: flex; gap: 8px;">
            <a href="{{ route('admin.cafes.edit', $cafe) }}" class="btn btn-ghost btn-sm">✏️ 編集</a>
            <a href="{{ route('admin.cafes.index') }}" class="btn btn-ghost btn-sm">← 一覧に戻る</a>
        </div>
    </div>
</div>

<!-- Overview Cards -->
<div class="stats-grid" style="margin-bottom: 28px;">
    <div class="stat-card fade-in fade-in-delay-1" style="--stat-accent: #2ABFBF;">
        <div class="stat-icon">💬</div>
        <div class="stat-value">{{ $reviewCount }}</div>
        <div class="stat-label">レビュー件数</div>
    </div>
    <div class="stat-card fade-in fade-in-delay-2" style="--stat-accent: #F5A623;">
        <div class="stat-icon">⭐</div>
        <div class="stat-value">{{ $overallAvg ?? '-' }}</div>
        <div class="stat-label">総合評価</div>
    </div>
    <div class="stat-card fade-in fade-in-delay-3" style="--stat-accent: {{ $cafe->wifi === 'EXCELLENT' ? '#2ABFBF' : ($cafe->wifi === 'GOOD' ? '#4CAF50' : ($cafe->wifi === 'NOT_EXIST' ? '#94A3B8' : '#FBBF24')) }};">
        <div class="stat-icon">📶</div>
        <div class="stat-value" style="font-size: 20px;">{{ $cafe->wifi }}</div>
        <div class="stat-label">WiFi レベル</div>
    </div>
    <div class="stat-card fade-in fade-in-delay-4" style="--stat-accent: #34D399;">
        <div class="stat-icon">🔌</div>
        <div class="stat-value" style="font-size: 20px;">{{ $cafe->outlet }}</div>
        <div class="stat-label">電源</div>
    </div>
</div>

@if ($reviewCount > 0)
<!-- Rating Categories -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px;">
    <div class="card fade-in fade-in-delay-2">
        <div class="card-title">⭐ 評価項目別スコア</div>
        <div class="chart-bar-group">
            @foreach ($ratingLabels as $i => $label)
            <div class="chart-bar-row">
                <div class="chart-bar-label">{{ $label }}</div>
                <div class="chart-bar-track">
                    @if ($categoryAvgs[$i])
                    <div class="chart-bar-fill" style="width: {{ ($categoryAvgs[$i] / 5) * 100 }}%; background: linear-gradient(90deg,
                        {{ $categoryAvgs[$i] >= 4 ? '#2ABFBF, #35D1D1' : ($categoryAvgs[$i] >= 3 ? '#34D399, #6EE7B7' : ($categoryAvgs[$i] >= 2 ? '#FBBF24, #FDE68A' : '#F87171, #FCA5A5')) }});"></div>
                    @endif
                </div>
                <div class="chart-bar-value">{{ $categoryAvgs[$i] ?? '-' }}</div>
            </div>
            @endforeach
        </div>
    </div>

    <div class="card fade-in fade-in-delay-3">
        <div class="card-title">👥 混雑度の分布</div>
        @if ($crowdDist->count() > 0)
        <div class="chart-bar-group">
            @foreach ($crowdDist->sortDesc() as $crowd => $crowdCount)
            <div class="chart-bar-row">
                <div class="chart-bar-label">{{ $crowd }}</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ ($crowdCount / $reviewCount) * 100 }}%; background: linear-gradient(90deg, #818CF8, #A5B4FC);"></div>
                </div>
                <div class="chart-bar-value">{{ $crowdCount }}</div>
            </div>
            @endforeach
        </div>
        @else
        <p style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 24px;">混雑度データなし</p>
        @endif
    </div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px;">
    <!-- Tags -->
    <div class="card fade-in fade-in-delay-3">
        <div class="card-title">🏷️ レビュータグ</div>
        @if (count($tagFreq) > 0)
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            @foreach ($tagFreq as $tag => $tagCount)
            <span class="badge badge-tag" style="background: rgba(129, 140, 248, 0.15); color: #818CF8; border: 1px solid rgba(129, 140, 248, 0.3); padding: 6px 12px; font-size: 12px;">
                #{{ $tag }} <strong style="margin-left: 4px;">{{ $tagCount }}</strong>
            </span>
            @endforeach
        </div>
        @else
        <p style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 24px;">タグなし</p>
        @endif
    </div>

    <!-- Purpose -->
    <div class="card fade-in fade-in-delay-4">
        <div class="card-title">🎯 訪問目的</div>
        @if ($purposeDist->count() > 0)
        <div class="chart-bar-group">
            @foreach ($purposeDist->sortDesc() as $purpose => $purposeCount)
            <div class="chart-bar-row">
                <div class="chart-bar-label">
                    @if ($purpose === '作業') 💻
                    @elseif ($purpose === '勉強') 📚
                    @elseif ($purpose === 'ミーティング') 🤝
                    @else 🍵
                    @endif {{ $purpose }}
                </div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: {{ ($purposeCount / $reviewCount) * 100 }}%; background: linear-gradient(90deg, #34D399, #6EE7B7);"></div>
                </div>
                <div class="chart-bar-value">{{ $purposeCount }}</div>
            </div>
            @endforeach
        </div>
        @else
        <p style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 24px;">目的データなし</p>
        @endif
    </div>
</div>

<!-- Recent Reviews -->
<div class="card fade-in fade-in-delay-4" style="margin-bottom: 28px;">
    <div class="card-title">💬 レビュー一覧（新着順）</div>
    <div style="display: flex; flex-direction: column; gap: 12px;">
        @foreach ($reviews as $review)
        <div style="padding: 16px 20px; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: 600; color: var(--text-heading); font-size: 13px;">👤 {{ $review->user_name }}</span>
                    @if ($review->purpose)
                    <span class="badge badge-tag" style="background: rgba(29, 158, 117, 0.15); color: #1D9E75; border: 1px solid rgba(29, 158, 117, 0.3); font-size: 10px; padding: 2px 6px;">
                        {{ $review->purpose }}
                    </span>
                    @endif
                </div>
                <span style="font-size: 11px; color: var(--text-muted);">{{ $review->created_at->format('Y/m/d H:i') }}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
                @php
                    $stars = is_array($review->stars) ? $review->stars : json_decode($review->stars, true);
                    $validStars = is_array($stars) ? array_filter($stars, fn($s) => $s > 0) : [];
                    $avg = count($validStars) > 0 ? round(array_sum($validStars) / count($validStars), 1) : null;
                @endphp
                @if ($avg)
                <span style="color: #F5A623; font-size: 13px; letter-spacing: -1px;">
                    @for ($i = 1; $i <= 5; $i++)
                        {{ $i <= round($avg) ? '★' : '☆' }}
                    @endfor
                </span>
                <strong style="font-family: monospace; font-size: 12px; color: var(--text-heading);">{{ $avg }}</strong>
                @endif
                @if ($review->crowd)
                <span class="badge badge-info" style="font-size: 10px; padding: 2px 6px;">{{ $review->crowd }}</span>
                @endif
            </div>
            @if ($review->comment)
            <p style="font-size: 13px; color: var(--text-body); margin: 8px 0 0; line-height: 1.6;">{{ $review->comment }}</p>
            @endif
        </div>
        @endforeach
    </div>
</div>
@else
<!-- No Reviews State -->
<div class="card fade-in fade-in-delay-2" style="text-align: center; padding: 48px;">
    <div style="font-size: 48px; margin-bottom: 16px;">💬</div>
    <h3 style="color: var(--text-heading); font-size: 16px; margin-bottom: 8px;">まだレビューがありません</h3>
    <p style="color: var(--text-muted); font-size: 13px;">公開サイトからレビューが投稿されるとここに表示されます。</p>
</div>
@endif

@endsection
