<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'services',
        'notes',
        'status',
    ];

    protected $casts = [
        'services' => 'array',
    ];
}
