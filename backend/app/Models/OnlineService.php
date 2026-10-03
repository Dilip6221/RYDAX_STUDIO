<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OnlineService extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'short_description',
        'image_url',
        'status',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(OnlineServiceCategory::class, 'category_id');
    }

    public function packages(): HasMany
    {
        return $this->hasMany(OnlineServicePackage::class, 'service_id');
    }

    public function addons(): HasMany
    {
        return $this->hasMany(OnlineServiceAddon::class, 'service_id');
    }
}
