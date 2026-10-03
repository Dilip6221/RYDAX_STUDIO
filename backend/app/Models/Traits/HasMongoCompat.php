<?php

namespace App\Models\Traits;

trait HasMongoCompat
{
    public function getAttribute($key)
    {
        if ($key === '_id') {
            return (string) ($this->attributes['id'] ?? parent::getAttribute('id'));
        }
        return parent::getAttribute($key);
    }

    public function toArray()
    {
        $array = parent::toArray();
        if (isset($this->attributes['id']) || isset($array['id'])) {
            $array['_id'] = (string) ($array['id'] ?? $this->attributes['id']);
        }
        return $array;
    }
}
