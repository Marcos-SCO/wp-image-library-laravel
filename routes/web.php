<?php

use App\Http\Controllers\ImagesGalleryController;
use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Route;

// Auth - start
Route::get('/login', [LoginController::class, 'index'])->name('login');

Route::post('/login', [LoginController::class, 'login']);

Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
// Auth - end

// Gallery WP styled - start
Route::get('gallery/modal', [ImagesGalleryController::class, 'loadGalleryModal'])->name('gallery.modal');

Route::get('/', [ImagesGalleryController::class, 'index'])->name('gallery.index');

Route::get('/demonstration-buttons-page', [ImagesGalleryController::class, 'demonstrationButtonsPage'])->name('gallery.demonstrationButtonsPage');

Route::get('gallery', [ImagesGalleryController::class, 'index'])->name('gallery.index');

Route::post('gallery/upload', [ImagesGalleryController::class, 'store'])->name('gallery.store');

Route::get('gallery/{id}/show', [ImagesGalleryController::class, 'show'])->name('gallery.show');

route::put('gallery/{id}', [ImagesGalleryController::class, 'update'])->name('gallery.update');

Route::delete('gallery/{id}', [ImagesGalleryController::class, 'destroy'])->name('gallery.destroy');
  // Gallery WP styled - end