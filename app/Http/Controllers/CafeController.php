<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CafeController extends Controller
{
    /**
     * API: カフェ一覧取得（最適化版）
     */
    public function apiIndex()
    {
        // N+1クエリを防ぐため、eager loading を使用
        $cafes = Cafe::with(['reviews' => function ($query) {
            $query->select('id', 'cafe_id', 'stars', 'crowd', 'tags', 'created_at', 'deleted_at')
                  ->whereNull('deleted_at');
        }])
        ->orderBy('sort_order')
        ->orderBy('id')
        ->get();

        return response()->json(['cafes' => $cafes]);
    }

    /**
     * API: カフェの新規投稿（画像付き）
     */
    public function apiStore(Request $request)
    {
        $user = $request->user();
        $oldBadge = $user ? $user->badge : null;

        // 1. バリデーション（セキュリティ＆データの妥当性チェック）
        $request->validate([
            'name' => 'required|string|max:255',
            'area' => 'nullable|string|max:100',
            'desc' => 'nullable|string|max:1000',
            'tips' => 'nullable|string|max:1000',
            'hours' => 'nullable|string|max:100',
            'wifi' => 'required|string|in:EXCELLENT,GOOD,AVERAGE,NOT_EXIST',
            'outlet' => 'required|string|in:YES,LIMITED,NO',
            'price' => 'nullable|string|max:100',
            'vibe' => 'nullable|string|max:255',
            'lat' => 'required|numeric|between:9.8,10.8',   // セブ島周辺のみに座標入力を制限
            'lng' => 'required|numeric|between:123.5,124.5',
            'photos' => 'nullable|array|max:3',            // 最大3枚まで
            'photos.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:3072', // 画像偽装防止＆最大3MB
            'specs' => 'nullable|string',
        ]);

        // 2. 画像の保存処理
        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $image) {
                $photoPaths[] = ImageUploadService::upload($image, 'cafes');
            }
        }

        // 3. データの登録
        $accentColors = ['#1B4F8A', '#8B5E3C', '#A87550', '#2D5016', '#4A7B6F', '#5C4A8A', '#1B6B8A', '#3A3A3A'];
        $accent = $accentColors[array_rand($accentColors)];

        // ハッシュタグのパース（カンマや空白で区切られたものを配列にする）
        $tags = [];
        if ($request->wifi === 'EXCELLENT') {
            $tags[] = '作業向き';
        }
        if ($request->hours === '24時間営業' || $request->hours === '24h') {
            $tags[] = '24時間';
        }

        // specs をJSON文字列からデコードして保存
        $specs = $request->specs;
        if (is_string($specs)) {
            $specs = json_decode($specs, true);
        }
        
        if (isset($specs['cashless_available']) && $specs['cashless_available'] == '1') {
            $tags[] = 'キャッシュレス';
        }

        $cafe = Cafe::create([
            'user_id' => $request->user()->id ?? null,
            'name' => $request->name,
            'vibe_ja' => $request->vibe ? $request->vibe : '#ユーザー投稿',
            'vibe_en' => $request->vibe ? $request->vibe : '#UserPost',
            'desc_ja' => $request->desc,
            'desc_en' => $request->desc,
            'hours' => $request->hours ?? '不明',
            'is_24h' => ($request->hours === '24時間営業' || $request->hours === '24h' || $request->hours === '24時間'),
            'wifi' => $request->wifi,
            'outlet' => $request->outlet,
            'price' => $request->price ?? '₱???〜',
            'tips_ja' => $request->tips,
            'tips_en' => $request->tips,
            'lat' => $request->lat,
            'lng' => $request->lng,
            'photos' => $photoPaths,
            'is_user_added' => true,
            'tags' => $tags,
            'accent' => $accent,
            'specs' => $specs,
        ]);

        $rankedUp = false;
        $newBadge = null;
        if ($user) {
            $newBadge = $user->fresh()->badge;
            $rankedUp = $oldBadge !== $newBadge && $newBadge !== null;
        }

        return response()->json([
            'message' => 'カフェを登録しました！',
            'cafe' => $cafe,
            'ranked_up' => $rankedUp,
            'new_badge' => $newBadge,
        ], 201);
    }

    /**
     * API: リアルタイム混雑状況の報告
     */
    public function reportCrowdStatus(Request $request, Cafe $cafe)
    {
        $request->validate([
            'status' => 'required|string|in:empty,crowded',
        ]);

        $user = $request->user();

        $oldBadge = $user->badge;

        // CrowdReportを作成
        \App\Models\CrowdReport::create([
            'user_id' => $user->id,
            'cafe_id' => $cafe->id,
            'status' => $request->status,
        ]);

        // カフェの現在の混雑状況を更新
        $cafe->update([
            'current_crowd_status' => $request->status,
            'crowd_updated_at' => now(),
        ]);

        // 新しいバッジを計算するために、リレーションをリロードせずに新鮮なインスタンスを取得
        $newBadge = $user->fresh()->badge;
        $rankedUp = $oldBadge !== $newBadge && $newBadge !== null;

        return response()->json([
            'message' => '混雑状況を報告しました！',
            'current_crowd_status' => $cafe->current_crowd_status,
            'crowd_updated_at' => $cafe->crowd_updated_at,
            'ranked_up' => $rankedUp,
            'new_badge' => $newBadge,
        ]);
    }
}
