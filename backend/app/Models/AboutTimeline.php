<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutTimeline extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'year',
        'title',
        'description',
        'image_url',
        'order',
    ];

    protected $appends = ['images'];

    public function getImagesAttribute()
    {
        if (!empty($this->image_url)) {
            return [
                [
                    'url' => $this->image_url,
                    'public_id' => $this->image_url,
                ]
            ];
        }
        return [];
    }
}
