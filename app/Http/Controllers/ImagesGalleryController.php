<?php

namespace App\Http\Controllers;

use App\Models\ImageGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImagesGalleryController extends Controller
{
    private function getPaginatedImages(Request $request)
    {
        $query = ImageGallery::query();

        $search = $request->input('search');

        if (!empty($search)) {

            $query->where(function ($query) use ($search) {
                $query->where('file_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%");
            });
        }

        $query->orderBy('created_at', 'desc');

        $perPage = $request->input('per_page', 12);
        return $query->paginate($perPage)->appends($request->except('page'));
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
            'error' => 'Failed in send image!'
        ], 422);

        foreach ($files as $file) {

            $filePath = $file->store('images/gallery', 'public');

            $image = ImageGallery::create([
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'description' => $request->input('description'),
                'alt_text' => $request->input('alt_text'),
            ]);

            $uploadedImages[] = $image;
        }

        // Generate HTML view for the uploaded images
        $view = view('images-gallery.content.gallery-list', ['images' => $uploadedImages, 'uploadRequest' => true])->render();

        return response()->json([
            'view_items' => $view,
            'success' => 'Images send successfully!'
        ]);
    }

    public function show($id)
    {
        $imageGallery = ImageGallery::find($id);

        if (!$imageGallery) {
            return response()->json(['error' => 'Item not found'], 404);
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
        $image = ImageGallery::find($id);

        Log::info($request->all());

        if (!$image) return response()->json(['error' => 'Item not found'], 404);

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
                // Decode base64 image
                $imageData = $request->input('image');
                $imageData = base64_decode($imageData);

                // Get original file name and extension
                $fileName = $request->input('image_name');
                $fileType = $request->input('image_type');

                $timestamp = now()->format('YmdHis');

                $fileRandomName = $timestamp . '.' . $fileName;

                // Generate file path with original name and extension
                $path = 'images/gallery/' . $fileRandomName;
                // Storage::put($path, $imageData);

                // Save the file
                Storage::disk('public')->put($path, $imageData);

                $validatedData['file_name'] = $fileName;
                $validatedData['file_path'] = $path;
            }

            $image->update($validatedData);

            // Refresh the image to get the latest state
            $image->refresh();

            // Return only the updated image data
            return response()->json([
                'success' => true,
                'updated_image' => $image,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }


    public function destroy($id)
    {
        try {
            $image = ImageGallery::findOrFail($id);

            // Delete the file from storage
            Storage::disk('public')->delete($image->file_path);

            // Delete the record from the database
            $image->delete();

            return response()->json(['success' => 'Image deleted successfully!']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Image not found'], 404);
        }
    }
}
