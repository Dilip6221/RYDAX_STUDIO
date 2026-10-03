<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OnlineServicePackage extends Model
{
    protected $fillable = [
        'service_id',
        'name',
        'price',
        'duration',
        'features',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'features' => 'array',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(OnlineService::class, 'service_id');
    }
}
