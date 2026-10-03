<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Blog extends Model
{
    use \App\Models\Traits\HasMongoCompat;

    protected $fillable = [
        'title',
        'slug',
        'thumbnail_url',
        'thumbnail_public_id',
        'content_html',
        'category',
        'tags',
        'meta_title',
        'meta_description',
        'status',
        'is_mail_sent',
        'read_time',
        'likes',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_mail_sent' => 'boolean',
        'read_time' => 'integer',
        'likes' => 'integer',
    ];

    protected $appends = ['thumbnail', 'contentHTML', 'metaTitle', 'metaDescription'];

    public function getThumbnailAttribute()
    {
        return [
            'url' => $this->thumbnail_url,
            'public_id' => $this->thumbnail_public_id,
        ];
    }

    public function getContentHTMLAttribute()
    {
        return $this->content_html;
    }

    public function getMetaTitleAttribute()
    {
        return $this->meta_title;
    }

    public function getMetaDescriptionAttribute()
    {
        return $this->meta_description;
    }

    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class);
    }

    public function likedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'blog_likes');
    }
}
