<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'is_admin'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    protected $appends = ['badge'];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function crowdReports()
    {
        return $this->hasMany(CrowdReport::class);
    }

    public function cafes()
    {
        return $this->hasMany(Cafe::class);
    }

    public function getBadgeAttribute()
    {
        // それぞれの件数を取得
        $reviewsCount = array_key_exists('reviews_count', $this->attributes) ? $this->attributes['reviews_count'] : $this->reviews()->count();
        $crowdCount = array_key_exists('crowd_reports_count', $this->attributes) ? $this->attributes['crowd_reports_count'] : $this->crowdReports()->count();
        $cafesCount = array_key_exists('cafes_count', $this->attributes) ? $this->attributes['cafes_count'] : $this->cafes()->count();

        // ランクの重みを定義
        $rankMap = ['none' => 0, 'bronze' => 1, 'silver' => 2, 'gold' => 3];
        $ranks = ['none', 'bronze', 'silver', 'gold'];

        // 各カテゴリーのランクを計算
        // 1. カフェ登録: ブロンズ(1), シルバー(5), ゴールド(10)
        $cafeRank = 'none';
        if ($cafesCount >= 10) $cafeRank = 'gold';
        elseif ($cafesCount >= 5) $cafeRank = 'silver';
        elseif ($cafesCount >= 1) $cafeRank = 'bronze';

        // 2. 混雑状況: ブロンズ(10), シルバー(30), ゴールド(50)
        $crowdRank = 'none';
        if ($crowdCount >= 50) $crowdRank = 'gold';
        elseif ($crowdCount >= 30) $crowdRank = 'silver';
        elseif ($crowdCount >= 10) $crowdRank = 'bronze';

        // 3. レビュー投稿: ブロンズ(3), シルバー(10), ゴールド(20)
        $reviewRank = 'none';
        if ($reviewsCount >= 20) $reviewRank = 'gold';
        elseif ($reviewsCount >= 10) $reviewRank = 'silver';
        elseif ($reviewsCount >= 3) $reviewRank = 'bronze';

        // 最高のランクを採用する
        $maxRankValue = max($rankMap[$cafeRank], $rankMap[$crowdRank], $rankMap[$reviewRank]);

        return $maxRankValue > 0 ? $ranks[$maxRankValue] : null;
    }
}
