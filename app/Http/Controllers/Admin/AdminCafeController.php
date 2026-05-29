<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cafe;
use App\Models\Review;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class AdminCafeController extends Controller
{
    /**
     * Display a listing of cafes.
     */
    public function index()
    {
        $cafes = Cafe::withCount('reviews')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(50);

        // 各カフェの平均評価を計算
        $cafeIds = $cafes->pluck('id');
        $avgRatings = [];
        $reviews = Review::whereIn('cafe_id', $cafeIds)->whereNull('deleted_at')->get();
        foreach ($reviews->groupBy('cafe_id') as $cafeId => $cafeReviews) {
            $allAvgs = [];
            foreach ($cafeReviews as $r) {
                $stars = is_array($r->stars) ? $r->stars : json_decode($r->stars, true);
                if (is_array($stars)) {
                    $valid = array_filter($stars, fn($s) => $s > 0);
                    if (count($valid) > 0) {
                        $allAvgs[] = array_sum($valid) / count($valid);
                    }
                }
            }
            $avgRatings[$cafeId] = count($allAvgs) > 0 ? round(array_sum($allAvgs) / count($allAvgs), 1) : null;
        }

        return view('admin.cafes.index', compact('cafes', 'avgRatings'));
    }

    /**
     * Show the form for creating a new cafe.
     */
    public function create()
    {
        return view('admin.cafes.create');
    }

    /**
     * Store a newly created cafe.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'vibe_ja' => ['nullable', 'string', 'max:255'],
            'vibe_en' => ['nullable', 'string', 'max:255'],
            'desc_ja' => ['nullable', 'string'],
            'desc_en' => ['nullable', 'string'],
            'hours' => ['required', 'string', 'max:255'],
            'is_24h' => ['nullable'],
            'wifi' => ['required', 'in:EXCELLENT,GOOD,AVERAGE,NOT_EXIST'],
            'outlet' => ['required', 'in:YES,LIMITED,NO'],
            'price' => ['nullable', 'string', 'max:255'],
            'menu_ja' => ['nullable', 'string', 'max:255'],
            'menu_en' => ['nullable', 'string', 'max:255'],
            'seats_ja' => ['nullable', 'string', 'max:255'],
            'seats_en' => ['nullable', 'string', 'max:255'],
            'noise_ja' => ['nullable', 'string', 'max:255'],
            'noise_en' => ['nullable', 'string', 'max:255'],
            'best_ja' => ['nullable', 'string', 'max:255'],
            'best_en' => ['nullable', 'string', 'max:255'],
            'tips_ja' => ['nullable', 'string', 'max:500'],
            'tips_en' => ['nullable', 'string', 'max:500'],
            'map_url' => ['nullable', 'url', 'max:500'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'tags' => ['nullable', 'string'],
            'accent' => ['nullable', 'string', 'max:7'],
            'new_photos' => ['nullable', 'array'],
            'new_photos.*' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'photo_urls' => ['nullable', 'string'],
            'specs' => ['nullable', 'array'],
        ]);

        $validated['is_24h'] = $request->has('is_24h');
        $validated['tags'] = $request->tags
            ? array_map('trim', explode(',', $request->tags))
            : [];

        // Parse and assign specs array
        $specs = $request->input('specs', []);
        $cashless = isset($specs['cashless_available']) ? filter_var($specs['cashless_available'], FILTER_VALIDATE_BOOLEAN) : false;
        if ($cashless && !in_array('キャッシュレス', $validated['tags'])) {
            $validated['tags'][] = 'キャッシュレス';
        }

        $validated['specs'] = [
            'atmosphere' => $specs['atmosphere'] ?? null,
            'bgm' => $specs['bgm'] ?? null,
            'call' => $specs['call'] ?? null,
            'seats_total' => isset($specs['seats_total']) ? intval($specs['seats_total']) : null,
            'seat_types' => $specs['seat_types'] ?? [],
            'solo_seat' => isset($specs['solo_seat']) ? filter_var($specs['solo_seat'], FILTER_VALIDATE_BOOLEAN) : false,
            'toilet' => isset($specs['toilet']) ? filter_var($specs['toilet'], FILTER_VALIDATE_BOOLEAN) : false,
            'wifi_available' => isset($specs['wifi_available']) ? filter_var($specs['wifi_available'], FILTER_VALIDATE_BOOLEAN) : false,
            'wifi_limit' => $specs['wifi_limit'] ?? null,
            'cashless_available' => $cashless,
            'outlet_detail' => $specs['outlet_detail'] ?? null,
        ];

        $photoPaths = [];

        // 1. 新しいアップロード画像の処理
        if ($request->hasFile('new_photos')) {
            foreach ($request->file('new_photos') as $image) {
                $photoPaths[] = ImageUploadService::upload($image, 'cafes');
            }
        }

        // 2. 外部URL画像の処理
        if ($request->photo_urls) {
            $urls = array_filter(array_map('trim', explode("\n", $request->photo_urls)));
            foreach ($urls as $url) {
                if (filter_var($url, FILTER_VALIDATE_URL)) {
                    $photoPaths[] = $url;
                }
            }
        }

        $validated['photos'] = $photoPaths;

        Cafe::create($validated);

        return redirect()->route('admin.cafes.index')
            ->with('success', 'カフェを追加しました。');
    }

    /**
     * Show the form for editing a cafe.
     */
    public function edit(Cafe $cafe)
    {
        return view('admin.cafes.edit', compact('cafe'));
    }

    /**
     * Update the specified cafe.
     */
    public function update(Request $request, Cafe $cafe)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'vibe_ja' => ['nullable', 'string', 'max:255'],
            'vibe_en' => ['nullable', 'string', 'max:255'],
            'desc_ja' => ['nullable', 'string'],
            'desc_en' => ['nullable', 'string'],
            'hours' => ['required', 'string', 'max:255'],
            'is_24h' => ['nullable'],
            'wifi' => ['required', 'in:EXCELLENT,GOOD,AVERAGE,NOT_EXIST'],
            'outlet' => ['required', 'in:YES,LIMITED,NO'],
            'price' => ['nullable', 'string', 'max:255'],
            'menu_ja' => ['nullable', 'string', 'max:255'],
            'menu_en' => ['nullable', 'string', 'max:255'],
            'seats_ja' => ['nullable', 'string', 'max:255'],
            'seats_en' => ['nullable', 'string', 'max:255'],
            'noise_ja' => ['nullable', 'string', 'max:255'],
            'noise_en' => ['nullable', 'string', 'max:255'],
            'best_ja' => ['nullable', 'string', 'max:255'],
            'best_en' => ['nullable', 'string', 'max:255'],
            'tips_ja' => ['nullable', 'string', 'max:500'],
            'tips_en' => ['nullable', 'string', 'max:500'],
            'map_url' => ['nullable', 'url', 'max:500'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'tags' => ['nullable', 'string'],
            'accent' => ['nullable', 'string', 'max:7'],
            'new_photos' => ['nullable', 'array'],
            'new_photos.*' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'photo_urls' => ['nullable', 'string'],
            'specs' => ['nullable', 'array'],
        ]);

        $validated['is_24h'] = $request->has('is_24h');
        $validated['tags'] = $request->tags
            ? array_map('trim', explode(',', $request->tags))
            : [];

        // Parse and assign specs array
        $specs = $request->input('specs', []);
        $cashless = isset($specs['cashless_available']) ? filter_var($specs['cashless_available'], FILTER_VALIDATE_BOOLEAN) : false;
        if ($cashless && !in_array('キャッシュレス', $validated['tags'])) {
            $validated['tags'][] = 'キャッシュレス';
        }

        $validated['specs'] = [
            'atmosphere' => $specs['atmosphere'] ?? null,
            'bgm' => $specs['bgm'] ?? null,
            'call' => $specs['call'] ?? null,
            'seats_total' => isset($specs['seats_total']) ? intval($specs['seats_total']) : null,
            'seat_types' => $specs['seat_types'] ?? [],
            'solo_seat' => isset($specs['solo_seat']) ? filter_var($specs['solo_seat'], FILTER_VALIDATE_BOOLEAN) : false,
            'toilet' => isset($specs['toilet']) ? filter_var($specs['toilet'], FILTER_VALIDATE_BOOLEAN) : false,
            'wifi_available' => isset($specs['wifi_available']) ? filter_var($specs['wifi_available'], FILTER_VALIDATE_BOOLEAN) : false,
            'wifi_limit' => $specs['wifi_limit'] ?? null,
            'cashless_available' => $cashless,
            'outlet_detail' => $specs['outlet_detail'] ?? null,
        ];

        $photoPaths = $cafe->photos ?? [];

        // 1. 既存写真の削除処理
        if ($request->has('delete_photos')) {
            $photoPaths = array_values(array_diff($photoPaths, $request->delete_photos));
        }

        // 2. 新しいアップロード画像の処理
        if ($request->hasFile('new_photos')) {
            foreach ($request->file('new_photos') as $image) {
                $photoPaths[] = ImageUploadService::upload($image, 'cafes');
            }
        }

        // 3. 外部URL画像の処理
        if ($request->photo_urls) {
            $urls = array_filter(array_map('trim', explode("\n", $request->photo_urls)));
            foreach ($urls as $url) {
                if (filter_var($url, FILTER_VALIDATE_URL)) {
                    $photoPaths[] = $url;
                }
            }
        }

        $validated['photos'] = $photoPaths;

        $cafe->update($validated);

        return redirect()->route('admin.cafes.index')
            ->with('success', 'カフェ情報を更新しました。');
    }

    /**
     * Remove the specified cafe.
     */
    public function destroy(Cafe $cafe)
    {
        $cafe->delete();

        return redirect()->route('admin.cafes.index')
            ->with('success', 'カフェを削除しました。');
    }

    /**
     * Display per-cafe statistics.
     */
    public function stats(Cafe $cafe)
    {
        $reviews = Review::where('cafe_id', $cafe->id)
            ->whereNull('deleted_at')
            ->latest()
            ->get();

        $reviewCount = $reviews->count();

        // 各評価項目の平均
        $ratingLabels = ['Wi-Fi速度', '電源の充実', '静粛性', 'コスパ', '雰囲気'];
        $categoryAvgs = array_fill(0, 5, null);
        $overallAvg = null;

        if ($reviewCount > 0) {
            for ($i = 0; $i < 5; $i++) {
                $vals = $reviews->map(function ($r) use ($i) {
                    $stars = is_array($r->stars) ? $r->stars : json_decode($r->stars, true);
                    return is_array($stars) && isset($stars[$i]) && $stars[$i] > 0 ? $stars[$i] : null;
                })->filter()->values();
                $categoryAvgs[$i] = $vals->count() > 0 ? round($vals->avg(), 1) : null;
            }
            $validAvgs = array_filter($categoryAvgs);
            $overallAvg = count($validAvgs) > 0 ? round(array_sum($validAvgs) / count($validAvgs), 1) : null;
        }

        // 混雑度の分布
        $crowdDist = $reviews->where('crowd', '!=', '')->groupBy('crowd')->map->count();

        // 人気タグ
        $tagFreq = [];
        foreach ($reviews as $r) {
            $tags = is_array($r->tags) ? $r->tags : json_decode($r->tags, true);
            if (is_array($tags)) {
                foreach ($tags as $tag) {
                    $tagFreq[$tag] = ($tagFreq[$tag] ?? 0) + 1;
                }
            }
        }
        arsort($tagFreq);

        // 訪問目的の分布
        $purposeDist = $reviews->where('purpose', '!=', '')->groupBy('purpose')->map->count();

        return view('admin.cafes.stats', compact(
            'cafe', 'reviews', 'reviewCount', 'ratingLabels',
            'categoryAvgs', 'overallAvg', 'crowdDist', 'tagFreq', 'purposeDist'
        ));
    }

    /**
     * Update cafe ordering via AJAX.
     */
    public function updateOrder(Request $request)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:cafes,id'],
        ]);

        foreach ($request->order as $index => $cafeId) {
            Cafe::where('id', $cafeId)->update(['sort_order' => $index]);
        }

        return response()->json(['success' => true]);
    }
}
