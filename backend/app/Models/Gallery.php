<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'service',
        'type',
        'title',
        'image_url',
        'public_id',
        'before_image_url',
        'before_public_id',
        'after_image_url',
        'after_public_id',
        'description',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $appends = ['image', 'imageUrl', 'beforeImage', 'afterImage'];

    public function getImageAttribute()
    {
        return [
            'url' => $this->attributes['image_url'] ?? null,
            'public_id' => $this->attributes['public_id'] ?? null,
        ];
    }

    public function getImageUrlAttribute()
    {
        return $this->attributes['image_url'] ?? null;
    }

    public function getBeforeImageAttribute()
    {
        return [
            'url' => $this->attributes['before_image_url'] ?? null,
            'publicId' => $this->attributes['before_public_id'] ?? null,
        ];
    }

    public function getAfterImageAttribute()
    {
        return [
            'url' => $this->attributes['after_image_url'] ?? null,
            'publicId' => $this->attributes['after_public_id'] ?? null,
        ];
    }
}
