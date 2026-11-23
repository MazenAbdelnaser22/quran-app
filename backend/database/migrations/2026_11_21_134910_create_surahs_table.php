<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surahs', function (Blueprint $table) {
            $table->unsignedSmallInteger('id')->primary(); // رقم السورة 1-114
            $table->string('name_ar');                     // الفاتحة
            $table->string('name_en');                     // Al-Fatihah
            $table->string('name_translation')->nullable();// The Opening
            $table->string('revelation_type');             // Meccan / Medinan
            $table->unsignedSmallInteger('ayahs_count');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surahs');
    }
};