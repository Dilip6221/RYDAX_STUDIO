<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OnlineServiceCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'image_url',
        'status',
    ];

    public function services(): HasMany
    {
        return $this->hasMany(OnlineService::class, 'category_id');
    }
}
