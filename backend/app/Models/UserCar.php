<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserCar extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'user_id',
        'brand',
        'model',
        'year',
        'color',
        'registration_number',
        'vin_number',
    ];

    protected $appends = ['registrationNumber', 'vinNumber', 'userId'];

    public function getRegistrationNumberAttribute()
    {
        return $this->registration_number;
    }

    public function getVinNumberAttribute()
    {
        return $this->vin_number;
    }

    public function getUserIdAttribute()
    {
        return $this->user_id;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function serviceJobs(): HasMany
    {
        return $this->hasMany(ServiceJob::class, 'car_id');
    }
}
