<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\UserCar;
use App\Models\ServiceJob;
use App\Models\JobService;
use App\Models\JobMedia;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class JobCardController extends Controller
{
    public function getUserCars(Request $request)
    {
        $cars = UserCar::with('user:id,name,phone')->latest('id')->get();
        return response()->json(['success' => true, 'data' => $cars]);
    }

    public function createUserCar(Request $request)
    {
        $request->validate([
            'userId' => 'required',
            'brand' => 'required|string',
            'model' => 'required|string',
            'registrationNumber' => 'required|string',
        ]);

        $car = UserCar::create([
            'user_id' => $request->userId,
            'brand' => $request->brand,
            'model' => $request->model,
            'year' => $request->year ?? date('Y'),
            'color' => $request->color ?? '',
            'registration_number' => $request->registrationNumber,
            'vin_number' => $request->vinNumber ?? '',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Car added successfully',
            'data' => $car,
        ]);
    }

    public function getMyCars(Request $request)
    {
        $cars = UserCar::where('user_id', $request->user()->id)->get();
        return response()->json(['success' => true, 'data' => $cars]);
    }

    public function getCustomerJobCard(Request $request, $carId)
    {
        $userId = $request->user()->id;

        $job = ServiceJob::where('user_id', $userId)
            ->where('car_id', $carId)
            ->where('status', '!=', 'CANCELLED')
            ->with(['media' => fn($q) => $q->where('is_active', true)->latest('id'), 'services', 'car'])
            ->latest('id')
            ->first();

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'No active job found',
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $job,
        ]);
    }

    public function adminJobCardList(Request $request)
    {
        $jobs = ServiceJob::with(['user:id,name,phone', 'car'])->latest('id')->get();
        return response()->json(['success' => true, 'data' => $jobs]);
    }

    public function getJobCardById($id)
    {
        $job = ServiceJob::with([
            'user:id,name,phone',
            'car',
            'services',
            'media' => fn($q) => $q->where('is_active', true),
        ])->find($id);

        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Job Card Not Found'], 404);
        }

        return response()->json(['success' => true, 'data' => $job]);
    }

    public function getCarsByUser($userId)
    {
        $cars = UserCar::where('user_id', $userId)->get();
        return response()->json(['success' => true, 'data' => $cars]);
    }

    public function createJobCard(Request $request)
    {
        $request->validate([
            'userId' => 'required',
            'carId' => 'required',
        ]);

        $user = User::find($request->userId);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Invalid user'], 422);
        }

        $car = UserCar::where('id', $request->carId)->where('user_id', $request->userId)->first();
        if (!$car) {
            return response()->json(['success' => false, 'message' => 'Car does not belong to selected user'], 422);
        }

        $count = ServiceJob::count();
        $jobCode = 'JOB-' . str_pad($count + 1, 5, '0', STR_PAD_LEFT);

        $job = ServiceJob::create([
            'job_code' => $jobCode,
            'user_id' => $request->userId,
            'car_id' => $request->carId,
            'status' => 'PENDING',
            'current_stage' => 'CHECK_IN',
            'progress_percent' => 0,
            'expected_delivery' => $request->expectedDelivery,
            'customer_notes' => $request->customerNotes,
            'timeline' => [
                [
                    'stage' => 'Job Created',
                    'status' => 'PENDING',
                    'note' => 'Job Card created by admin',
                    'time' => now()->toIso8601String(),
                ]
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Service job created successfully',
            'data' => $job,
        ]);
    }

    public function updateJobProgress(Request $request, $id = null)
    {
        $jobId = $id ?? $request->input('jobCardId') ?? $request->input('job_id') ?? $request->input('id');
        $job = ServiceJob::find($jobId);
        if (!$job) {
            return response()->json(['success' => false, 'message' => 'Job not found'], 404);
        }

        $stage = $request->input('stage');
        $note = $request->input('note', '');
        $progressPercent = $request->input('progressPercent', $job->progress_percent);
        $expectedDelivery = $request->input('expectedDelivery', $job->expected_delivery);

        $statusMap = [
            'CHECK_IN' => 'PENDING',
            'INSPECTION' => 'PROGRESS',
            'WORK_STARTED' => 'PROGRESS',
            'PART_REPLACED' => 'PROGRESS',
            'QUALITY_CHECK' => 'PROGRESS',
            'READY' => 'COMPLETED',
            'DELIVERED' => 'DELIVERED',
        ];

        $job->current_stage = $stage;
        $job->progress_percent = $progressPercent;
        if (isset($statusMap[$stage])) {
            $job->status = $statusMap[$stage];
        }
        if ($expectedDelivery) {
            $job->expected_delivery = $expectedDelivery;
        }

        $timeline = $job->timeline ?? [];
        $timeline[] = [
            'stage' => $stage,
            'note' => $note,
            'time' => now()->toIso8601String(),
        ];
        $job->timeline = $timeline;
        $job->save();

        return response()->json([
            'success' => true,
            'message' => 'Job progress updated successfully',
        ]);
    }

    public function createJobService(Request $request)
    {
        $request->validate([
            'jobId' => 'required',
            'serviceName' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $service = JobService::create([
            'job_id' => $request->jobId,
            'service_name' => $request->serviceName,
            'price' => $request->price,
        ]);

        return response()->json(['success' => true, 'data' => $service]);
    }

    public function getJobServicesByJob($jobId)
    {
        $services = JobService::where('job_id', $jobId)->get();
        return response()->json(['success' => true, 'data' => $services]);
    }

    public function deleteJobService($id)
    {
        $service = JobService::find($id);
        if ($service) {
            $service->delete();
        }
        return response()->json(['success' => true]);
    }

    public function getJobMedia(Request $request, $jobId)
    {
        $query = JobMedia::where('job_id', $jobId)->where('is_active', true);
        if ($request->filled('stage')) {
            $query->where('stage', $request->stage);
        }
        $media = $query->latest('id')->get();

        return response()->json(['success' => true, 'data' => $media]);
    }

    public function uploadJobMedia(Request $request, $jobId)
    {
        if (!$request->hasFile('media')) {
            return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
        }

        $stage = $request->input('stage', 'GENERAL');
        $file = $request->file('media');
        $mime = $file->getMimeType();
        $mediaType = str_starts_with($mime, 'video') ? 'video' : 'photo';

        $path = $file->store("jobs/{$jobId}/{$stage}", 'public');
        $url = Storage::url($path);

        $media = JobMedia::create([
            'job_id' => $jobId,
            'stage' => $stage,
            'media_type' => $mediaType,
            'url' => $url,
            'public_id' => $path,
            'uploaded_by' => $request->user()?->id,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Media uploaded',
            'data' => $media,
        ]);
    }

    public function deleteJobMedia(Request $request, $jobId, $mediaId)
    {
        $media = JobMedia::where('id', $mediaId)->where('job_id', $jobId)->first();
        if (!$media) {
            return response()->json(['success' => false, 'message' => 'Media not found'], 404);
        }

        $media->is_active = false;
        $media->save();

        return response()->json(['success' => true, 'message' => 'Media deleted']);
    }
}
