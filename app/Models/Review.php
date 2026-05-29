<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'cafe_id', 'user_name', 'stars', 'crowd', 'tags', 'comment', 'purpose'];
    protected $casts = ['stars' => 'array', 'tags' => 'array'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cafe()
    {
        return $this->belongsTo(Cafe::class);
    }
}
