<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Support endpoints called without /api prefix
Route::prefix('')->group(base_path('routes/api.php'));
