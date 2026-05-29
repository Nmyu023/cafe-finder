<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cafe extends Model
{
    protected $fillable = [
        'name',
        'vibe_ja',
        'vibe_en',
        'desc_ja',
        'desc_en',
        'hours',
        'is_24h',
        'wifi',
        'outlet',
        'specs',
        'price',
        'price_from',
        'menu_ja',
        'menu_en',
        'seats_ja',
        'seats_en',
        'noise_ja',
        'noise_en',
        'best_ja',
        'best_en',
        'tips_ja',
        'tips_en',
        'map_url',
        'lat',
        'lng',
        // 'photos' はDB内ではJSON文字列として保存され、モデル上は配列(array)としてキャストされます。
        // 例: ['https://example.com/image.jpg', '/images/local-cafe.png']
        'photos',
        'is_user_added',
        'tags',
        'accent',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'photos' => 'array',
            'is_24h' => 'boolean',
            'is_user_added' => 'boolean',
            'specs' => 'array',
        ];
    }

    /**
     * リレーション: このカフェに対するレビュー一覧
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
