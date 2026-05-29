@extends('admin.layouts.app')

@section('title', '混雑状況レポート管理')

@section('content')
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">混雑状況レポート一覧</h1>
</div>

@if(session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif

<div class="table-responsive">
    <table class="table table-striped table-sm align-middle">
        <thead>
            <tr>
                <th>ID</th>
                <th>カフェ</th>
                <th>ユーザー</th>
                <th>ステータス</th>
                <th>報告日時</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reports as $report)
            <tr>
                <td>{{ $report->id }}</td>
                <td>
                    <a href="{{ route('admin.cafes.edit', $report->cafe_id) }}">
                        {{ optional($report->cafe)->name ?? '不明' }}
                    </a>
                </td>
                <td>
                    {{ optional($report->user)->name ?? '不明' }}
                </td>
                <td>
                    @if($report->status === 'empty')
                        <span class="badge bg-success">空いてる</span>
                    @else
                        <span class="badge bg-danger">混んでる</span>
                    @endif
                </td>
                <td>{{ $report->created_at->format('Y-m-d H:i') }}</td>
                <td>
                    <form action="{{ route('admin.crowd-reports.destroy', $report->id) }}" method="POST" class="d-inline" onsubmit="return confirm('本当に削除しますか？');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-trash"></i> 削除
                        </button>
                    </form>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" class="text-center text-muted py-4">報告はまだありません。</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="mt-4">
    {{ $reports->links() }}
</div>
@endsection
