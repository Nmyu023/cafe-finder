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
            $table->integer('sort_order')->default(0)->after('accent');
        });

        // 既存のカフェにデフォルト順序を設定（ID順）
        $cafes = \App\Models\Cafe::orderBy('id')->get();
        foreach ($cafes as $index => $cafe) {
            $cafe->update(['sort_order' => $index]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cafes', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};
