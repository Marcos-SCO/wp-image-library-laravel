<?php

use App\Http\Controllers\ImagesGalleryController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Gallery WP styled - start
Route::get('gallery/modal', [ImagesGalleryController::class, 'loadGalleryModal'])->name('gallery.modal');

Route::get('gallery', [ImagesGalleryController::class, 'index'])->name('gallery.index');

Route::post('gallery/upload', [ImagesGalleryController::class, 'store'])->name('gallery.store');

Route::get('gallery/{id}/show', [ImagesGalleryController::class, 'show'])->name('gallery.show');

route::put('gallery/{id}', [ImagesGalleryController::class, 'update'])->name('gallery.update');

Route::delete('gallery/{id}', [ImagesGalleryController::class, 'destroy'])->name('gallery.destroy');
  // Gallery WP styled - end