<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Subscriber;

class SubscriberController extends Controller
{
    public function saveSubscription(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = strtolower(trim($request->email));

        $exists = Subscriber::where('email', $email)->first();
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'This email is already registered',
            ]);
        }

        Subscriber::create([
            'email' => $email,
            'status' => 'SUBSCRIBED',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for subscribing to our newsletter!',
        ]);
    }

    public function showSubscriptionData(Request $request)
    {
        $subscribers = Subscriber::latest('id')->get();
        return response()->json([
            'success' => true,
            'data' => $subscribers,
        ]);
    }
}
