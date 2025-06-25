<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [UserController::class, 'dashboard'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
