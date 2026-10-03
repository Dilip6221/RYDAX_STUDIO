<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\AboutTimeline;
use Illuminate\Support\Facades\Storage;

class AboutTimelineController extends Controller
{
    public function getTimeline(Request $request)
    {
        $timeline = AboutTimeline::orderBy('order', 'asc')->orderBy('year', 'asc')->get();
        return response()->json(['success' => true, 'data' => $timeline]);
    }

    public function getSingleTimeline($id)
    {
        $timeline = AboutTimeline::find($id);
        if (!$timeline) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $timeline]);
    }

    public function createTimeline(Request $request)
    {
        $request->validate([
            'year' => 'required',
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('timeline', 'public');
            $imageUrl = Storage::url($path);
        } elseif ($request->filled('image_url')) {
            $imageUrl = $request->input('image_url');
        }

        $timeline = AboutTimeline::create([
            'year' => $request->year,
            'title' => $request->title,
            'description' => $request->description,
            'order' => $request->order ?? 0,
            'image_url' => $imageUrl,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Timeline created successfully',
            'data' => $timeline,
        ]);
    }

    public function updateTimeline(Request $request)
    {
        $id = $request->input('id');
        $timeline = AboutTimeline::find($id);
        if (!$timeline) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('timeline', 'public');
            $timeline->image_url = Storage::url($path);
        }

        $timeline->year = $request->input('year', $timeline->year);
        $timeline->title = $request->input('title', $timeline->title);
        $timeline->description = $request->input('description', $timeline->description);
        $timeline->order = $request->input('order', $timeline->order);
        $timeline->save();

        return response()->json([
            'success' => true,
            'message' => 'Updated successfully',
            'data' => $timeline,
        ]);
    }

    public function deleteTimeline($id)
    {
        $timeline = AboutTimeline::find($id);
        if (!$timeline) {
            return response()->json(['success' => false, 'message' => 'Timeline not found'], 404);
        }

        $timeline->delete();

        return response()->json([
            'success' => true,
            'message' => 'Timeline deleted successfully',
        ]);
    }
}
