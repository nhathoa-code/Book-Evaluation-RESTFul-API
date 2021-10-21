<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'isbn';
    public $incrementing = false;

    public function getImageAttribute($value)
    {
        return asset("storage/" . $value);
    }

    public function getIsbnAttribute($value)
    {
        return $value;
    }

    public function getRouteKeyName()
    {
        return 'isbn';
    }
}
