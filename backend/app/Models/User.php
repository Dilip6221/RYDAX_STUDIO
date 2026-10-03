<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'password',
        'role',
        'is_profile_complete',
        'status',
        'login_count',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'is_profile_complete' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function cars(): HasMany
    {
        return $this->hasMany(UserCar::class);
    }

    public function serviceJobs(): HasMany
    {
        return $this->hasMany(ServiceJob::class);
    }

    public function onlineBookings(): HasMany
    {
        return $this->hasMany(OnlineBooking::class);
    }
}
