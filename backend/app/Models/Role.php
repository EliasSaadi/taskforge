<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // ✅ Champs remplissables
    protected $fillable = ['nom'];

    // ✅ Relation inverse : dans quels projets ce rôle est utilisé
    public function utilisateurs()
    {
        return $this->belongsToMany(User::class, 'project_user')
                    ->withPivot('project_id')
                    ->withTimestamps();
    }
}

