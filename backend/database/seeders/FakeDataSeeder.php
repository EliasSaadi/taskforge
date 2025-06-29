<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FakeDataSeeder extends Seeder
{
    public function run(): void
    {
        // Tableau pour suivre les utilisateurs créés
        $userIds = [];

        // Créer 9 utilisateurs
        for ($i = 1; $i <= 9; $i++) {
            $userIds[] = DB::table('users')->insertGetId([
                'nom' => "Nom{$i}",
                'prenom' => "Prenom{$i}",
                'email' => "user{$i}@test.com",
                'password' => Hash::make('password' . $i),
                'actif' => true,
                'theme' => 'clair',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Créer 3 projets
        for ($p = 1; $p <= 3; $p++) {
            $projetId = DB::table('projects')->insertGetId([
                'nom' => "Projet {$p}",
                'description' => "Description du projet {$p}",
                'date_debut' => now()->addDays($p),
                'date_fin' => now()->addDays($p + 30),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Associer l’utilisateur $p comme Chef de Projet
            DB::table('project_user')->insert([
                'project_id' => $projetId,
                'user_id' => $userIds[$p - 1], // premier utilisateur du projet
                'role_id' => 1, // Chef de Projet
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Créer 3 tâches pour ce projet
            for ($t = 1; $t <= 3; $t++) {
                $taskIndex = ($p - 1) * 3 + $t - 1;

                $taskId = DB::table('tasks')->insertGetId([
                    'titre' => "Tâche {$t} - Projet {$p}",
                    'description' => "Description de la tâche {$t} dans projet {$p}",
                    'statut' => 'à faire',
                    'date_debut' => now()->addDays($p + $t),
                    'date_limite' => now()->addDays($p + $t + 7),
                    'project_id' => $projetId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Assigner un utilisateur unique à chaque tâche
                DB::table('task_user')->insert([
                    'task_id' => $taskId,
                    'user_id' => $userIds[$taskIndex],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}

