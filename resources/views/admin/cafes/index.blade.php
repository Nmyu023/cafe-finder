@extends('admin.layouts.app')

@section('title', 'カフェ管理')

@section('content')
<style>
    .drag-handle {
        color: var(--text-muted);
        font-size: 16px;
        transition: color var(--transition);
        user-select: none;
        width: 40px;
        text-align: center;
    }
    .drag-handle:hover {
        color: var(--accent);
        cursor: grab;
    }
    .sortable-ghost {
        opacity: 0.4;
        background: var(--bg-secondary) !important;
        border: 1px dashed var(--accent);
    }
    .sortable-chosen {
        background: rgba(255, 255, 255, 0.05) !important;
    }
    tr.sortable-drag {
        background: var(--bg-card-hover) !important;
        box-shadow: var(--shadow-lg);
        opacity: 0.9;
    }
</style>

<div class="page-header">
    <div class="page-header-actions">
        <div>
            <h1 style="display: flex; align-items: center; gap: 12px;">
                カフェ管理
                <span id="save-indicator" style="font-size: 12px; color: var(--accent); transition: opacity var(--transition); opacity: 0; font-weight: 600; padding: 4px 10px; background: var(--accent-glow); border-radius: var(--radius-sm);"></span>
            </h1>
            <p>全 {{ $cafes->count() }} 件のカフェを管理（ドラッグ＆ドロップで並び替え可能）</p>
        </div>
        <a href="{{ route('admin.cafes.create') }}" class="btn btn-primary">
            ＋ 新規カフェを追加
        </a>
    </div>
</div>

<div class="table-wrapper fade-in">
    <table>
        <thead>
            <tr>
                <th style="width: 50px; text-align: center;">移動</th>
                <th>カフェ名</th>
                <th>営業時間</th>
                <th>WiFi</th>
                <th>電源</th>
                <th>予算</th>
                <th style="text-align: center;">クチコミ数</th>
                <th style="text-align: center;">平均評価</th>
                <th>タグ</th>
                <th style="text-align: right;">操作</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($cafes as $cafe)
            <tr data-id="{{ $cafe->id }}">
                <td class="drag-handle">☰</td>
                <td>
                    <div class="cafe-name-cell">
                        <div class="cafe-accent-dot" style="background: {{ $cafe->accent }};"></div>
                        <span class="cafe-name-text">{{ $cafe->name }}</span>
                    </div>
                </td>
                <td>
                    @if ($cafe->is_24h)
                        <span class="badge badge-info">24h</span>
                    @else
                        {{ $cafe->hours }}
                    @endif
                </td>
                <td>
                    @if ($cafe->wifi === 'EXCELLENT')
                        <span class="badge badge-success">{{ $cafe->wifi }}</span>
                    @elseif ($cafe->wifi === 'GOOD')
                        <span class="badge badge-info">{{ $cafe->wifi }}</span>
                    @elseif ($cafe->wifi === 'NOT_EXIST')
                        <span class="badge badge-danger">NOT EXIST</span>
                    @else
                        <span class="badge badge-warning">{{ $cafe->wifi }}</span>
                    @endif

                    @if(!empty($cafe->specs['wifi_limit']))
                        <div style="font-size: 11px; margin-top: 4px; color: var(--text-muted);">
                            制限: {{ $cafe->specs['wifi_limit'] }}
                        </div>
                    @endif
                    @if(isset($cafe->specs['cashless_available']))
                        <div style="font-size: 11px; margin-top: 2px; color: var(--text-muted);">
                            💳 {{ filter_var($cafe->specs['cashless_available'], FILTER_VALIDATE_BOOLEAN) ? 'キャッシュレス可' : 'キャッシュレス不可' }}
                        </div>
                    @endif
                </td>
                <td>
                    @if ($cafe->outlet === 'YES')
                        <span class="badge badge-success">{{ $cafe->outlet }}</span>
                    @elseif ($cafe->outlet === 'LIMITED')
                        <span class="badge badge-warning">{{ $cafe->outlet }}</span>
                    @else
                        <span class="badge badge-danger">{{ $cafe->outlet }}</span>
                    @endif
                </td>
                <td style="font-weight: 600;">{{ $cafe->price }}</td>
                <td style="text-align: center;">
                    <span class="badge {{ $cafe->reviews_count > 0 ? 'badge-info' : 'badge-tag' }}" style="font-family: monospace;">
                        {{ $cafe->reviews_count }} 件
                    </span>
                </td>
                <td style="text-align: center;">
                    @if (isset($avgRatings[$cafe->id]) && $avgRatings[$cafe->id])
                        <span style="color: #F5A623; font-weight: 700; font-family: monospace;">★ {{ number_format($avgRatings[$cafe->id], 1) }}</span>
                    @else
                        <span style="color: var(--text-muted); font-size: 11px;">-</span>
                    @endif
                </td>
                <td>
                    @if ($cafe->tags)
                        @foreach ($cafe->tags as $tag)
                            <span class="badge badge-tag">#{{ $tag }}</span>
                        @endforeach
                    @endif
                </td>
                <td style="text-align: right; white-space: nowrap;">
                    <a href="{{ route('admin.cafes.stats', $cafe) }}" class="btn btn-ghost btn-sm" style="margin-right: 4px; border-color: rgba(42, 191, 191, 0.3); color: var(--accent);">
                        📊 統計
                    </a>
                    <a href="{{ route('admin.cafes.edit', $cafe) }}" class="btn btn-ghost btn-sm" style="margin-right: 4px;">
                        ✏️ 編集
                    </a>
                    <form action="{{ route('admin.cafes.destroy', $cafe) }}" method="POST" style="display: inline;" onsubmit="return confirm('「{{ $cafe->name }}」を削除しますか？')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger-ghost btn-sm">
                            🗑 削除
                        </button>
                    </form>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="10" style="text-align: center; padding: 48px; color: var(--text-muted);">
                    <div style="font-size: 32px; margin-bottom: 12px;">☕</div>
                    <p>カフェがまだ登録されていません。</p>
                    <a href="{{ route('admin.cafes.create') }}" class="btn btn-primary btn-sm" style="margin-top: 16px;">
                        最初のカフェを追加する
                    </a>
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    const el = document.querySelector('tbody');
    if (el) {
        Sortable.create(el, {
            animation: 150,
            handle: '.drag-handle',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            onEnd: function () {
                const order = Array.from(el.querySelectorAll('tr')).map(tr => tr.dataset.id);
                
                const indicator = document.getElementById('save-indicator');
                if (indicator) {
                    indicator.textContent = '⏳ 保存中...';
                    indicator.style.color = 'var(--accent)';
                    indicator.style.opacity = '1';
                }

                fetch('{{ route("admin.cafes.update-order") }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({ order: order })
                  })
                  .then(response => response.json())
                  .then(data => {
                      if (data.success) {
                          if (indicator) {
                              indicator.textContent = '✅ 順序を保存しました';
                              setTimeout(() => {
                                  indicator.style.opacity = '0';
                              }, 2000);
                          }
                      } else {
                          if (indicator) {
                              indicator.textContent = '❌ 保存失敗';
                              indicator.style.color = 'var(--danger)';
                          }
                      }
                  })
                  .catch(() => {
                      if (indicator) {
                          indicator.textContent = '❌ 通信エラー';
                          indicator.style.color = 'var(--danger)';
                      }
                  });
            }
        });
    }
});
</script>
@endsection
