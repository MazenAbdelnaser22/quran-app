<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Surah;

class SurahController extends Controller
{
    // قايمة السور
    public function index()
    {
        return response()->json(
            Surah::orderBy('id')->get()
        );
    }

    // سورة واحدة بآياتها
    public function show(int $id)
    {
        $surah = Surah::with(['ayahs' => fn ($q) => $q->orderBy('number_in_surah')])
            ->findOrFail($id);

        return response()->json($surah);
    }
}