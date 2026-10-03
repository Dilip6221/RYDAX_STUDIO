<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\CustomerReview;

class CustomerReviewController extends Controller
{
    public function saveCustomerReview(Request $request)
    {
        $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'review' => 'required|string',
        ]);

        $name = $request->input('name');
        if ($request->user()) {
            $name = $name ?: $request->user()->name;
        }

        if (!$name) {
            return response()->json([
                'success' => false,
                'message' => 'Name is required',
            ], 422);
        }

        $review = CustomerReview::create([
            'name' => $name,
            'phone' => $request->input('phone') ?? $request->user()?->phone,
            'rating' => $request->input('rating'),
            'review' => $request->input('review'),
            'car_model' => $request->input('car_model') ?? $request->input('car'),
            'is_verified' => true,
            'is_approved' => true, // Auto-approve for seamless preview or set to pending per moderation
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for giving us your valuable feedback!',
            'data' => $review,
        ]);
    }

    public function approveCustomerReview(Request $request, $id)
    {
        $review = CustomerReview::find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found'], 404);
        }

        $review->is_approved = true;
        $review->save();

        return response()->json([
            'success' => true,
            'message' => 'Review approved',
        ]);
    }

    public function getAllReviews(Request $request)
    {
        $query = CustomerReview::query();

        // If not admin request, show only approved
        if (!$request->user() || strtoupper($request->user()->role) !== 'ADMIN') {
            $query->where('is_approved', true);
        }

        $reviews = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }
}
