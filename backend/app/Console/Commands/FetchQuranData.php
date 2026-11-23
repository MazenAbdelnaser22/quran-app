<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;

class FetchQuranData extends Command
{
    protected $signature = 'quran:fetch';
    protected $description = 'Download Quran data and save it as JSON';

    public function handle(): int
    {
        $this->info('Downloading Quran (uthmani)...');

        $response = Http::timeout(120)
            ->get('https://api.alquran.cloud/v1/quran/quran-uthmani');

        if (! $response->successful()) {
            $this->error('Request failed: ' . $response->status());
            return self::FAILURE;
        }

        $surahs = $response->json('data.surahs');

        if (! is_array($surahs) || count($surahs) !== 114) {
            $this->error('Unexpected data format.');
            return self::FAILURE;
        }

        File::ensureDirectoryExists(database_path('data'));
        File::put(
            database_path('data/quran.json'),
            json_encode($surahs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
        );

        $ayahsTotal = collect($surahs)->sum(fn ($s) => count($s['ayahs']));
        $this->info("Saved 114 surahs and {$ayahsTotal} ayahs to database/data/quran.json");

        return self::SUCCESS;
    }
}