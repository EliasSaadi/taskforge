<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FakeDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // tes truncates
        DB::table('task_user')->truncate();
        DB::table('tasks')->truncate();
        DB::table('project_user')->truncate();
        DB::table('projects')->truncate();
        DB::table('users')->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Création de 3 users
        $users = [
            [
                'nom' => 'Dupont',
                'prenom' => 'Alice',
                'email' => 'alice@test.com',
                'password' => Hash::make('password1'),
                'actif' => true,
                'theme' => 'clair',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Bob',
                'email' => 'bob@test.com',
                'password' => Hash::make('password2'),
                'actif' => true,
                'theme' => 'sombre',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Legrand',
                'prenom' => 'Chloé',
                'email' => 'chloe@test.com',
                'password' => Hash::make('password3'),
                'actif' => true,
                'theme' => 'clair',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            $userIds[] = DB::table('users')->insertGetId($user);
        }

        // ID des rôles (adapte si tu as une table 'roles' ou une constante)
        $CHEF = 1;
        $ASSISTANT = 2;
        $MEMBRE = 3;

        // Création des 3 projets + rôles croisés
        $projets = [
            [
                'nom' => 'Projet Alpha',
                'description' => 'Premier projet test',
                'date_debut' => now()->addDays(1),
                'date_fin' => now()->addDays(31),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Projet Beta',
                'description' => 'Deuxième projet test',
                'date_debut' => now()->addDays(2),
                'date_fin' => now()->addDays(32),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Projet Gamma',
                'description' => 'Troisième projet test',
                'date_debut' => now()->addDays(3),
                'date_fin' => now()->addDays(33),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($projets as $i => $projet) {
            $projetId = DB::table('projects')->insertGetId($projet);

            // Rôles croisés : chacun chef sur un projet, etc.
            // user1 chef proj1, assistant proj3, membre proj2
            // user2 chef proj2, assistant proj1, membre proj3
            // user3 chef proj3, assistant proj2, membre proj1

            // Associer utilisateurs avec rôles
            if ($i === 0) { // Projet 1
                DB::table('project_user')->insert([
                    [
                        'project_id' => $projetId,
                        'user_id' => $userIds[0], 'role_id' => $CHEF,
                        'created_at' => now(), 'updated_at' => now(),
                    ],
                    [
                        'project_id' => $projetId,
                        'user_id' => $userIds[1], 'role_id' => $ASSISTANT,
                        'created_at' => now(), 'updated_at' => now(),
                    ],
                    [
                        'project_id' => $projetId,
                        'user_id' => $userIds[2], 'role_id' => $MEMBRE,
                        'created_at' => now(), 'updated_at' => now(),
                    ],
                ]);
            } elseif ($i === 1) { // Projet 2
                DB::table('project_user')->insert([
                    [
                        'project_id' => $projetId,
                        'user_id' => $userIds[1], 'role_id' => $CHEF,
                        'created_at' => now(), 'updated_at' => now(),
                    ],
                    [
                        'project_id' => $projetId,
                        'user_id' => $userIds[2], 'role_id' => $ASSISTANT,
                        'created_at' => now(), 'updated_at' => now(),
                    ],
                    [
                        'project_id' => $projetId,
                        'user_id' => $userIds[0], 'role_id' => $MEMBRE,
                        'created_at' => now(), 'updated_at' => now(),
                    ],
                ]);
            } else { // Projet 3
                DB::table('project_user')->insert([
                    [
                        'project_id' => $projetId,
                        'user_id' => $userIds[2], 'role_id' => $CHEF,
                        'created_at' => now(), 'updated_at' => now(),
                    ],
                    [
                        'project_id' => $projetId,
                        'user_id' => $userIds[0], 'role_id' => $ASSISTANT,
                        'created_at' => now(), 'updated_at' => now(),
                    ],
                    [
                        'project_id' => $projetId,
                        'user_id' => $userIds[1], 'role_id' => $MEMBRE,
                        'created_at' => now(), 'updated_at' => now(),
                    ],
                ]);
            }

            // Création de 3 tâches par projet
            $statuts = ['à faire', 'en cours', 'terminé'];
            for ($t = 0; $t < 3; $t++) {
                $taskId = DB::table('tasks')->insertGetId([
                    'titre' => "Tâche " . ($t + 1) . " - " . $projet['nom'],
                    'description' => "Description de la tâche " . ($t + 1) . " dans " . $projet['nom'],
                    'statut' => $statuts[$t % 3],
                    'date_debut' => now()->addDays($i + $t),
                    'date_limite' => now()->addDays($i + $t + 7),
                    'project_id' => $projetId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Assignation variée : 1 tâche solo, 1 tâche duo, 1 tâche trio
                if ($t === 0) {
                    DB::table('task_user')->insert([
                        'task_id' => $taskId,
                        'user_id' => $userIds[$i], // le chef du projet
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } elseif ($t === 1) {
                    DB::table('task_user')->insert([
                        [
                            'task_id' => $taskId,
                            'user_id' => $userIds[$i],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                        [
                            'task_id' => $taskId,
                            'user_id' => $userIds[($i+1)%3], // assistant
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                    ]);
                } else {
                    // Tous les membres sur la tâche
                    foreach ($userIds as $uid) {
                        DB::table('task_user')->insert([
                            'task_id' => $taskId,
                            'user_id' => $uid,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}
