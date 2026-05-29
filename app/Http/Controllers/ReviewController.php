<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * カフェのレビュー一覧取得
     */
    public function index(string $cafeId)
    {
        $reviews = Review::with(['user' => function($q) {
                $q->withCount(['reviews', 'crowdReports']);
            }])
            ->where('cafe_id', $cafeId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['reviews' => $reviews]);
    }

    /**
     * レビュー投稿（要ログイン）
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'ログインが必要です'], 401);
        }
        
        $oldBadge = $user->badge;

        $request->validate([
            'cafe_id' => 'required',
            'stars' => 'required|array|size:5',
            'crowd' => 'nullable|string',
            'tags' => 'nullable|array',
            'comment' => 'nullable|string|max:1000',
            'purpose' => 'nullable|string|max:255',
        ]);

        $review = Review::create([
            'user_id' => $user->id,
            'cafe_id' => $request->cafe_id,
            'user_name' => $user->name,
            'stars' => $request->stars,
            'crowd' => $request->crowd ?? '',
            'tags' => $request->tags ?? [],
            'comment' => $request->comment ?? '',
            'purpose' => $request->purpose ?? '',
        ]);

        // キャッシュを無効化
        Cache::forget('review_counts_all');
        Cache::forget('cafe_avg_rating_' . $request->cafe_id);

        $newBadge = clone $user;
        $newBadge = $newBadge->fresh()->badge;
        $rankedUp = $oldBadge !== $newBadge && $newBadge !== null;

        return response()->json([
            'message' => 'レビューを投稿しました',
            'review' => $review,
            'ranked_up' => $rankedUp,
            'new_badge' => $newBadge,
        ], 201);
    }

    /**
     * 全カフェのレビュー件数と平均評価を一括取得（最適化版：キャッシング対応）
     */
    public function counts()
    {
        // キャッシュキー
        $cacheKey = 'review_counts_all';

        // キャッシュから取得（10分間有効）
        $counts = Cache::remember($cacheKey, 600, function () {
            // データベースレベルで計算
            $results = Review::select('cafe_id')
                ->selectRaw('COUNT(*) as count')
                ->whereNull('deleted_at')
                ->groupBy('cafe_id')
                ->get();

            $counts = [];
            foreach ($results as $row) {
                $counts[$row->cafe_id] = [
                    'count' => $row->count,
                    'avg_rating' => $this->calculateAverageRating($row->cafe_id),
                ];
            }

            return $counts;
        });

        return response()->json(['counts' => $counts]);
    }

    /**
     * カフェの平均評価を計算（キャッシュ対応）
     */
    private function calculateAverageRating($cafeId)
    {
        $cacheKey = "cafe_avg_rating_{$cafeId}";

        return Cache::remember($cacheKey, 600, function () use ($cafeId) {
            $reviews = Review::where('cafe_id', $cafeId)
                ->whereNull('deleted_at')
                ->pluck('stars');

            if ($reviews->isEmpty()) {
                return null;
            }

            $allRatings = [];
            foreach ($reviews as $stars) {
                $starsArray = is_array($stars) ? $stars : json_decode($stars, true);
                if (is_array($starsArray)) {
                    $valid = array_filter($starsArray, fn($s) => $s > 0);
                    if (count($valid) > 0) {
                        $allRatings[] = array_sum($valid) / count($valid);
                    }
                }
            }

            return count($allRatings) > 0
                ? round(array_sum($allRatings) / count($allRatings), 2)
                : null;
        });
    }

    /**
     * レビュー更新（要ログイン、本人確認）
     */
    public function update(Request $request, Review $review)
    {
        if (Auth::id() !== $review->user_id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $request->validate([
            'stars' => 'required|array|size:5',
            'crowd' => 'nullable|string',
            'tags' => 'nullable|array',
            'comment' => 'nullable|string|max:1000',
            'purpose' => 'nullable|string|max:255',
        ]);

        $review->update([
            'stars' => $request->stars,
            'crowd' => $request->crowd ?? '',
            'tags' => $request->tags ?? [],
            'comment' => $request->comment ?? '',
            'purpose' => $request->purpose ?? '',
        ]);

        // キャッシュを無効化
        Cache::forget('review_counts_all');
        Cache::forget('cafe_avg_rating_' . $review->cafe_id);

        return response()->json(['review' => $review]);
    }

    /**
     * レビュー削除（要ログイン、本人確認）
     */
    public function destroy(Review $review)
    {
        if (Auth::id() !== $review->user_id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $cafeId = $review->cafe_id;
        $review->delete();

        // キャッシュを無効化
        Cache::forget('review_counts_all');
        Cache::forget('cafe_avg_rating_' . $cafeId);

        return response()->json(['message' => 'クチコミを削除しました']);
    }
}

