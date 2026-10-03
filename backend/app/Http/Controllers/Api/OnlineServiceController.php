<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\OnlineServiceCategory;
use App\Models\OnlineService;
use App\Models\OnlineServicePackage;
use App\Models\OnlineServiceAddon;
use Illuminate\Support\Str;

class OnlineServiceController extends Controller
{
    // Category methods
    public function createCategory(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $slug = Str::slug($request->name);

        $category = OnlineServiceCategory::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'image_url' => $request->image ?? $request->image_url,
            'status' => $request->status ?? 'ACTIVE',
        ]);

        return response()->json(['success' => true, 'message' => 'Category created successfully', 'data' => $category]);
    }

    public function getCategories(Request $request)
    {
        $categories = OnlineServiceCategory::latest('id')->get();
        return response()->json(['success' => true, 'data' => $categories]);
    }

    public function getCategoryById($id)
    {
        $category = OnlineServiceCategory::find($id);
        if (!$category) return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        return response()->json(['success' => true, 'data' => $category]);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = OnlineServiceCategory::find($id);
        if (!$category) return response()->json(['success' => false, 'message' => 'Category not found'], 404);

        $data = $request->only(['name', 'description', 'status']);
        if ($request->filled('name')) {
            $data['slug'] = Str::slug($request->name);
        }
        if ($request->has('image') || $request->has('image_url')) {
            $data['image_url'] = $request->image ?? $request->image_url;
        }

        $category->update($data);
        return response()->json(['success' => true, 'message' => 'Category updated', 'data' => $category]);
    }

    public function deleteCategory($id)
    {
        $category = OnlineServiceCategory::find($id);
        if (!$category) return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        $category->delete();
        return response()->json(['success' => true, 'message' => 'Category deleted']);
    }

    // Service methods
    public function createService(Request $request)
    {
        $request->validate([
            'categoryId' => 'required',
            'name' => 'required|string',
        ]);

        $service = OnlineService::create([
            'online_service_category_id' => $request->categoryId,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'image' => $request->image,
            'description' => $request->description,
        ]);

        return response()->json(['success' => true, 'message' => 'Service created', 'data' => $service]);
    }

    public function getServices(Request $request)
    {
        $query = OnlineService::with('category');
        if ($request->filled('categoryId')) {
            $query->where('online_service_category_id', $request->categoryId);
        }
        $services = $query->latest('id')->get();
        return response()->json(['success' => true, 'data' => $services]);
    }

    public function getServiceById($id)
    {
        $service = OnlineService::with('category')->find($id);
        if (!$service) return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        return response()->json(['success' => true, 'data' => $service]);
    }

    public function updateService(Request $request, $id)
    {
        $service = OnlineService::find($id);
        if (!$service) return response()->json(['success' => false, 'message' => 'Service not found'], 404);

        $data = $request->only(['name', 'image', 'description', 'status']);
        if ($request->filled('categoryId')) {
            $data['online_service_category_id'] = $request->categoryId;
        }
        if ($request->filled('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        $service->update($data);
        return response()->json(['success' => true, 'message' => 'Service updated', 'data' => $service]);
    }

    public function deleteService($id)
    {
        $service = OnlineService::find($id);
        if (!$service) return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        $service->delete();
        return response()->json(['success' => true, 'message' => 'Service deleted']);
    }

    // Package methods
    public function createPackage(Request $request)
    {
        $package = OnlineServicePackage::create([
            'online_service_id' => $request->serviceId,
            'name' => $request->name,
            'price' => $request->price ?? 0,
            'features' => $request->features,
        ]);
        return response()->json(['success' => true, 'data' => $package]);
    }

    public function getPackages(Request $request)
    {
        $packages = OnlineServicePackage::latest('id')->get();
        return response()->json(['success' => true, 'data' => $packages]);
    }

    public function getPackageById($id)
    {
        $package = OnlineServicePackage::find($id);
        if (!$package) return response()->json(['success' => false, 'message' => 'Package not found'], 404);
        return response()->json(['success' => true, 'data' => $package]);
    }

    public function updatePackage(Request $request, $id)
    {
        $package = OnlineServicePackage::find($id);
        if (!$package) return response()->json(['success' => false, 'message' => 'Package not found'], 404);
        $package->update($request->only(['name', 'price', 'features']));
        return response()->json(['success' => true, 'data' => $package]);
    }

    public function deletePackage($id)
    {
        $package = OnlineServicePackage::find($id);
        if ($package) $package->delete();
        return response()->json(['success' => true, 'message' => 'Package deleted']);
    }

    // Addon methods
    public function createAddon(Request $request)
    {
        $addon = OnlineServiceAddon::create([
            'online_service_id' => $request->serviceId,
            'name' => $request->name,
            'price' => $request->price ?? 0,
            'description' => $request->description,
        ]);
        return response()->json(['success' => true, 'data' => $addon]);
    }

    public function getAddons(Request $request)
    {
        $addons = OnlineServiceAddon::latest('id')->get();
        return response()->json(['success' => true, 'data' => $addons]);
    }

    public function getAddonById($id)
    {
        $addon = OnlineServiceAddon::find($id);
        if (!$addon) return response()->json(['success' => false, 'message' => 'Addon not found'], 404);
        return response()->json(['success' => true, 'data' => $addon]);
    }

    public function updateAddon(Request $request, $id)
    {
        $addon = OnlineServiceAddon::find($id);
        if (!$addon) return response()->json(['success' => false, 'message' => 'Addon not found'], 404);
        $addon->update($request->only(['name', 'price', 'description']));
        return response()->json(['success' => true, 'data' => $addon]);
    }

    public function deleteAddon($id)
    {
        $addon = OnlineServiceAddon::find($id);
        if ($addon) $addon->delete();
        return response()->json(['success' => true, 'message' => 'Addon deleted']);
    }
}
