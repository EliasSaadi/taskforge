<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // ✅ Champs qu’on peut remplir automatiquement
    protected $fillable = [
        'titre',
        'description',
        'statut',
        'date_debut',
        'date_limite',
        'project_id',
    ];

    // ✅ Relations

    // 1. Projet auquel la tâche appartient
    public function projet()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    // 2. Utilisateurs assignés à cette tâche
    public function utilisateurs()
    {
        return $this->belongsToMany(User::class, 'task_user')->withTimestamps();
    }
}

