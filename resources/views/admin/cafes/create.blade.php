@extends('admin.layouts.app')

@section('title', '新規カフェ追加')

@section('content')
<div class="page-header">
    <div class="page-header-actions">
        <div>
            <h1>新規カフェ追加</h1>
            <p>新しいカフェを登録します</p>
        </div>
        <a href="{{ route('admin.cafes.index') }}" class="btn btn-ghost">
            ← 一覧に戻る
        </a>
    </div>
</div>

<div class="card fade-in">
    <form method="POST" action="{{ route('admin.cafes.store') }}" enctype="multipart/form-data">
        @csrf
        <div class="form-grid">
            <!-- Name -->
            <div class="form-group">
                <label class="form-label" for="name">カフェ名 *</label>
                <input class="form-input" type="text" id="name" name="name" value="{{ old('name') }}" placeholder="例: The Workplace Cafe" required>
                @error('name') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Price -->
            <div class="form-group">
                <label class="form-label" for="price">予算</label>
                <input class="form-input" type="text" id="price" name="price" value="{{ old('price') }}" placeholder="例: ₱150〜">
                @error('price') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Vibe JA -->
            <div class="form-group">
                <label class="form-label" for="vibe_ja">バイブ（日本語）</label>
                <input class="form-input" type="text" id="vibe_ja" name="vibe_ja" value="{{ old('vibe_ja') }}" placeholder="例: #集中 #爆速WiFi">
                @error('vibe_ja') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Vibe EN -->
            <div class="form-group">
                <label class="form-label" for="vibe_en">バイブ（英語）</label>
                <input class="form-input" type="text" id="vibe_en" name="vibe_en" value="{{ old('vibe_en') }}" placeholder="例: #Focus #FastWiFi">
                @error('vibe_en') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Description JA -->
            <div class="form-group full-width">
                <label class="form-label" for="desc_ja">説明（日本語）</label>
                <textarea class="form-textarea" id="desc_ja" name="desc_ja" placeholder="日本語の説明文...">{{ old('desc_ja') }}</textarea>
                @error('desc_ja') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Description EN -->
            <div class="form-group full-width">
                <label class="form-label" for="desc_en">説明（英語）</label>
                <textarea class="form-textarea" id="desc_en" name="desc_en" placeholder="English description...">{{ old('desc_en') }}</textarea>
                @error('desc_en') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Hours -->
            <div class="form-group">
                <label class="form-label" for="hours">営業時間 *</label>
                <input class="form-input" type="text" id="hours" name="hours" value="{{ old('hours') }}" placeholder="例: 8:00 – 23:00" required>
                @error('hours') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- 24h -->
            <div class="form-group">
                <div class="form-check">
                    <input type="checkbox" id="is_24h" name="is_24h" {{ old('is_24h') ? 'checked' : '' }}>
                    <label for="is_24h">24時間営業</label>
                </div>
            </div>

            <!-- WiFi -->
            <div class="form-group">
                <label class="form-label" for="wifi">WiFi レベル *</label>
                <select class="form-select" id="wifi" name="wifi" required>
                    <option value="EXCELLENT" {{ old('wifi') === 'EXCELLENT' ? 'selected' : '' }}>EXCELLENT</option>
                    <option value="GOOD" {{ old('wifi', 'GOOD') === 'GOOD' ? 'selected' : '' }}>GOOD</option>
                    <option value="AVERAGE" {{ old('wifi') === 'AVERAGE' ? 'selected' : '' }}>AVERAGE</option>
                    <option value="NOT_EXIST" {{ old('wifi') === 'NOT_EXIST' ? 'selected' : '' }}>NOT EXIST</option>
                </select>
                @error('wifi') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Outlet -->
            <div class="form-group">
                <label class="form-label" for="outlet">電源 *</label>
                <select class="form-select" id="outlet" name="outlet" required>
                    <option value="YES" {{ old('outlet') === 'YES' ? 'selected' : '' }}>YES</option>
                    <option value="LIMITED" {{ old('outlet') === 'LIMITED' ? 'selected' : '' }}>LIMITED</option>
                    <option value="NO" {{ old('outlet', 'NO') === 'NO' ? 'selected' : '' }}>NO</option>
                </select>
                @error('outlet') <div class="form-error">{{ $message }}</div> @enderror
            </div>


            <!-- Map URL -->
            <div class="form-group">
                <label class="form-label" for="map_url">Google Maps URL</label>
                <input class="form-input" type="url" id="map_url" name="map_url" value="{{ old('map_url') }}" placeholder="https://maps.google.com/...">
                @error('map_url') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Tags -->
            <div class="form-group">
                <label class="form-label" for="tags">タグ</label>
                <input class="form-input" type="text" id="tags" name="tags" value="{{ old('tags') }}" placeholder="例: 作業向き, デート向き, 24時間">
                <div class="form-hint">カンマ区切りで入力してください</div>
                @error('tags') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- 📍 Location & Card Info -->
            <div class="form-group full-width" style="margin-top: 30px; margin-bottom: 10px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
                <h3 style="font-size: 15px; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 8px;">
                    <span>📍</span> 位置情報 ＆ カード基本情報 (おすすめ・席数・雰囲気・こんな時に)
                </h3>
            </div>

            <div class="form-group">
                <label class="form-label" for="lat">緯度 (Latitude)</label>
                <input class="form-input" type="number" step="any" id="lat" name="lat" value="{{ old('lat') }}" placeholder="例: 10.330800">
                @error('lat') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <div class="form-group">
                <label class="form-label" for="lng">経度 (Longitude)</label>
                <input class="form-input" type="number" step="any" id="lng" name="lng" value="{{ old('lng') }}" placeholder="例: 123.905600">
                @error('lng') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- おすすめ ☕ -->
            <div class="form-group">
                <label class="form-label" for="menu_ja">おすすめメニュー（日本語） ☕</label>
                <input class="form-input" type="text" id="menu_ja" name="menu_ja" value="{{ old('menu_ja') }}" placeholder="例: トリュフパン, カフェラテ">
                @error('menu_ja') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <div class="form-group">
                <label class="form-label" for="menu_en">おすすめメニュー（英語） ☕</label>
                <input class="form-input" type="text" id="menu_en" name="menu_en" value="{{ old('menu_en') }}" placeholder="例: Truffle Bread, Caffe Latte">
                @error('menu_en') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- 席数 🪑 -->
            <div class="form-group">
                <label class="form-label" for="seats_ja">席数（日本語） 🪑</label>
                <input class="form-input" type="text" id="seats_ja" name="seats_ja" value="{{ old('seats_ja') }}" placeholder="例: 約50席, カウンター席あり">
                @error('seats_ja') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <div class="form-group">
                <label class="form-label" for="seats_en">席数（英語） 🪑</label>
                <input class="form-input" type="text" id="seats_en" name="seats_en" value="{{ old('seats_en') }}" placeholder="例: Approx. 50 seats, Solo seats available">
                @error('seats_en') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- 雰囲気 🔊 (内部カラム: noise_ja/noise_en) -->
            <div class="form-group">
                <label class="form-label" for="noise_ja">雰囲気（日本語） 🔊</label>
                <input class="form-input" type="text" id="noise_ja" name="noise_ja" value="{{ old('noise_ja') }}" placeholder="例: 非常に静か, 会話控えめ">
                @error('noise_ja') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <div class="form-group">
                <label class="form-label" for="noise_en">雰囲気（英語） 🔊</label>
                <input class="form-input" type="text" id="noise_en" name="noise_en" value="{{ old('noise_en') }}" placeholder="例: Very quiet, low voice">
                @error('noise_en') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- こんな時に ✨ -->
            <div class="form-group">
                <label class="form-label" for="best_ja">こんな時に（日本語） ✨</label>
                <input class="form-input" type="text" id="best_ja" name="best_ja" value="{{ old('best_ja') }}" placeholder="例: 一人で集中・勉強向き">
                @error('best_ja') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <div class="form-group">
                <label class="form-label" for="best_en">こんな時に（英語） ✨</label>
                <input class="form-input" type="text" id="best_en" name="best_en" value="{{ old('best_en') }}" placeholder="例: Solo focus, study session">
                @error('best_en') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- 💡 Tips -->
            <div class="form-group full-width" style="margin-top: 30px; margin-bottom: 10px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
                <h3 style="font-size: 15px; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 8px;">
                    <span>💡</span> Tips（豆知識・注意点）
                </h3>
            </div>

            <div class="form-group full-width">
                <label class="form-label" for="tips_ja">Tips（日本語）</label>
                <input class="form-input" type="text" id="tips_ja" name="tips_ja" value="{{ old('tips_ja') }}" placeholder="例: 冷房が強力なので上着必須。">
                @error('tips_ja') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <div class="form-group full-width">
                <label class="form-label" for="tips_en">Tips（英語）</label>
                <input class="form-input" type="text" id="tips_en" name="tips_en" value="{{ old('tips_en') }}" placeholder="例: Strong AC — bring a hoodie.">
                @error('tips_en') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- 📋 Specs -->
            <div class="form-group full-width" style="margin-top: 30px; margin-bottom: 10px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
                <h3 style="font-size: 15px; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 8px;">
                    <span>📋</span> Specs（詳細な仕様情報）
                </h3>
            </div>

            <!-- Specs Atmosphere -->
            <div class="form-group">
                <label class="form-label" for="specs_atmosphere">雰囲気</label>
                <select class="form-select" id="specs_atmosphere" name="specs[atmosphere]">
                    <option value="落ち着いた" {{ old('specs.atmosphere') === '落ち着いた' ? 'selected' : '' }}>落ち着いた</option>
                    <option value="おしゃれ" {{ old('specs.atmosphere') === 'おしゃれ' ? 'selected' : '' }}>おしゃれ</option>
                    <option value="にぎやか" {{ old('specs.atmosphere') === 'にぎやか' ? 'selected' : '' }}>にぎやか</option>
                </select>
                @error('specs.atmosphere') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs BGM -->
            <div class="form-group">
                <label class="form-label" for="specs_bgm">BGM</label>
                <select class="form-select" id="specs_bgm" name="specs[bgm]">
                    <option value="あり（小さめ）" {{ old('specs.bgm') === 'あり（小さめ）' ? 'selected' : '' }}>あり（小さめ）</option>
                    <option value="あり（大きめ）" {{ old('specs.bgm') === 'あり（大きめ）' ? 'selected' : '' }}>あり（大きめ）</option>
                    <option value="なし" {{ old('specs.bgm') === 'なし' ? 'selected' : '' }}>なし</option>
                </select>
                @error('specs.bgm') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs Call -->
            <div class="form-group">
                <label class="form-label" for="specs_call">通話ルール</label>
                <select class="form-select" id="specs_call" name="specs[call]">
                    <option value="イヤホン推奨" {{ old('specs.call') === 'イヤホン推奨' ? 'selected' : '' }}>イヤホン推奨</option>
                    <option value="OK" {{ old('specs.call') === 'OK' ? 'selected' : '' }}>OK</option>
                    <option value="不可" {{ old('specs.call') === '不可' ? 'selected' : '' }}>不可</option>
                </select>
                @error('specs.call') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs Seats Total -->
            <div class="form-group">
                <label class="form-label" for="specs_seats_total">総席数</label>
                <input class="form-input" type="number" min="0" id="specs_seats_total" name="specs[seats_total]" value="{{ old('specs.seats_total') }}" placeholder="例: 50">
                @error('specs.seats_total') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs Solo Seat -->
            <div class="form-group">
                <label class="form-label" for="specs_solo_seat">一人席</label>
                <select class="form-select" id="specs_solo_seat" name="specs[solo_seat]">
                    <option value="1" {{ old('specs.solo_seat') === '1' ? 'selected' : '' }}>あり</option>
                    <option value="0" {{ old('specs.solo_seat') === '0' ? 'selected' : '' }}>なし</option>
                </select>
                @error('specs.solo_seat') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs Toilet -->
            <div class="form-group">
                <label class="form-label" for="specs_toilet">トイレ</label>
                <select class="form-select" id="specs_toilet" name="specs[toilet]">
                    <option value="1" {{ old('specs.toilet', '1') === '1' ? 'selected' : '' }}>あり</option>
                    <option value="0" {{ old('specs.toilet') === '0' ? 'selected' : '' }}>なし</option>
                </select>
                @error('specs.toilet') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs WiFi Available -->
            <div class="form-group">
                <label class="form-label" for="specs_wifi_available">Wi-Fi有無</label>
                <select class="form-select" id="specs_wifi_available" name="specs[wifi_available]">
                    <option value="1" {{ old('specs.wifi_available', '1') === '1' ? 'selected' : '' }}>あり</option>
                    <option value="0" {{ old('specs.wifi_available') === '0' ? 'selected' : '' }}>なし</option>
                </select>
                @error('specs.wifi_available') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs WiFi Limit -->
            <div class="form-group">
                <label class="form-label" for="specs_wifi_limit">Wi-Fi利用制限</label>
                <input class="form-input" type="text" id="specs_wifi_limit" name="specs[wifi_limit]" value="{{ old('specs.wifi_limit') }}" placeholder="例: 120分, なし">
                @error('specs.wifi_limit') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs Cashless Available -->
            <div class="form-group">
                <label class="form-label" for="specs_cashless_available">キャッシュレス決済</label>
                <select class="form-select" id="specs_cashless_available" name="specs[cashless_available]">
                    <option value="1" {{ old('specs.cashless_available', '1') === '1' ? 'selected' : '' }}>利用可</option>
                    <option value="0" {{ old('specs.cashless_available') === '0' ? 'selected' : '' }}>不可</option>
                </select>
                @error('specs.cashless_available') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs Outlet Detail -->
            <div class="form-group">
                <label class="form-label" for="specs_outlet_detail">コンセント詳細</label>
                <select class="form-select" id="specs_outlet_detail" name="specs[outlet_detail]">
                    <option value="全席対応" {{ old('specs.outlet_detail') === '全席対応' ? 'selected' : '' }}>全席対応</option>
                    <option value="一部席のみ" {{ old('specs.outlet_detail') === '一部席のみ' ? 'selected' : '' }}>一部席のみ</option>
                    <option value="なし" {{ old('specs.outlet_detail') === 'なし' ? 'selected' : '' }}>なし</option>
                </select>
                @error('specs.outlet_detail') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Specs Seat Types (Checkbox) -->
            <div class="form-group full-width">
                <label class="form-label">席タイプ *</label>
                <div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 12px 16px; background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                    @php
                        $oldSeatTypes = old('specs.seat_types', []);
                    @endphp
                    <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: var(--text-secondary);">
                        <input type="checkbox" name="specs[seat_types][]" value="カウンター" {{ in_array('カウンター', $oldSeatTypes) ? 'checked' : '' }} style="width: 16px; height: 16px; accent-color: var(--accent);">
                        カウンター
                    </label>
                    <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: var(--text-secondary);">
                        <input type="checkbox" name="specs[seat_types][]" value="テーブル" {{ in_array('テーブル', $oldSeatTypes) ? 'checked' : '' }} style="width: 16px; height: 16px; accent-color: var(--accent);">
                        テーブル
                    </label>
                    <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: var(--text-secondary);">
                        <input type="checkbox" name="specs[seat_types][]" value="ソファ" {{ in_array('ソファ', $oldSeatTypes) ? 'checked' : '' }} style="width: 16px; height: 16px; accent-color: var(--accent);">
                        ソファ
                    </label>
                    <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: var(--text-secondary);">
                        <input type="checkbox" name="specs[seat_types][]" value="テラス" {{ in_array('テラス', $oldSeatTypes) ? 'checked' : '' }} style="width: 16px; height: 16px; accent-color: var(--accent);">
                        テラス
                    </label>
                </div>
                @error('specs.seat_types') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Photo Upload & URLs -->
            <div class="form-group full-width">
                <label class="form-label" style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--accent);">
                    <span>📸 写真管理</span>
                </label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px; background: rgba(255, 255, 255, 0.02); border: 1px dashed var(--border-subtle); border-radius: var(--radius); margin-top: 8px;">
                    <!-- Upload -->
                    <div>
                        <label class="form-label" for="new_photos">ローカル画像アップロード</label>
                        <input class="form-input" type="file" id="new_photos" name="new_photos[]" accept="image/*" multiple style="padding: 8px 12px;">
                        <div class="form-hint">複数選択して一度にアップロードできます（最大3MB / jpeg, png, jpg, webp）</div>
                        @error('new_photos.*') <div class="form-error">{{ $message }}</div> @enderror
                    </div>
                    <!-- External URLs -->
                    <div>
                        <label class="form-label" for="photo_urls">外部画像URL（改行区切り）</label>
                        <textarea class="form-textarea" id="photo_urls" name="photo_urls" placeholder="https://images.unsplash.com/photo-...&#10;https://images.unsplash.com/photo-..." style="min-height: 84px; font-family: monospace; font-size: 11px;">{{ old('photo_urls') }}</textarea>
                        <div class="form-hint">UnsplashなどのWeb上の画像URLを1行に1つずつ入力してください</div>
                        @error('photo_urls') <div class="form-error">{{ $message }}</div> @enderror
                    </div>
                </div>
            </div>

            <!-- Accent Color -->
            <div class="form-group">
                <label class="form-label" for="accent">アクセントカラー</label>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <input class="form-input" type="color" id="accent" name="accent" value="{{ old('accent', '#2ABFBF') }}" style="width: 50px; height: 40px; padding: 4px; cursor: pointer;">
                    <span id="accent-value" style="font-size: 12px; font-family: monospace; color: var(--text-muted);">{{ old('accent', '#2ABFBF') }}</span>
                </div>
                @error('accent') <div class="form-error">{{ $message }}</div> @enderror
            </div>

            <!-- Submit -->
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">☕ カフェを登録</button>
                <a href="{{ route('admin.cafes.index') }}" class="btn btn-ghost">キャンセル</a>
            </div>
        </div>
    </form>
</div>

<script>
    document.getElementById('accent').addEventListener('input', function() {
        document.getElementById('accent-value').textContent = this.value;
    });
</script>
@endsection
