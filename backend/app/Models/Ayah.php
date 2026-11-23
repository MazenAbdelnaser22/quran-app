<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ayah extends Model
{
    protected $fillable = [
        'surah_id', 'number_in_surah', 'number',
        'juz', 'page', 'text', 'text_clean',
    ];

    public function surah(): BelongsTo
    {
        return $this->belongsTo(Surah::class);
    }
}