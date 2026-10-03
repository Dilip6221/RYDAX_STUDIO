<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OnlineBooking extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'service_id',
        'package_id',
        'addons',
        'booking_date',
        'slot',
        'address',
        'city',
        'total_amount',
        'payment_status',
        'status',
        'notes',
    ];

    protected $casts = [
        'addons' => 'array',
        'total_amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(OnlineServiceCategory::class, 'category_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(OnlineService::class, 'service_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(OnlineServicePackage::class, 'package_id');
    }
}
