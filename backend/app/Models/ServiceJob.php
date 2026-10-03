<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceJob extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'job_code',
        'user_id',
        'car_id',
        'status',
        'current_stage',
        'progress_percent',
        'check_in_time',
        'expected_delivery',
        'timeline',
        'customer_notes',
        'reel_data',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
        'expected_delivery' => 'datetime',
        'timeline' => 'array',
        'reel_data' => 'array',
    ];

    protected $appends = [
        'jobCode',
        'userId',
        'carId',
        'currentStage',
        'progressPercent',
        'checkInTime',
        'expectedDelivery',
        'customerNotes',
        'reelData',
    ];

    public function getJobCodeAttribute() { return $this->job_code; }
    public function getUserIdAttribute() { return $this->user_id; }
    public function getCarIdAttribute() { return $this->car_id; }
    public function getCurrentStageAttribute() { return $this->current_stage; }
    public function getProgressPercentAttribute() { return $this->progress_percent; }
    public function getCheckInTimeAttribute() { return $this->check_in_time; }
    public function getExpectedDeliveryAttribute() { return $this->expected_delivery; }
    public function getCustomerNotesAttribute() { return $this->customer_notes; }
    public function getReelDataAttribute() { return $this->reel_data; }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(UserCar::class, 'car_id');
    }

    public function services(): HasMany
    {
        return $this->hasMany(JobService::class, 'job_id');
    }

    public function media(): HasMany
    {
        return $this->hasMany(JobMedia::class, 'job_id');
    }
}
