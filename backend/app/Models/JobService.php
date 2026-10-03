<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobService extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'job_id',
        'service_name',
        'price',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    protected $appends = ['serviceName'];

    public function getServiceNameAttribute() { return $this->service_name; }

    public function job(): BelongsTo
    {
        return $this->belongsTo(ServiceJob::class, 'job_id');
    }
}
