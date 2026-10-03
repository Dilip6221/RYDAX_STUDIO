<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerReview extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'name',
        'phone',
        'rating',
        'review',
        'car_model',
        'is_verified',
        'is_approved',
        'is_featured',
    ];

    protected $casts = [
        'rating' => 'decimal:1',
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
        'is_featured' => 'boolean',
    ];
}
