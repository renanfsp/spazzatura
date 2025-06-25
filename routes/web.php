<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Api\PricesController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('/api/v1')->group(function () {
    Route::resource('prices', PricesController::class)->only([
        'index'
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
