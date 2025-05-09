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

        /* if (Storage::disk('public')->exists($galleryFolder)) {
            Storage::disk('public')->deleteDirectory($galleryFolder);
            Storage::disk('public')->makeDirectory($galleryFolder); // recreate it if needed
        } */

        // $galleryFolder = 'images/gallery';
        $galleryFolder = public_path('uploads/gallery');

        // 🚫 Delete ALL images from 'public/uploads/gallery'
        if (File::exists($galleryFolder)) {
            File::deleteDirectory($galleryFolder);
        }

        // ✅ Recreate folder
        File::makeDirectory($galleryFolder, 0755, true);

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

            // $storagePath = $galleryFolder . '/' . Str::random(10) . '_' . $fileName;

            $newFileName = Str::random(10) . '_' . $fileName;
            $destinationPath = $galleryFolder . '/' . $newFileName;

            // Copy to storage
            // Storage::disk('public')->put($storagePath, file_get_contents($filePath));

            // Copy file to public/uploads/gallery
            File::copy($filePath, $destinationPath);

            // Create DB record
            ImageGallery::create([
                'file_name' => $fileName,
                // 'file_path' => $storagePath,
                'file_path' => 'uploads/gallery/' . $newFileName,
                'description' => 'Sample description for ' . $nameWithoutExtension,
                'alt_text' => 'Alt text for ' . $nameWithoutExtension,
            ]);
        }
    }
}
