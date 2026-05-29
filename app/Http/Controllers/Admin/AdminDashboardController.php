<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cafe;
use Illuminate\Support\Facades\Cache;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard with statistics.
     */
    public function index()
    {
        // キャッシュから取得（30分間有効）
        $stats = Cache::remember('admin_dashboard_stats', 1800, function () {
            return [
                'totalCafes' => Cafe::count(),
                'cafes24h' => Cafe::where('is_24h', true)->count(),
                'avgPrice' => $this->calculateAveragePrice(),
                'wifiExcellent' => Cafe::where('wifi', 'EXCELLENT')->count(),
                'wifiGood' => Cafe::where('wifi', 'GOOD')->count(),
                'wifiAverage' => Cafe::where('wifi', 'AVERAGE')->count(),
                'wifiNotExist' => Cafe::where('wifi', 'NOT_EXIST')->count(),
                'outletYes' => Cafe::where('outlet', 'YES')->count(),
                'outletLimited' => Cafe::where('outlet', 'LIMITED')->count(),
                'outletNo' => Cafe::where('outlet', 'NO')->count(),
                'allTags' => Cafe::all()->pluck('tags')->flatten()->countBy()->toArray(),
            ];
        });

        // 最近追加されたカフェ（キャッシュなし：常に最新）
        $recentCafes = Cafe::latest()->take(5)->get();

        return view('admin.dashboard', array_merge($stats, [
            'recentCafes' => $recentCafes,
        ]));
    }

    /**
     * 平均予算を計算
     */
    private function calculateAveragePrice()
    {
        return Cafe::all()->avg(function ($cafe) {
            return (int) preg_replace('/[^0-9]/', '', $cafe->price ?: '0');
        });
    }
}
