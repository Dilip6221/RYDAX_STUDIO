<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Otp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'regex:/^[6-9]\d{9}$/'],
        ]);

        $phone = $request->phone;
        $lastOtp = Otp::where('phone', $phone)->latest('id')->first();

        $resendCount = 0;
        if ($lastOtp) {
            $createdTime = $lastOtp->created_at->timestamp;
            $now = now()->timestamp;
            $diffSeconds = $now - $createdTime;

            if ($diffSeconds < 60) {
                $remaining = 60 - $diffSeconds;
                return response()->json([
                    'success' => false,
                    'message' => "Wait {$remaining}s to resend OTP"
                ], 429);
            }

            if ($diffSeconds <= 120) {
                if (($lastOtp->resend_count ?? 0) >= 3) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Too many OTP requests. Try again after some time.'
                    ], 429);
                }
                $resendCount = ($lastOtp->resend_count ?? 0) + 1;
            }
        }

        // Generate 6 digit OTP
        $otp = (string) rand(100000, 999999);
        $otpHash = Hash::make($otp);

        Otp::where('phone', $phone)->where('is_used', false)->update(['is_used' => true]);

        Otp::create([
            'phone' => $phone,
            'otp_hash' => $otpHash,
            'resend_count' => $resendCount,
            'attempts' => 0,
            'max_attempts' => 5,
            'is_used' => false,
            'expires_at' => now()->addMinutes(5),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        Log::info("RYDAX OTP Generated for {$phone}: {$otp}");
        error_log("\n====================================\n>>> RYDAX OTP for {$phone}: {$otp} <<<\n====================================\n");

        return response()->json([
            'success' => true,
            'message' => 'OTP Sent successfully',
            'debug_otp' => config('app.debug') ? $otp : null,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'regex:/^[6-9]\d{9}$/'],
            'otp' => ['required', 'digits:6'],
        ]);

        $phone = $request->phone;
        $otp = $request->otp;

        $otpRecord = Otp::where('phone', $phone)
            ->where('is_used', false)
            ->latest('id')
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'success' => false,
                'message' => 'OTP not found'
            ]);
        }

        if ($otpRecord->attempts >= $otpRecord->max_attempts) {
            return response()->json([
                'success' => false,
                'message' => 'Too many attempts'
            ]);
        }

        if ($otpRecord->expires_at && $otpRecord->expires_at->isPast()) {
            $otpRecord->update(['is_used' => true]);
            return response()->json([
                'success' => false,
                'message' => 'OTP expired'
            ]);
        }

        if (!Hash::check($otp, $otpRecord->otp_hash)) {
            $otpRecord->increment('attempts');
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP'
            ]);
        }

        $otpRecord->update(['is_used' => true]);

        $user = User::where('phone', $phone)->first();

        if ($user && $user->is_profile_complete) {
            $user->update([
                'last_login_at' => now(),
                'login_count' => ($user->login_count ?? 0) + 1,
                'status' => 'ACTIVE',
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'isNewUser' => false,
                'token' => $token,
                'user' => $user,
            ]);
        }

        return response()->json([
            'success' => true,
            'isNewUser' => true,
            'phone' => $phone,
            'profileToken' => base64_encode(json_encode(['phone' => $phone, 'time' => time()])),
        ]);
    }

    public function completeProfile(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'regex:/^[6-9]\d{9}$/'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $phone = $request->phone;
        $name = trim($request->name);
        $role = in_array($request->role, ['USER', 'STAFF', 'ADMIN']) ? $request->role : 'USER';

        $user = User::firstOrNew(['phone' => $phone]);
        $user->name = $name;
        if (!$user->exists || ($request->user() && $request->user()->role === 'ADMIN')) {
            $user->role = $role;
        }
        $user->is_profile_complete = true;
        $user->status = 'ACTIVE';
        $user->last_login_at = now();
        $user->login_count = ($user->login_count ?? 0) + 1;
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Thank You for registering',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()?->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}
