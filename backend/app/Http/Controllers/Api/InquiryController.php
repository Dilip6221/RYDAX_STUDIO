<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Inquiry;

class InquiryController extends Controller
{
    public function createServiceInquiry(Request $request)
    {
        $name = $request->input('name');
        $phone = $request->input('phone');

        if ($request->user()) {
            $name = $name ?: $request->user()->name;
            $phone = $phone ?: $request->user()->phone;
        }

        if (!$phone) {
            return response()->json([
                'success' => false,
                'message' => 'Phone number is required',
            ], 422);
        }

        $services = $request->input('services', []);
        if (is_string($services)) {
            $services = json_decode($services, true) ?: [$services];
        }

        $inquiry = Inquiry::create([
            'name' => $name ?: 'Guest Customer',
            'phone' => $phone,
            'email' => $request->input('email'),
            'services' => $services,
            'notes' => $request->input('notes'),
            'status' => 'NEW',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your inquiry has been submitted. Our team will contact you soon.',
            'data' => $inquiry,
        ]);
    }

    public function adminInquiryData(Request $request)
    {
        $inquiries = Inquiry::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $inquiries,
        ]);
    }

    public function getInquiryDetails(Request $request)
    {
        $id = $request->input('id');
        $inquiry = Inquiry::find($id);

        if (!$inquiry) {
            return response()->json([
                'success' => false,
                'message' => 'Inquiry not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $inquiry,
        ]);
    }

    public function updateInquiryStatus(Request $request)
    {
        $id = $request->input('id');
        $status = $request->input('status');
        $notes = $request->input('adminNotes') ?? $request->input('notes');

        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Inquiry ID is required',
            ], 422);
        }

        $inquiry = Inquiry::find($id);
        if (!$inquiry) {
            return response()->json([
                'success' => false,
                'message' => 'Inquiry not found',
            ], 404);
        }

        if ($status) {
            $inquiry->status = $status;
        }
        if ($notes !== null) {
            $inquiry->notes = $notes;
        }
        $inquiry->save();

        return response()->json([
            'success' => true,
            'message' => 'Inquiry updated successfully',
        ]);
    }

    public function exportCustomerInqueryData(Request $request)
    {
        $filter = $request->input('filter');
        $query = Inquiry::query();

        if ($filter && $filter !== 'ALL') {
            $query->where('status', $filter);
        }

        $inquiries = $query->orderBy('id', 'desc')->get();

        $csv = "Full Name,Phone,Services,Status\n";
        foreach ($inquiries as $u) {
            $services = is_array($u->services) ? implode(', ', $u->services) : ($u->services ?? '');
            $csv .= "\"{$u->name}\",\"{$u->phone}\",\"{$services}\",\"{$u->status}\"\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=inquiries.csv',
        ]);
    }
}
