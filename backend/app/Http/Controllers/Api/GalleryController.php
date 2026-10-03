<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Gallery;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function getGalleryImages(Request $request)
    {
        $query = Gallery::where('is_active', true);

        if ($request->filled('service')) {
            $query->where('service', $request->service);
        }

        if ($request->filled('type')) {
            $query->where('type', strtoupper($request->type));
        }

        if ($request->input('featured') === 'true' || $request->input('featured') === true) {
            $query->where('is_featured', true);
        }

        $shouldPaginate = $request->has('page') || $request->has('limit');

        if (!$shouldPaginate) {
            $images = $query->orderBy('id', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $images,
            ]);
        }

        $page = max((int) $request->input('page', 1), 1);
        $limit = min(max((int) $request->input('limit', 12), 1), 48);

        $paginated = $query->orderBy('id', 'desc')->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $paginated->items(),
            'pagination' => [
                'page' => $paginated->currentPage(),
                'limit' => $limit,
                'total' => $paginated->total(),
                'hasMore' => $paginated->hasMorePages(),
            ],
        ]);
    }

    public function uploadGalleryImage(Request $request)
    {
        $request->validate([
            'service' => 'required|string',
            'type' => 'nullable|in:SINGLE,BEFORE_AFTER',
        ]);

        $service = $request->input('service');
        $title = $request->input('title', '');
        $type = strtoupper($request->input('type', 'SINGLE'));
        $description = $request->input('description', '');
        $isFeatured = $request->boolean('isFeatured') || $request->boolean('is_featured');

        $data = [
            'service' => $service,
            'title' => $title,
            'type' => $type,
            'description' => $description,
            'is_featured' => $isFeatured,
            'is_active' => true,
        ];

        if ($type === 'SINGLE') {
            if ($request->hasFile('file')) {
                $path = $request->file('file')->store("gallery/{$service}", 'public');
                $data['image_url'] = Storage::url($path);
                $data['public_id'] = $path;
            } elseif ($request->filled('imageUrl') || $request->filled('image_url')) {
                $data['image_url'] = $request->input('imageUrl') ?: $request->input('image_url');
            } else {
                return response()->json(['success' => false, 'message' => 'Image is required'], 422);
            }
        } elseif ($type === 'BEFORE_AFTER') {
            if ($request->hasFile('beforeImage') && $request->hasFile('afterImage')) {
                $bPath = $request->file('beforeImage')->store("gallery/{$service}/before", 'public');
                $aPath = $request->file('afterImage')->store("gallery/{$service}/after", 'public');
                $data['before_image_url'] = Storage::url($bPath);
                $data['before_public_id'] = $bPath;
                $data['after_image_url'] = Storage::url($aPath);
                $data['after_public_id'] = $aPath;
            } else {
                $data['before_image_url'] = $request->input('before_image_url');
                $data['after_image_url'] = $request->input('after_image_url');
            }
        }

        $gallery = Gallery::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Gallery item uploaded successfully',
            'data' => $gallery,
        ]);
    }

    public function deleteGalleryImage($id)
    {
        $gallery = Gallery::find($id);
        if (!$gallery) {
            return response()->json(['success' => false, 'message' => 'Image not found'], 404);
        }

        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery item deleted successfully',
        ]);
    }
}
