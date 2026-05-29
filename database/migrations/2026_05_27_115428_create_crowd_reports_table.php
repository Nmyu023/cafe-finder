<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crowd_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cafe_id')->constrained('cafes')->onDelete('cascade');
            $table->string('status'); // 'empty' or 'crowded'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crowd_reports');
    }
};
