@extends('admin.layouts.app')

@section('title', 'クチコミ管理')

@section('content')
<div class="page-header">
    <div class="page-header-actions">
        <div>
            <h1>クチコミ管理</h1>
            <p>全 {{ $reviews->total() }} 件のクチコミを管理</p>
        </div>
    </div>
</div>

@if (session('success'))
<div style="padding: 12px 16px; background: rgba(46, 125, 50, 0.1); border: 1px solid var(--success); border-radius: 4px; color: var(--success); margin-bottom: 20px; font-weight: 500;">
    {{ session('success') }}
</div>
@endif

<div class="table-wrapper fade-in">
    <table>
        <thead>
            <tr>
                <th>投稿者</th>
                <th>対象カフェ</th>
                <th>訪問目的</th>
                <th>平均評価</th>
                <th>コメント</th>
                <th>混雑度</th>
                <th>タグ</th>
                <th>投稿日時</th>
                <th style="text-align: right;">操作</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($reviews as $review)
            <tr>
                <td>
                    <span style="font-weight: 600; color: var(--text-heading);">👤 {{ $review->user_name }}</span>
                    @if ($review->trashed())
                        <span class="badge" style="background: rgba(224, 90, 90, 0.15); color: #E05A5A; border: 1px solid rgba(224, 90, 90, 0.3); margin-left: 6px; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; display: inline-block;">非表示</span>
                    @endif
                </td>
                <td>
                    @if ($review->cafe)
                        <span style="color: var(--text-body);">☕ {{ $review->cafe->name }}</span>
                    @else
                        <span style="color: var(--text-muted); font-style: italic;">削除されたカフェ</span>
                    @endif
                </td>
                <td>
                    @if ($review->purpose)
                        <span class="badge badge-tag" style="background: rgba(29, 158, 117, 0.15); color: #1D9E75; border: 1px solid rgba(29, 158, 117, 0.3);">
                            @if ($review->purpose === '作業') 💻 @elseif ($review->purpose === '勉強') 📚 @elseif ($review->purpose === 'ミーティング') 🤝 @endif {{ $review->purpose }}
                        </span>
                    @else
                        <span style="color: var(--text-muted); font-size: 11px;">-</span>
                    @endif
                </td>
                <td>
                    @php
                        $stars = is_array($review->stars) ? $review->stars : json_decode($review->stars, true);
                        $validStars = is_array($stars) ? array_filter($stars, fn($s) => $s > 0) : [];
                        $avg = count($validStars) > 0 ? round(array_sum($validStars) / count($validStars), 1) : null;
                    @endphp
                    @if ($avg)
                        <span style="color: #F5A623; letter-spacing: -1px; font-size: 12px;">
                            @for ($i = 1; $i <= 5; $i++)
                                {{ $i <= round($avg) ? '★' : '☆' }}
                            @endfor
                        </span>
                        <strong style="margin-left: 4px; font-family: monospace; font-size: 11px;">{{ $avg }}</strong>
                    @else
                        <span style="color: var(--text-muted); font-size: 11px;">-</span>
                    @endif
                </td>
                <td>
                    @if ($review->comment)
                        <span style="font-size: 12px; color: var(--text-primary);" title="{{ $review->comment }}">
                            {{ \Illuminate\Support\Str::limit($review->comment, 40) }}
                        </span>
                    @else
                        <span style="color: var(--text-muted); font-size: 11px; font-style: italic;">未記入</span>
                    @endif
                </td>
                <td>
                    @if ($review->crowd)
                        <span class="badge badge-info">{{ $review->crowd }}</span>
                    @else
                        <span style="color: var(--text-muted); font-size: 11px;">未設定</span>
                    @endif
                </td>
                <td>
                    @php
                        $tags = is_array($review->tags) ? $review->tags : json_decode($review->tags, true);
                    @endphp
                    @if (is_array($tags) && count($tags) > 0)
                        @foreach ($tags as $tag)
                            <span class="badge badge-tag" style="background: rgba(255,255,255,0.05); color: var(--text-body); border: 1px solid rgba(255,255,255,0.1); margin-right: 2px;">#{{ $tag }}</span>
                        @endforeach
                    @else
                        <span style="color: var(--text-muted); font-size: 11px;">なし</span>
                    @endif
                </td>
                <td style="font-size: 11px; color: var(--text-muted);">
                    {{ $review->created_at->format('Y/m/d H:i') }}
                </td>
                <td style="text-align: right; white-space: nowrap;">
                    <a href="{{ route('admin.reviews.edit', $review) }}" class="btn btn-ghost btn-sm">
                        ✏️ 編集
                    </a>
                    @if ($review->trashed())
                        <form action="{{ route('admin.reviews.restore', $review->id) }}" method="POST" style="display: inline;" onsubmit="return confirm('このクチコミを表示に戻しますか？')">
                            @csrf
                            <button type="submit" class="btn btn-sm" style="color: #2E7D32; background: rgba(46, 125, 50, 0.1); border: 1px solid rgba(46, 125, 50, 0.3); border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px; font-weight: 500;">
                                🔓 表示に戻す
                            </button>
                        </form>
                    @else
                        <form action="{{ route('admin.reviews.destroy', $review) }}" method="POST" style="display: inline;" onsubmit="return confirm('このクチコミを非表示にしますか？')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger-ghost btn-sm">
                                🗑 非表示にする
                            </button>
                        </form>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="9" style="text-align: center; padding: 48px; color: var(--text-muted);">
                    <div style="font-size: 32px; margin-bottom: 12px;">💬</div>
                    <p>クチコミはまだ投稿されていません。</p>
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

@if ($reviews->hasPages())
    <div style="margin-top: 20px; display: flex; justify-content: center;">
        {{ $reviews->links() }}
    </div>
@endif

@endsection
