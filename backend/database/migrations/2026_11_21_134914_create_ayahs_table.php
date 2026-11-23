<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ayahs', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('surah_id');
            $table->unsignedSmallInteger('number_in_surah'); // رقم الآية داخل السورة
            $table->unsignedSmallInteger('number');          // الرقم الكلي 1-6236
            $table->unsignedSmallInteger('juz');
            $table->unsignedSmallInteger('page');
            $table->text('text');                            // النص بالتشكيل
            $table->text('text_clean')->nullable();          // النص بدون تشكيل (للبحث)
            $table->timestamps();

            $table->foreign('surah_id')->references('id')->on('surahs')->cascadeOnDelete();
            $table->unique(['surah_id', 'number_in_surah']);
            $table->index('page');
            $table->index('juz');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ayahs');
    }
};