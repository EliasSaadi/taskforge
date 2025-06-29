<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    // ✅ Champs remplissables
    protected $fillable = [
        'contenu',
        'date',
        'project_id',
        'user_id',
    ];

    // ✅ Relation : message posté par un utilisateur
    public function auteur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ✅ Relation : message appartient à un projet
    public function projet()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
