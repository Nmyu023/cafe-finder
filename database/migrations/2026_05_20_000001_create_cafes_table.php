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
         Schema::create('cafes', function (Blueprint $table) {
             $table->id();
             $table->string('name');
             $table->string('vibe_ja')->nullable();
             $table->string('vibe_en')->nullable();
             $table->text('desc_ja')->nullable();
             $table->text('desc_en')->nullable();
             $table->string('hours');
             $table->boolean('is_24h')->default(false);
             $table->string('wifi')->default('AVERAGE'); // EXCELLENT, GOOD, AVERAGE, NOT_EXIST
             $table->string('outlet')->default('NO');    // YES, LIMITED, NO
             $table->string('price')->nullable();
             $table->string('tips_ja')->nullable();
             $table->string('tips_en')->nullable();
             $table->string('map_url')->nullable();
             $table->decimal('lat', 10, 8)->nullable();
             $table->decimal('lng', 11, 8)->nullable();
             $table->json('photos')->nullable();
             $table->boolean('is_user_added')->default(false);
             $table->json('tags')->nullable();
             $table->string('accent')->default('#3A3A3A');
             $table->timestamps();
         });
     }

     /**
      * Reverse the migrations.
      */
     public function down(): void
     {
         Schema::dropIfExists('cafes');
     }
};
