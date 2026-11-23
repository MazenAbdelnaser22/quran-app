<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Surah extends Model
{
    public $incrementing = false;

    protected $fillable = [
        'id', 'name_ar', 'name_en', 'name_translation',
        'revelation_type', 'ayahs_count',
    ];

    public function ayahs(): HasMany
    {
        return $this->hasMany(Ayah::class);
    }
}