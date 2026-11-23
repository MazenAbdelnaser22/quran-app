<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SurahController;
use App\Http\Controllers\Api\SearchController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');




   Route::get('/surahs', [SurahController::class, 'index']);
   Route::get('/surahs/{id}', [SurahController::class, 'show'])->whereNumber('id');
   Route::get('/search', [SearchController::class, 'index']);

