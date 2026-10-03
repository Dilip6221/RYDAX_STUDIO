<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Inquiry;
use App\Models\Subscriber;
use App\Models\Service;
use App\Models\UserCar;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function getUserData(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    public function logoutUser(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()?->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => 'required|min:6',
            'confirmPassword' => 'required|same:newPassword',
        ]);

        $user = $request->user();

        if ($user->password && !Hash::check($request->currentPassword, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully',
        ]);
    }

    public function allUsers(Request $request)
    {
        $users = User::latest('id')->get();
        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    public function updateUserData(Request $request)
    {
        $id = $request->input('_id') ?? $request->input('id');
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User Not Found'], 404);
        }

        $user->name = $request->input('name', $user->name);
        $user->phone = $request->input('phone', $user->phone);
        $user->role = $request->input('role', $user->role);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
        ]);
    }

    public function changeUserStatus(Request $request)
    {
        $id = $request->input('userId') ?? $request->input('id');
        $status = $request->input('status');

        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User Not Found'], 404);
        }

        $user->status = $status;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
        ]);
    }

    public function getDashboardDataCount(Request $request)
    {
        $totalEmployees = User::count();
        $totalStaff = User::whereIn('role', ['STAFF', 'ADMIN'])->count();
        $totalCustomers = User::where('role', 'USER')->count();
        $totalInquiries = Inquiry::count();
        $pendingInquiries = Inquiry::where('status', 'NEW')->orWhere('status', 'PENDING')->count();
        $completedInquiries = Inquiry::where('status', 'RESOLVED')->count();
        $cancelledInquiries = 0;
        $subscribeUser = Subscriber::where('status', 'SUBSCRIBED')->count();
        $unsubscribeUser = Subscriber::where('status', 'UNSUBSCRIBED')->count();
        $services = Service::where('status', 'ACTIVE')->count();
        $userCars = UserCar::count();

        return response()->json([
            'success' => true,
            'data' => [
                'totalEmployees' => $totalEmployees,
                'totalCustomers' => $totalCustomers,
                'totalStaff' => $totalStaff,
                'totalInquiries' => $totalInquiries,
                'pendingInquiries' => $pendingInquiries,
                'completedInquiries' => $completedInquiries,
                'cancelledInquiries' => $cancelledInquiries,
                'subscribeUser' => $subscribeUser,
                'unsubscribeUser' => $unsubscribeUser,
                'services' => $services,
                'userCars' => $userCars,
            ],
        ]);
    }

    public function exportUsersData(Request $request)
    {
        $filter = $request->input('filter');
        $query = User::query();

        if ($filter === 'USER') {
            $query->where('role', 'USER');
        } elseif ($filter === 'STAFF') {
            $query->whereIn('role', ['STAFF', 'ADMIN']);
        }

        $users = $query->latest('id')->get();
        $csv = "Name,Phone,Role\n";
        foreach ($users as $u) {
            $csv .= "\"{$u->name}\",\"{$u->phone}\",\"{$u->role}\"\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=users.csv',
        ]);
    }

    public function getUsersForJob(Request $request)
    {
        $users = User::select('id', 'name', 'phone')->latest('id')->get();
        return response()->json(['success' => true, 'data' => $users]);
    }
}
