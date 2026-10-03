<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobMedia extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'job_id',
        'media_url',
        'public_id',
        'media_type',
        'stage',
    ];

    protected $appends = ['url', 'mediaType'];

    public function getUrlAttribute() { return $this->media_url ?? $this->attributes['url'] ?? ''; }
    public function getMediaTypeAttribute() { return $this->media_type; }

    public function job(): BelongsTo
    {
        return $this->belongsTo(ServiceJob::class, 'job_id');
    }
}
