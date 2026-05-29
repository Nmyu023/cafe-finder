<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cafes', function (Blueprint $table) {
            $table->string('seats_ja')->nullable()->after('menu_en');
            $table->string('seats_en')->nullable()->after('seats_ja');
            $table->string('noise_ja')->nullable()->after('seats_en');
            $table->string('noise_en')->nullable()->after('noise_ja');
            $table->string('best_ja')->nullable()->after('noise_en');
            $table->string('best_en')->nullable()->after('best_ja');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cafes', function (Blueprint $table) {
            $table->dropColumn([
                'seats_ja',
                'seats_en',
                'noise_ja',
                'noise_en',
                'best_ja',
                'best_en',
            ]);
        });
    }
};
