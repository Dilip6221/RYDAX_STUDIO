<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarModel extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'company_id',
        'name',
        'body_type',
        'status',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(CarCompany::class, 'company_id');
    }
}
