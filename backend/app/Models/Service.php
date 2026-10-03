<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'image_url',
        'image_public_id',
        'icon',
        'category',
        'duration',
        'status',
        'interactive_sections',
        'faqs',
        'packages',
    ];

    protected $casts = [
        'interactive_sections' => 'array',
        'faqs' => 'array',
        'packages' => 'array',
    ];

    protected $appends = [
        'shortDescription',
        'image',
        'interactiveSections',
        'cardFeatures',
        'warranty',
    ];

    public function getShortDescriptionAttribute()
    {
        return $this->attributes['short_description'] ?? '';
    }

    public function getImageAttribute()
    {
        return [
            'url' => $this->attributes['image_url'] ?? '',
            'public_id' => $this->attributes['image_public_id'] ?? '',
        ];
    }

    public function getInteractiveSectionsAttribute()
    {
        $val = $this->attributes['interactive_sections'] ?? null;
        if (is_string($val)) return json_decode($val, true) ?: [];
        return is_array($val) ? $val : [];
    }

    public function getCardFeaturesAttribute()
    {
        $val = $this->attributes['card_features'] ?? null;
        if (is_string($val)) return json_decode($val, true) ?: [];
        return is_array($val) ? $val : [];
    }

    public function getWarrantyAttribute()
    {
        return $this->attributes['warranty'] ?? '';
    }
}
