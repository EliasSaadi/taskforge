<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    // ✅ Champs remplissables automatiquement
    protected $fillable = [
        'nom',
        'description',
        'date_debut',
        'date_fin',
    ];

    // ✅ Relations

    // 1. Liste des membres du projet
    public function membres()
    {
        return $this->belongsToMany(User::class, 'project_user')
                    ->withPivot('role_id')
                    ->withTimestamps();
    }

    // 2. Toutes les tâches du projet
    public function taches()
    {
        return $this->hasMany(Task::class);
    }

    // 3. Messages liés à ce projet
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
