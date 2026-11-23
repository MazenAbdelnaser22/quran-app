<?php

namespace Database\Seeders;

use App\Models\Ayah;
use App\Models\Surah;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class QuranSeeder extends Seeder
{
    private const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

    public function run(): void
    {
        $path = database_path('data/quran.json');

        if (! File::exists($path)) {
            $this->command->error('Run: php artisan quran:fetch first');
            return;
        }

        $surahs = json_decode(File::get($path), true);

        DB::transaction(function () use ($surahs) {
            Ayah::query()->delete();
            Surah::query()->delete();

            foreach ($surahs as $s) {
                Surah::create([
                    'id'               => $s['number'],
                    'name_ar'          => $s['name'],
                    'name_en'          => $s['englishName'],
                    'name_translation' => $s['englishNameTranslation'],
                    'revelation_type'  => $s['revelationType'],
                    'ayahs_count'      => count($s['ayahs']),
                ]);

                $rows = [];
                $now = now();

                foreach ($s['ayahs'] as $a) {
                    $text = $a['text'];

                    // الفاتحة (1) والتوبة (9): ما نلمسهمش
                    if ($s['number'] !== 1 && $s['number'] !== 9 && $a['numberInSurah'] === 1) {
                        $text = $this->stripBasmala($text);
                    }

                    $rows[] = [
                        'surah_id'        => $s['number'],
                        'number_in_surah' => $a['numberInSurah'],
                        'number'          => $a['number'],
                        'juz'             => $a['juz'],
                        'page'            => $a['page'],
                        'text'            => $text,
                        'text_clean'      => $this->clean($text),
                        'created_at'      => $now,
                        'updated_at'      => $now,
                    ];
                }

                Ayah::insert($rows);
            }
        });

        $this->command->info('Seeded: ' . Surah::count() . ' surahs, ' . Ayah::count() . ' ayahs');
    }

    /**
     * يشيل التشكيل وعلامات الوقف ويوحّد الحروف (للبحث)
     */
    private function clean(string $text): string
    {
        $text = preg_replace('/[\x{0610}-\x{061A}\x{064B}-\x{065F}\x{0670}\x{06D6}-\x{06ED}\x{0640}]/u', '', $text);

        $text = str_replace(['أ', 'إ', 'آ', 'ٱ'], 'ا', $text);
        $text = str_replace('ى', 'ي', $text);

        return trim($text);
    }

    /**
     * يشيل البسملة من بداية أول آية (لو موجودة)
     */
    private function stripBasmala(string $text): string
{
    $words = preg_split('/\s+/u', trim($text));

    // لازم يكون فيه كلمة بعد البسملة، وأول كلمة "بسم"
    if (count($words) > 4 && $this->clean($words[0]) === 'بسم') {
        return trim(implode(' ', array_slice($words, 4)));
    }

    return $text;
}
}