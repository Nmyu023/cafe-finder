@extends('admin.layouts.app')

@section('title', 'クチコミ編集')

@section('content')
<div class="page-header">
    <div class="page-header-actions">
        <div>
            <h1>クチコミ編集</h1>
            <p>👤 {{ $review->user_name }} さんが投稿したクチコミを編集します</p>
        </div>
        <a href="{{ route('admin.reviews.index') }}" class="btn btn-ghost">
            ← 一覧に戻る
        </a>
    </div>
</div>

<div class="card fade-in">
    <form method="POST" action="{{ route('admin.reviews.update', $review) }}">
        @csrf
        @method('PUT')
        
        <div style="margin-bottom: 24px; padding: 16px; background: rgba(255, 255, 255, 0.02); border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 4px; display: flex; gap: 24px; flex-wrap: wrap;">
            <div>
                <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 4px;">対象カフェ</span>
                <strong>☕ {{ $review->cafe->name ?? '削除されたカフェ' }}</strong>
            </div>
            <div>
                <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 4px;">投稿者</span>
                <strong>👤 {{ $review->user_name }}</strong>
            </div>
            <div>
                <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 4px;">投稿日時</span>
                <strong>{{ $review->created_at->format('Y年m月d日 H:i') }}</strong>
            </div>
        </div>

        <h3 style="margin: 0 0 16px; font-size: 14px; font-weight: 700; color: var(--text-heading); border-left: 3px solid var(--primary); padding-left: 8px;">
            項目別評価 (1〜5 の星評価)
        </h3>

        @php
            $stars = is_array($review->stars) ? $review->stars : json_decode($review->stars, true);
            $labels = ["Wi-Fi速度", "電源の充実", "静粛性", "コスパ", "雰囲気"];
        @endphp

        <div class="form-grid" style="margin-bottom: 24px;">
            @foreach ($labels as $index => $label)
            <div class="form-group">
                <label class="form-label" for="stars_{{ $index }}">{{ $label }} *</label>
                <select class="form-input" id="stars_{{ $index }}" name="stars[{{ $index }}]" required>
                    <option value="0" {{ (old("stars.{$index}", $stars[$index] ?? 0) == 0) ? 'selected' : '' }}>0 (未評価)</option>
                    @for ($s = 1; $s <= 5; $s++)
                        <option value="{{ $s }}" {{ (old("stars.{$index}", $stars[$index] ?? 0) == $s) ? 'selected' : '' }}>{{ $s }} ★</option>
                    @endfor
                </select>
                @error("stars.{$index}") <div class="form-error">{{ $message }}</div> @enderror
            </div>
            @endforeach
        </div>

        <h3 style="margin: 0 0 16px; font-size: 14px; font-weight: 700; color: var(--text-heading); border-left: 3px solid var(--primary); padding-left: 8px;">
            その他の情報
        </h3>

        <div class="form-grid">
            <!-- Crowd Level -->
            <div class="form-group">
                <label class="form-label" for="crowd">混雑度</label>
                <select class="form-input" id="crowd" name="crowd">
                    <option value="" {{ old('crowd', $review->crowd) == '' ? 'selected' : '' }}>-- 未選択 --</option>
                    <option value="空いてる" {{ old('crowd', $review->crowd) == '空いてる' ? 'selected' : '' }}>空いてる</option>
                    <option value="ふつう" {{ old('crowd', $review->crowd) == 'ふつう' ? 'selected' : '' }}>ふつう</option>
                    <option value="混んでる" {{ old('crowd', $review->crowd) == '混んでる' ? 'selected' : '' }}>混んでる</option>
                </select>
                @error('crowd') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Tags -->
            <div class="form-group">
                <label class="form-label" for="tags">一言タグ (カンマ区切り)</label>
                @php
                    $tagsArray = is_array($review->tags) ? $review->tags : json_decode($review->tags, true);
                    $tagsString = is_array($tagsArray) ? implode(', ', $tagsArray) : '';
                @endphp
                <input class="form-input" type="text" id="tags" name="tags" value="{{ old('tags', $tagsString) }}" placeholder="例: 作業向き, 映える, 静か">
                <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">利用可能なタグ例: 作業向き, 映える, コスパ◎, 静か, 深夜OK, 冷房強め, 店員さん親切</p>
                @error('tags') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Purpose -->
            <div class="form-group" style="grid-column: 1 / -1; margin-top: 10px;">
                <label class="form-label" for="purpose">訪問目的</label>
                <select class="form-input" id="purpose" name="purpose">
                    <option value="" {{ old('purpose', $review->purpose) == '' ? 'selected' : '' }}>-- 未選択 --</option>
                    <option value="作業" {{ old('purpose', $review->purpose) == '作業' ? 'selected' : '' }}>💻 作業</option>
                    <option value="勉強" {{ old('purpose', $review->purpose) == '勉強' ? 'selected' : '' }}>📚 勉強</option>
                    <option value="ミーティング" {{ old('purpose', $review->purpose) == 'ミーティング' ? 'selected' : '' }}>🤝 ミーティング</option>
                </select>
                @error('purpose') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Comment -->
            <div class="form-group" style="grid-column: 1 / -1; margin-top: 10px;">
                <label class="form-label" for="comment">クチコミコメント</label>
                <textarea class="form-textarea" id="comment" name="comment" rows="4" placeholder="クチコミの詳細なコメントを入力してください">{{ old('comment', $review->comment) }}</textarea>
                @error('comment') <div class="form-error">{{ $message }}</div> @enderror
            </div>
        </div>

        <div class="form-actions" style="margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; display: flex; gap: 12px; justify-content: flex-end;">
            <a href="{{ route('admin.reviews.index') }}" class="btn btn-ghost">
                キャンセル
            </a>
            <button type="submit" class="btn btn-primary">
                💾 変更を保存する
            </button>
        </div>
    </form>
</div>
@endsection
