<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageGallery extends Model
{
    use HasFactory;

    protected $table = 'images_gallery';

    protected $fillable = [
        'file_name',
        'file_path',
        'description',
        'alt_text',
    ];
}
