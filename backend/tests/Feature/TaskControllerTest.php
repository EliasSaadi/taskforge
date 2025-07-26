<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private User $otherUser;
    private Project $project;
    private Role $role;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Créer des utilisateurs de test
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
        
        // Créer un projet et un rôle
        $this->project = Project::factory()->create();
        $this->role = Role::create(['nom' => 'Membre']);
        
        // Associer l'utilisateur principal au projet
        $this->user->projets()->attach($this->project->id, ['role_id' => $this->role->id]);
        
        // Authentifier l'utilisateur principal
        Sanctum::actingAs($this->user);
    }

    /**
     * Test de récupération de toutes les tâches (index)
     */
    public function test_index_retourne_toutes_les_taches()
    {
        // Créer quelques tâches
        Task::factory()->count(3)->create(['project_id' => $this->project->id]);
        Task::factory()->count(2)->create(); // Tâches d'autres projets

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         '*' => [
                             'id',
                             'titre',
                             'description',
                             'statut',
                             'date_debut',
                             'date_limite',
                             'project_id',
                             'created_at',
                             'updated_at',
                             'projet',
                             'utilisateurs'
                         ]
                     ]
                 ])
                 ->assertJson(['success' => true])
                 ->assertJsonCount(5, 'data'); // Toutes les tâches
    }

    /**
     * Test de création d'une tâche (store)
     */
    public function test_store_cree_une_nouvelle_tache()
    {
        $taskData = [
            'titre' => 'Nouvelle tâche de test',
            'description' => 'Description de la tâche de test',
            'statut' => 'à faire',
            'date_debut' => '2025-07-10',
            'date_limite' => '2025-07-20',
            'project_id' => $this->project->id,
            'user_ids' => [$this->user->id, $this->otherUser->id]
        ];

        // Ajouter l'autre utilisateur au projet pour pouvoir l'assigner
        $this->otherUser->projets()->attach($this->project->id, ['role_id' => $this->role->id]);

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'id',
                         'titre',
                         'description',
                         'statut',
                         'date_debut',
                         'date_limite',
                         'project_id',
                         'projet',
                         'utilisateurs'
                     ]
                 ])
                 ->assertJson([
                     'success' => true,
                     'message' => 'Tâche créée avec succès',
                     'data' => [
                         'titre' => 'Nouvelle tâche de test',
                         'statut' => 'à faire',
                         'project_id' => $this->project->id
                     ]
                 ]);

        $this->assertDatabaseHas('tasks', [
            'titre' => 'Nouvelle tâche de test',
            'project_id' => $this->project->id
        ]);
    }

    /**
     * Test de validation lors de la création
     */
    public function test_store_echoue_avec_donnees_invalides()
    {
        $taskData = [
            'titre' => '', // Requis
            'statut' => 'statut_invalide', // Valeur invalide
            'date_debut' => '2025-07-20',
            'date_limite' => '2025-07-10', // Antérieure à date_debut
            'project_id' => 999999 // Projet inexistant
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(422)
                 ->assertJson(['success' => false])
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'errors'
                 ]);
    }

    /**
     * Test d'accès refusé pour un projet non membre
     */
    public function test_store_refuse_acces_projet_non_membre()
    {
        $otherProject = Project::factory()->create();
        
        $taskData = [
            'titre' => 'Tâche non autorisée',
            'statut' => 'à faire',
            'date_debut' => '2025-07-10',
            'date_limite' => '2025-07-20',
            'project_id' => $otherProject->id
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(403)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Accès non autorisé - vous n\'êtes pas membre de ce projet'
                 ]);
    }

    /**
     * Test d'affichage d'une tâche (show)
     */
    public function test_show_retourne_tache_specifique()
    {
        $task = Task::factory()->create(['project_id' => $this->project->id]);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'id' => $task->id,
                         'titre' => $task->titre,
                         'project_id' => $this->project->id
                     ]
                 ]);
    }

    /**
     * Test d'accès refusé pour voir une tâche d'un projet non membre
     */
    public function test_show_refuse_acces_tache_projet_non_membre()
    {
        $otherProject = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $otherProject->id]);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(403)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Accès non autorisé'
                 ]);
    }

    /**
     * Test de mise à jour d'une tâche (update)
     */
    public function test_update_modifie_tache()
    {
        // Créer le rôle Chef de Projet pour ce test
        $chefRole = Role::create(['nom' => 'Chef de Projet']);
        
        // Mettre à jour le rôle de l'utilisateur pour être chef de projet
        $this->user->projets()->updateExistingPivot($this->project->id, ['role_id' => $chefRole->id]);
        
        $task = Task::factory()->create(['project_id' => $this->project->id]);
        
        $updateData = [
            'titre' => 'Titre mis à jour',
            'statut' => 'en cours',
            'description' => 'Description mise à jour'
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Tâche mise à jour avec succès',
                     'data' => [
                         'titre' => 'Titre mis à jour',
                         'statut' => 'en cours',
                         'description' => 'Description mise à jour'
                     ]
                 ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'titre' => 'Titre mis à jour',
            'statut' => 'en cours'
        ]);
    }

    /**
     * Test d'accès refusé pour modifier une tâche d'un projet non membre
     */
    public function test_update_refuse_modification_tache_projet_non_membre()
    {
        $otherProject = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $otherProject->id]);
        
        $updateData = ['titre' => 'Hack'];

        $response = $this->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(403)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Accès refusé - Seuls le chef de projet et l\'assistant peuvent modifier cette tâche'
                 ]);
    }

    /**
     * Test de suppression d'une tâche (destroy)
     */
    public function test_destroy_supprime_tache()
    {
        // Créer le rôle Chef de Projet pour ce test
        $chefRole = Role::create(['nom' => 'Chef de Projet']);
        
        // Mettre à jour le rôle de l'utilisateur pour être chef de projet
        $this->user->projets()->updateExistingPivot($this->project->id, ['role_id' => $chefRole->id]);
        
        $task = Task::factory()->create(['project_id' => $this->project->id]);
        $taskTitle = $task->titre;

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => "Tâche '{$taskTitle}' supprimée avec succès"
                 ]);

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id
        ]);
    }

    /**
     * Test qu'un simple membre ne peut pas supprimer une tâche
     */
    public function test_destroy_refuse_si_pas_chef_ou_assistant()
    {
        $task = Task::factory()->create(['project_id' => $this->project->id]);

        // L'utilisateur est déjà un simple membre (configuré dans setUp())
        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(403)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Accès refusé - Seuls le chef de projet et l\'assistant peuvent supprimer cette tâche'
                 ]);

        // Vérifier que la tâche existe toujours
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id
        ]);
    }

    /**
     * Test d'assignation d'un utilisateur à une tâche (assign)
     */
    public function test_assign_assigne_utilisateur_a_tache()
    {
        $task = Task::factory()->create(['project_id' => $this->project->id]);
        
        // Ajouter l'autre utilisateur au projet
        $this->otherUser->projets()->attach($this->project->id, ['role_id' => $this->role->id]);

        $response = $this->postJson("/api/tasks/{$task->id}/assign/{$this->otherUser->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'task_id' => $task->id,
                         'user_id' => $this->otherUser->id
                     ]
                 ]);

        // Vérifier que l'assignation existe en base
        $this->assertDatabaseHas('task_user', [
            'task_id' => $task->id,
            'user_id' => $this->otherUser->id
        ]);
    }

    /**
     * Test d'assignation refusée pour un utilisateur non membre du projet
     */
    public function test_assign_refuse_utilisateur_non_membre_projet()
    {
        $task = Task::factory()->create(['project_id' => $this->project->id]);
        $nonMemberUser = User::factory()->create();

        $response = $this->postJson("/api/tasks/{$task->id}/assign/{$nonMemberUser->id}");

        $response->assertStatus(422)
                 ->assertJson([
                     'success' => false,
                     'message' => 'L\'utilisateur n\'est pas membre de ce projet'
                 ]);
    }

    /**
     * Test de retrait d'assignation (unassign)
     */
    public function test_unassign_retire_utilisateur_de_tache()
    {
        $task = Task::factory()->create(['project_id' => $this->project->id]);
        
        // Assigner d'abord l'utilisateur
        $task->utilisateurs()->attach($this->otherUser->id);

        $response = $this->deleteJson("/api/tasks/{$task->id}/unassign/{$this->otherUser->id}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        // Vérifier que l'assignation n'existe plus
        $this->assertDatabaseMissing('task_user', [
            'task_id' => $task->id,
            'user_id' => $this->otherUser->id
        ]);
    }

    /**
     * Test de récupération des utilisateurs assignés (users)
     */
    public function test_users_retourne_utilisateurs_assignes()
    {
        $task = Task::factory()->create(['project_id' => $this->project->id]);
        
        // Assigner des utilisateurs
        $task->utilisateurs()->attach([$this->user->id, $this->otherUser->id]);

        $response = $this->getJson("/api/tasks/{$task->id}/users");

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(2, 'data')
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         '*' => [
                             'id',
                             'prenom',
                             'nom',
                             'email'
                         ]
                     ],
                     'task' => [
                         'id',
                         'titre',
                         'statut'
                     ]
                 ]);
    }

    /**
     * Test de tâche non trouvée
     */
    public function test_retourne_404_pour_tache_inexistante()
    {
        $response = $this->getJson('/api/tasks/999999');

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Tâche non trouvée'
                 ]);
    }
}

/**
 * Tests pour les routes sans authentification
 */
class TaskControllerUnauthenticatedTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que les routes nécessitent une authentification
     */
    public function test_routes_necessitent_authentification()
    {
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);
        $user = User::factory()->create();

        // Tester les routes principales
        $this->getJson('/api/tasks')->assertStatus(401);
        $this->postJson('/api/tasks', [])->assertStatus(401);
        $this->getJson("/api/tasks/{$task->id}")->assertStatus(401);
        $this->putJson("/api/tasks/{$task->id}", [])->assertStatus(401);
        $this->deleteJson("/api/tasks/{$task->id}")->assertStatus(401);

        // Tester les routes personnalisées
        $this->postJson("/api/tasks/{$task->id}/assign/{$user->id}")->assertStatus(401);
        $this->deleteJson("/api/tasks/{$task->id}/unassign/{$user->id}")->assertStatus(401);
        $this->getJson("/api/tasks/{$task->id}/users")->assertStatus(401);
    }
}
