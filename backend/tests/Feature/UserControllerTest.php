<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

class UserControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;
    private User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Créer des utilisateurs de test
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
        
        // Authentifier l'utilisateur principal
        Sanctum::actingAs($this->user);
    }

    /**
     * Test de récupération de tous les utilisateurs (index)
     */
    public function test_index_retourne_tous_les_utilisateurs()
    {
        // Créer quelques utilisateurs supplémentaires
        User::factory()->count(3)->create();

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         '*' => [
                             'id',
                             'prenom',
                             'nom',
                             'email',
                             'created_at',
                             'updated_at',
                             'projets',
                             'taches',
                             'messages'
                         ]
                     ]
                 ])
                 ->assertJson(['success' => true])
                 ->assertJsonCount(5, 'data'); // 2 utilisateurs setUp + 3 créés
    }

    /**
     * Test de création d'un utilisateur (store)
     */
    public function test_store_cree_un_nouvel_utilisateur()
    {
        $userData = [
            'prenom' => 'Jean',
            'nom' => 'Dupont',
            'email' => 'jean.dupont@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'theme' => 'sombre'
        ];

        $response = $this->postJson('/api/user', $userData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'id',
                         'prenom',
                         'nom',
                         'email',
                         'theme',
                         'actif',
                         'created_at',
                         'updated_at',
                         'projets',
                         'taches',
                         'messages'
                     ]
                 ])
                 ->assertJson([
                     'success' => true,
                     'message' => 'Utilisateur créé avec succès',
                     'data' => [
                         'prenom' => 'Jean',
                         'nom' => 'Dupont',
                         'email' => 'jean.dupont@example.com',
                         'theme' => 'sombre',
                         'actif' => true
                     ]
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'jean.dupont@example.com',
            'prenom' => 'Jean',
            'nom' => 'Dupont'
        ]);
    }

    /**
     * Test de validation lors de la création
     */
    public function test_store_echoue_avec_donnees_invalides()
    {
        $userData = [
            'prenom' => '', // Requis
            'email' => 'email-invalide', // Format invalide
            'password' => '123', // Trop court
        ];

        $response = $this->postJson('/api/user', $userData);

        $response->assertStatus(422)
                 ->assertJson(['success' => false])
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'errors'
                 ]);
    }

    /**
     * Test d'affichage du profil utilisateur (show)
     */
    public function test_show_retourne_profil_utilisateur()
    {
        $response = $this->getJson("/api/user/{$this->user->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'id' => $this->user->id,
                         'prenom' => $this->user->prenom,
                         'nom' => $this->user->nom,
                         'email' => $this->user->email
                     ]
                 ]);
    }

    /**
     * Test d'accès refusé pour voir le profil d'un autre utilisateur
     */
    public function test_show_refuse_acces_autre_utilisateur()
    {
        $response = $this->getJson("/api/user/{$this->otherUser->id}");

        $response->assertStatus(403)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Accès non autorisé'
                 ]);
    }

    /**
     * Test de mise à jour du profil (update)
     */
    public function test_update_modifie_profil_utilisateur()
    {
        $updateData = [
            'prenom' => 'NouveauPrenom',
            'nom' => 'NouveauNom',
            'theme' => 'sombre'
        ];

        $response = $this->putJson("/api/user/{$this->user->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Profil mis à jour avec succès'
                 ])
                 ->assertJsonPath('data.prenom', 'NouveauPrenom')
                 ->assertJsonPath('data.nom', 'NouveauNom')
                 ->assertJsonPath('data.theme', 'sombre');

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'prenom' => 'NouveauPrenom',
            'nom' => 'NouveauNom',
            'theme' => 'sombre'
        ]);
    }

    /**
     * Test de mise à jour du mot de passe
     */
    public function test_update_modifie_mot_de_passe()
    {
        $updateData = [
            'password' => 'nouveaumotdepasse',
            'password_confirmation' => 'nouveaumotdepasse'
        ];

        $response = $this->putJson("/api/user/{$this->user->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        // Vérifier que le mot de passe a été changé
        $this->user->refresh();
        $this->assertTrue(Hash::check('nouveaumotdepasse', $this->user->getAttributes()['password']));
    }

    /**
     * Test d'accès refusé pour modifier un autre utilisateur
     */
    public function test_update_refuse_modification_autre_utilisateur()
    {
        $updateData = ['prenom' => 'Hack'];

        $response = $this->putJson("/api/user/{$this->otherUser->id}", $updateData);

        $response->assertStatus(403)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Accès non autorisé'
                 ]);
    }

    /**
     * Test de suppression du compte (destroy)
     */
    public function test_destroy_supprime_compte_utilisateur()
    {
        $userName = "{$this->user->prenom} {$this->user->nom}";

        $response = $this->deleteJson("/api/user/{$this->user->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => "Compte de {$userName} supprimé avec succès"
                 ]);

        $this->assertDatabaseMissing('users', [
            'id' => $this->user->id
        ]);
    }

    /**
     * Test des projets d'un utilisateur (projects)
     */
    public function test_projects_retourne_projets_utilisateur()
    {
        // Créer des projets et des rôles
        $role = Role::create(['nom' => 'Membre']);
        $projects = Project::factory()->count(2)->create();

        // Associer l'utilisateur aux projets
        foreach ($projects as $project) {
            $this->user->projets()->attach($project->id, ['role_id' => $role->id]);
        }

        $response = $this->getJson("/api/user/{$this->user->id}/projects");

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(2, 'data')
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         '*' => [
                             'id',
                             'nom',
                             'description',
                             'date_debut',
                             'date_fin'
                         ]
                     ],
                     'user' => [
                         'id',
                         'prenom',
                         'nom'
                     ]
                 ]);
    }

    /**
     * Test des tâches d'un utilisateur (tasks)
     */
    public function test_tasks_retourne_taches_utilisateur()
    {
        // Créer des projets et des tâches
        $project = Project::factory()->create();
        $tasks = Task::factory()->count(3)->create(['project_id' => $project->id]);

        // Associer l'utilisateur aux tâches
        foreach ($tasks as $task) {
            $this->user->taches()->attach($task->id);
        }

        $response = $this->getJson("/api/user/{$this->user->id}/tasks");

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(3, 'data');
    }

    /**
     * Test du rôle dans un projet (roleInProject)
     */
    public function test_role_in_project_retourne_role_utilisateur()
    {
        // Créer un projet et un rôle
        $role = Role::create(['nom' => 'Chef de Projet']);
        $project = Project::factory()->create();

        // Associer l'utilisateur au projet avec un rôle
        $this->user->projets()->attach($project->id, ['role_id' => $role->id]);

        $response = $this->getJson("/api/user/{$this->user->id}/role-in-project/{$project->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'user_id' => $this->user->id,
                         'project_id' => $project->id,
                         'role_id' => $role->id
                     ]
                 ]);
    }

    /**
     * Test de désactivation du compte (deactivate)
     */
    public function test_deactivate_desactive_compte()
    {
        $response = $this->patchJson("/api/user/{$this->user->id}/deactivate");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Compte désactivé avec succès',
                     'data' => [
                         'actif' => false
                     ]
                 ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'actif' => false
        ]);
    }

    /**
     * Test de changement de thème (toggleTheme)
     */
    public function test_toggle_theme_change_theme()
    {
        $originalTheme = $this->user->theme;
        $expectedTheme = $originalTheme === 'sombre' ? 'clair' : 'sombre';

        $response = $this->patchJson("/api/user/{$this->user->id}/theme");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Thème mis à jour avec succès',
                     'data' => [
                         'theme' => $expectedTheme
                     ]
                 ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'theme' => $expectedTheme
        ]);
    }

    /**
     * Test d'utilisateur non trouvé
     */
    public function test_retourne_404_pour_utilisateur_inexistant()
    {
        $response = $this->getJson('/api/user/999999');

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Utilisateur non trouvé'
                 ]);
    }
}

/**
 * Tests pour les routes sans authentification
 */
class UserControllerUnauthenticatedTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que les routes nécessitent une authentification
     */
    public function test_routes_necessitent_authentification()
    {
        $user = User::factory()->create();

        // Tester les routes principales
        $this->getJson('/api/user')->assertStatus(401);
        $this->postJson('/api/user', [])->assertStatus(401);
        $this->getJson("/api/user/{$user->id}")->assertStatus(401);
        $this->putJson("/api/user/{$user->id}", [])->assertStatus(401);
        $this->deleteJson("/api/user/{$user->id}")->assertStatus(401);

        // Tester les routes personnalisées
        $this->getJson("/api/user/{$user->id}/projects")->assertStatus(401);
        $this->getJson("/api/user/{$user->id}/tasks")->assertStatus(401);
        $this->patchJson("/api/user/{$user->id}/deactivate")->assertStatus(401);
        $this->patchJson("/api/user/{$user->id}/theme")->assertStatus(401);
    }
}
