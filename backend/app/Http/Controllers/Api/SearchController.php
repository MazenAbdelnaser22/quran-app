<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ayah;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['total' => 0, 'results' => []]);
        }

        $clean = $this->normalize($q);

        // نهرّب علامات LIKE الخاصة عشان % و _ ما يتعاملوش كرموز بحث
        $escaped = addcslashes($clean, '%_\\');

        $query = Ayah::query()
            ->where('text_clean', 'like', "%{$escaped}%");

        $total = $query->count();

        $results = $query
            ->with('surah:id,name_ar')
            ->orderBy('number')
            ->limit(50)
            ->get()
            ->map(fn ($a) => [
                'id'              => $a->id,
                'surah_id'        => $a->surah_id,
                'surah_name'      => $a->surah->name_ar,
                'number_in_surah' => $a->number_in_surah,
                'text'            => $a->text,
            ]);

        return response()->json([
            'total'   => $total,
            'results' => $results,
        ]);
    }

    /**
     * نفس تنظيف الـ Seeder: يشيل التشكيل ويوحّد الألف والياء
     */
    private function normalize(string $text): string
    {
        $text = preg_replace(
            '/[\x{0610}-\x{061A}\x{064B}-\x{065F}\x{0670}\x{06D6}-\x{06ED}\x{0640}]/u',
            '',
            $text
        );
        $text = str_replace(['أ', 'إ', 'آ', 'ٱ'], 'ا', $text);
        $text = str_replace('ى', 'ي', $text);

        return trim($text);
    }
}