<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CarCompany extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'name',
        'logo_url',
        'status',
    ];

    public function models(): HasMany
    {
        return $this->hasMany(CarModel::class, 'company_id');
    }
}
