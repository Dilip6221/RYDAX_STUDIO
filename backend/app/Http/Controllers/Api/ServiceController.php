<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Service;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function getPublicServices(Request $request)
    {
        $limit = min(max((int) $request->input('limit', 20), 1), 50);
        $services = Service::where('status', 'ACTIVE')
            ->orderBy('id', 'asc')
            ->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $services->items(),
            'current_page' => $services->currentPage(),
            'total' => $services->total(),
        ]);
    }

    public function getAllInquiries(Request $request)
    {
        $services = Service::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $services,
        ]);
    }

    public function getSlugService($id)
    {
        $service = is_numeric($id)
            ? Service::find($id)
            : Service::where('slug', $id)->first();

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $service,
        ]);
    }

    public function createService(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'required|string',
        ]);

        $id = $request->input('id');
        $title = $request->input('title');
        $slug = Str::slug($title);

        $exists = Service::where('slug', $slug)
            ->when($id, fn($q) => $q->where('id', '!=', $id))
            ->exists();

        if ($exists) {
            $slug = $slug . '-' . uniqid();
        }

        $imageUrl = $request->input('image_url');
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('services', 'public');
            $imageUrl = Storage::url($path);
        }

        $data = [
            'title' => $title,
            'slug' => $slug,
            'short_description' => $request->input('short_description'),
            'description' => $request->input('description'),
            'icon' => $request->input('icon', ''),
            'category' => $request->input('category', ''),
            'duration' => $request->input('duration', ''),
            'status' => $request->input('status', 'ACTIVE'),
            'packages' => is_string($request->input('packages')) ? json_decode($request->input('packages'), true) : $request->input('packages'),
            'faqs' => is_string($request->input('faqs')) ? json_decode($request->input('faqs'), true) : $request->input('faqs'),
            'interactive_sections' => is_string($request->input('interactive_sections')) ? json_decode($request->input('interactive_sections'), true) : $request->input('interactive_sections'),
        ];

        if ($imageUrl) {
            $data['image_url'] = $imageUrl;
        }

        if ($id) {
            $service = Service::find($id);
            if (!$service) {
                return response()->json(['success' => false, 'message' => 'Service not found'], 404);
            }
            $service->update($data);
            return response()->json([
                'success' => true,
                'message' => 'Service updated successfully',
                'data' => $service,
            ]);
        }

        if (!isset($data['image_url'])) {
            $data['image_url'] = '/images/services/default.jpg';
        }

        $service = Service::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'data' => $service,
        ]);
    }

    public function updateServiceStatus(Request $request, $id = null)
    {
        $serviceId = $id ?? $request->input('serviceId') ?? $request->input('id');
        $status = $request->input('status');

        if (!$serviceId || !$status) {
            return response()->json(['success' => false, 'message' => 'Service ID and status are required'], 422);
        }

        $service = Service::find($serviceId);
        if (!$service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        $service->status = $status;
        $service->save();

        return response()->json([
            'success' => true,
            'message' => "Service status changed to {$status}",
        ]);
    }

    public function deleteService($id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully',
        ]);
    }

    public function uploadServiceMedia(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['success' => false, 'message' => 'File required'], 400);
        }

        $path = $request->file('file')->store('services/media', 'public');
        $url = Storage::url($path);

        return response()->json([
            'success' => true,
            'data' => [
                'url' => $url,
                'public_id' => $path,
            ],
        ]);
    }
}
