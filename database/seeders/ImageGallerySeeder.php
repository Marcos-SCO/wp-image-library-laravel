<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use App\Models\ImageGallery;

class ImageGallerySeeder extends Seeder
{
    public function run()
    {
        // 🚫 Delete ALL images from 'images/gallery' folder in 'public' disk
        $galleryFolder = 'images/gallery';
        if (Storage::disk('public')->exists($galleryFolder)) {
            Storage::disk('public')->deleteDirectory($galleryFolder);
            Storage::disk('public')->makeDirectory($galleryFolder); // recreate it if needed
        }

        // 🧹 Truncate the table
        \DB::table('images_gallery')->truncate();

        // 🗂 Path to local sample images
        $sampleImageDir = resource_path('img_gallerySample');

        // 📦 Step 2: Get all image files in directory
        $imageFiles = File::files($sampleImageDir);

        foreach ($imageFiles as $file) {
            $fileName = $file->getFilename();
            $filePath = $file->getPathname();

            $nameWithoutExtension =
                pathinfo($fileName, PATHINFO_FILENAME);

            $storagePath =
                $galleryFolder . '/' . Str::random(10) . '_' . $fileName;

            // Copy to storage
            Storage::disk('public')->put($storagePath, file_get_contents($filePath));

            // Create DB record
            ImageGallery::create([
                'file_name' => $fileName,
                'file_path' => $storagePath,
                'description' => 'Sample description for ' . $nameWithoutExtension,
                'alt_text' => 'Alt text for ' . $nameWithoutExtension,
            ]);
        }
    }
}
