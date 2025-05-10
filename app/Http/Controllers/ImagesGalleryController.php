<?php

namespace App\Http\Controllers;

use App\Models\ImageGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImagesGalleryController extends Controller
{
    private function clearGalleryCache()
    {
        Cache::flush();
    }

    private function getPaginatedImages(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 12);

        $search = $request->input('search');

        $cacheKey = 'images_gallery_' . md5($search . "_page_$page" . "_perPage_$perPage");

        return Cache::remember($cacheKey, now()->addMinutes(180), function () use ($request, $search, $perPage) {

            $query = ImageGallery::query();

            if (!empty($search)) {

                $query->where(function ($query) use ($search) {
                    $query->where('file_name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('alt_text', 'like', "%{$search}%");
                });
            }

            $query->orderBy('created_at', 'desc');

            return $query->paginate($perPage)->appends($request->except('page'));
        });
    }

    public function loadGalleryModal(Request $request)
    {
        $images = $this->getPaginatedImages($request);

        $isCurrentPageGreaterThanLast = $images->currentPage() > $images->lastPage();

        if ($isCurrentPageGreaterThanLast) {

            return response()->json([
                'redirect' => url()->current() . '?page=' . $images->lastPage(),
            ]);
        }

        if ($request->ajax()) {

            return response()->json([
                'view' => view('images-gallery.content.gallery-list', compact('images'))->render(),
                'pagination' => view('images-gallery.pagination.index', compact('images'))->render(),
            ]);
        }

        return view('images-gallery.external-module.gallery-modal', compact('images'));
    }

    public function demonstrationButtonsPage()
    {
        return view('demonstration-buttons-page.index');
    }

    public function index(Request $request)
    {
        $images = $this->getPaginatedImages($request);
        $search = $request->input('search', '');

        $isCurrentPageGreaterThanLast = $images->currentPage() > $images->lastPage();


        if ($isCurrentPageGreaterThanLast && !($request->ajax())) {

            return redirect()->to(url()->current() . '?page=' . $images->lastPage());
        }

        if ($isCurrentPageGreaterThanLast && $request->ajax()) {

            return response()->json([
                'redirect' => url()->current() . '?page=' . $images->lastPage(),
            ]);
        }

        if ($request->ajax()) {

            return response()->json([
                'view' => view('images-gallery.content.gallery-list', compact('images'))->render(),
                'pagination' => view('images-gallery.pagination.index', compact('images'))->render(),
            ]);
        }

        return view('images-gallery.index', compact('images', 'search'));
    }


    public function store(Request $request)
    {
        $isLoggedUser = auth()->check();

        // Custom validation messages in Portuguese
        $messages = [
            'images.*.required' => 'Image is required.',
            'images.*.image' => 'File must be a valid image.',
            'images.*.mimes' => 'Image must belong to one of the types: jpeg, png, jpg, ou gif.',
            'images.*.max' => 'Image can\'t be greater than 2MB.',
        ];

        // Validate the request with the custom messages
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
            'alt_text' => 'nullable|string',
        ], $messages);

        $uploadedImages = [];

        $files = $request->file('images');

        if (empty($files)) return response()->json([
            'error' => true,
            'message' => 'Failed sending image!'
        ], 422);

        if ($isLoggedUser) {

            foreach ($files as $file) {

                $fileName =
                    uniqid() . '_' . $file->getClientOriginalName();

                // Move file to public/uploads/gallery
                $file->move(public_path('uploads/gallery'), $fileName);

                // $filePath = $file->store('images/gallery', 'public');

                $filePath = 'uploads/gallery/' . $fileName;

                $image = ImageGallery::create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $filePath,
                    'description' => $request->input('description'),
                    'alt_text' => $request->input('alt_text'),
                ]);

                $uploadedImages[] = $image;
            }
        }

        // Generate HTML view for the uploaded images
        $view = view('images-gallery.content.gallery-list', ['images' => $uploadedImages, 'uploadRequest' => true])->render();

        $successMessage = $isLoggedUser ? 'Images send successfully!' : 'Only signed in users can send images';

        $this->clearGalleryCache();

        return response()->json([
            'view_items' => $view,
            'success' => true,
            'message' => $successMessage,
            'isLoggedUser' => $isLoggedUser,
        ]);
    }

    public function show($id)
    {
        $imageGallery = ImageGallery::find($id);

        if (!$imageGallery) {
            return response()->json(['error' => true, 'message' => 'Item not found'], 404);
        }

        return response()->json([
            'id' => $imageGallery->id,
            'description' => $imageGallery->description,
            'alt_text' => $imageGallery->alt_text,
            'file_path' => $imageGallery->file_path
        ]);
    }

    public function update(Request $request, $id)
    {
        $isLoggedUser = auth()->check();

        if (!$isLoggedUser) return response()->json([
            'success' => false,
            'message' => 'Only signed in users can update images',
            'isLoggedUser' => $isLoggedUser,
        ]);

        $image = ImageGallery::find($id);

        Log::info($request->all());

        if (!$image) return response()->json(['error' => true, 'message' => 'Item not found'], 404);

        try {

            $validatedData = $request->validate([
                'file_name' => 'nullable|string|max:255',
                'file_path' => 'nullable|string',
                'description' => 'nullable|string',
                'alt_text' => 'nullable|string',

                'image' => 'nullable|string',
                'image_name' => 'nullable|string',
                'image_type' => 'nullable|string'
            ]);

            // Handle base64 image file
            if ($request->has('image')) {

                // Remove the old image file if it exists
                if ($image->file_path && File::exists(public_path($image->file_path))) {
                    $oldFileName = basename($image->file_path);

                    // Check if the filename starts with a unique ID followed by underscore
                    if (preg_match('/^\w+_/', $oldFileName)) {
                        File::delete(public_path($image->file_path));
                    }
                }

                // Decode base64 image
                $imageData = $request->input('image');
                $imageData = base64_decode($imageData);

                // Get original file name and extension
                $fileName = $request->input('image_name');
                $fileType = $request->input('image_type');

                $fileName = uniqid() . '_' . $fileName;

                // Generate file path with original name and extension
                // $filePath = 'images/gallery/' . $fileName;
                // Storage::put($path, $imageData);
                // Storage::disk('public')->put($filePath, $imageData);

                $filePath = 'uploads/gallery/' . $fileName;

                $uploadPath = public_path($filePath);

                // Ensure directory exists
                if (!File::exists(public_path('uploads/gallery'))) {

                    File::makeDirectory(public_path('uploads/gallery'), 0755, true);
                }

                // Save the image
                file_put_contents($uploadPath, $imageData);

                $validatedData['file_name'] = $fileName;
                $validatedData['file_path'] = $filePath;
            }

            $image->update($validatedData);

            // Refresh the image to get the latest state
            $image->refresh();

            $this->clearGalleryCache();

            // Return only the updated image data
            return response()->json([
                'success' => true,
                'message' => 'Image updated successfully!',
                'updated_image' => $image,
                'isLoggedUser' => $isLoggedUser,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => true, 'error' => $e->errors()], 422);
        }
    }


    public function destroy($id)
    {
        $isLoggedUser = auth()->check();

        if (!$isLoggedUser) return response()->json([
            'success' => false,
            'message' => 'Only signed in users can delete images',
            'isLoggedUser' => $isLoggedUser,
        ]);

        try {
            $image = ImageGallery::findOrFail($id);

            // Delete the file from storage
            // Storage::disk('public')->delete($image->file_path);

            // Delete the physical file from public folder
            if ($image->file_path && File::exists(public_path($image->file_path))) {
                $oldFileName = basename($image->file_path);

                // Check if the filename starts with a unique ID followed by underscore
                if (preg_match('/^\w+_/', $oldFileName)) {
                    File::delete(public_path($image->file_path));
                }
            }

            // Delete the record from the database
            $image->delete();

            $this->clearGalleryCache();

            return response()->json(['success' => true, 'message' => 'Image deleted successfully!', 'isLoggedUser' => $isLoggedUser,]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => true, 'message' => 'Image not found', 'isLoggedUser' => $isLoggedUser,], 404);
        }
    }
}
