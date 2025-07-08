<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Project;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Créer un utilisateur de test et l'authentifier
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    /**
     * Test de récupération de tous les projets (index)
     */
    public function test_index_retourne_tous_les_projets()
    {
        // Créer quelques projets de test
        Project::factory()->count(3)->create();

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         '*' => [
                             'id',
                             'nom',
                             'description',
                             'date_debut',
                             'date_fin',
                             'created_at',
                             'updated_at',
                             'membres',
                             'taches',
                             'messages'
                         ]
                     ]
                 ])
                 ->assertJson(['success' => true])
                 ->assertJsonCount(3, 'data');
    }

    /**
     * Test de création d'un projet (store)
     */
    public function test_store_cree_un_nouveau_projet()
    {
        $projectData = [
            'nom' => 'Nouveau Projet',
            'description' => 'Description du nouveau projet',
            'date_debut' => now()->addDay()->toDateString(),
            'date_fin' => now()->addDays(30)->toDateString(),
        ];

        $response = $this->postJson('/api/projects', $projectData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'id',
                         'nom',
                         'description',
                         'date_debut',
                         'date_fin',
                         'created_at',
                         'updated_at',
                         'membres',
                         'taches',
                         'messages'
                     ]
                 ])
                 ->assertJson([
                     'success' => true,
                     'message' => 'Projet créé avec succès',
                     'data' => [
                         'nom' => 'Nouveau Projet',
                         'description' => 'Description du nouveau projet'
                     ]
                 ]);

        $this->assertDatabaseHas('projects', [
            'nom' => 'Nouveau Projet',
            'description' => 'Description du nouveau projet'
        ]);
    }

    /**
     * Test que le créateur d'un projet devient automatiquement chef de projet
     */
    public function test_store_ajoute_createur_comme_chef_de_projet()
    {
        // Créer le rôle "Chef de Projet" pour le test
        $chefRole = Role::create([
            'nom' => 'Chef de Projet',
            'description' => 'Responsable du projet avec tous les droits'
        ]);

        $projectData = [
            'nom' => 'Projet avec Chef',
            'description' => 'Test du rôle automatique',
            'date_debut' => now()->addDay()->toDateString(),
            'date_fin' => now()->addDays(30)->toDateString(),
        ];

        $response = $this->postJson('/api/projects', $projectData);

        if ($response->status() !== 201) {
            dd($response->json());
        }

        $response->assertStatus(201);
        
        $project = Project::where('nom', 'Projet avec Chef')->first();
        $this->assertNotNull($project);

        // Vérifier que l'utilisateur connecté est membre du projet
        $this->assertTrue($project->membres()->where('user_id', $this->user->id)->exists());

        // Vérifier que l'utilisateur a le rôle "Chef de Projet"
        $membership = $project->membres()->where('user_id', $this->user->id)->first();
        $this->assertEquals($chefRole->id, $membership->pivot->role_id);
    }

    /**
     * Test de validation lors de la création d'un projet
     */
    public function test_store_echoue_avec_donnees_invalides()
    {
        $projectData = [
            'nom' => '', // Nom requis
            'date_debut' => 'invalid-date', // Date invalide
            'date_fin' => now()->subDay()->toDateString(), // Date dans le passé
        ];

        $response = $this->postJson('/api/projects', $projectData);

        $response->assertStatus(422)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'errors'
                 ])
                 ->assertJson(['success' => false]);
    }

    /**
     * Test de validation : date_fin doit être après date_debut
     */
    public function test_store_echoue_si_date_fin_avant_date_debut()
    {
        $projectData = [
            'nom' => 'Projet Test',
            'date_debut' => now()->addDays(10)->toDateString(),
            'date_fin' => now()->addDays(5)->toDateString(), // Avant date_debut
        ];

        $response = $this->postJson('/api/projects', $projectData);

        $response->assertStatus(422)
                 ->assertJson(['success' => false]);
    }

    /**
     * Test d'affichage d'un projet spécifique (show)
     */
    public function test_show_retourne_un_projet_specifique()
    {
        $project = Project::factory()->create([
            'nom' => 'Projet de test',
            'description' => 'Description de test'
        ]);

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'id',
                         'nom',
                         'description',
                         'date_debut',
                         'date_fin',
                         'created_at',
                         'updated_at',
                         'membres',
                         'taches',
                         'messages'
                     ]
                 ])
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'id' => $project->id,
                         'nom' => 'Projet de test',
                         'description' => 'Description de test'
                     ]
                 ]);
    }

    /**
     * Test d'affichage d'un projet inexistant
     */
    public function test_show_retourne_404_pour_projet_inexistant()
    {
        $response = $this->getJson('/api/projects/999999');

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Projet non trouvé'
                 ]);
    }

    /**
     * Test de mise à jour d'un projet (update)
     */
    public function test_update_modifie_un_projet_existant()
    {
        $project = Project::factory()->create([
            'nom' => 'Ancien nom',
            'description' => 'Ancienne description'
        ]);

        $updateData = [
            'nom' => 'Nouveau nom',
            'description' => 'Nouvelle description'
        ];

        $response = $this->putJson("/api/projects/{$project->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Projet mis à jour avec succès',
                     'data' => [
                         'id' => $project->id,
                         'nom' => 'Nouveau nom',
                         'description' => 'Nouvelle description'
                     ]
                 ]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'nom' => 'Nouveau nom',
            'description' => 'Nouvelle description'
        ]);
    }

    /**
     * Test de mise à jour partielle d'un projet
     */
    public function test_update_partiel_modifie_seulement_les_champs_fournis()
    {
        $project = Project::factory()->create([
            'nom' => 'Nom original',
            'description' => 'Description originale'
        ]);

        $updateData = [
            'nom' => 'Nom modifié'
            // Description non fournie, ne doit pas changer
        ];

        $response = $this->putJson("/api/projects/{$project->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'nom' => 'Nom modifié',
                         'description' => 'Description originale' // Inchangée
                     ]
                 ]);
    }

    /**
     * Test de mise à jour d'un projet inexistant
     */
    public function test_update_retourne_404_pour_projet_inexistant()
    {
        $updateData = ['nom' => 'Nouveau nom'];

        $response = $this->putJson('/api/projects/999999', $updateData);

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Projet non trouvé'
                 ]);
    }

    /**
     * Test de suppression d'un projet (destroy)
     */
    public function test_destroy_supprime_un_projet()
    {
        $project = Project::factory()->create([
            'nom' => 'Projet à supprimer'
        ]);

        $response = $this->deleteJson("/api/projects/{$project->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => "Projet 'Projet à supprimer' supprimé avec succès"
                 ]);

        $this->assertDatabaseMissing('projects', [
            'id' => $project->id
        ]);
    }

    /**
     * Test de suppression d'un projet inexistant
     */
    public function test_destroy_retourne_404_pour_projet_inexistant()
    {
        $response = $this->deleteJson('/api/projects/999999');

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Projet non trouvé'
                 ]);
    }

    /**
     * Test de récupération des projets de l'utilisateur connecté
     */
    public function test_get_user_projects_retourne_projets_utilisateur()
    {
        // Créer des rôles de test
        $role = Role::create(['nom' => 'Membre']);
        
        // Créer des projets et associer l'utilisateur
        $userProjects = Project::factory()->count(2)->create();
        $otherProjects = Project::factory()->count(3)->create();

        // Associer l'utilisateur aux premiers projets via la table pivot avec un rôle
        foreach ($userProjects as $project) {
            $this->user->projets()->attach($project->id, ['role_id' => $role->id]);
        }

        $response = $this->getJson('/api/my-projects');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(2, 'data'); // Seuls les projets de l'utilisateur
    }

    /**
     * Test de validation du nom trop long
     */
    public function test_store_echoue_avec_nom_trop_long()
    {
        $projectData = [
            'nom' => str_repeat('a', 65), // 65 caractères, max 64
            'date_debut' => now()->addDay()->toDateString(),
            'date_fin' => now()->addDays(30)->toDateString(),
        ];

        $response = $this->postJson('/api/projects', $projectData);

        $response->assertStatus(422)
                 ->assertJson(['success' => false]);
    }

    /**
     * Test avec description null (autorisée)
     */
    public function test_store_accepte_description_nulle()
    {
        $projectData = [
            'nom' => 'Projet sans description',
            'description' => null,
            'date_debut' => now()->addDay()->toDateString(),
            'date_fin' => now()->addDays(30)->toDateString(),
        ];

        $response = $this->postJson('/api/projects', $projectData);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('projects', [
            'nom' => 'Projet sans description',
            'description' => null
        ]);
    }
}

/**
 * Test class pour vérifier l'authentification sans utilisateur connecté
 */
class ProjectControllerUnauthenticatedTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test d'accès non authentifié aux routes protégées
     */
    public function test_routes_necessitent_authentification()
    {
        // Créer un projet pour les tests
        $project = Project::factory()->create();

        // Tester toutes les routes protégées sans authentification
        $this->getJson('/api/projects')->assertStatus(401);
        $this->postJson('/api/projects', [])->assertStatus(401);
        $this->getJson("/api/projects/{$project->id}")->assertStatus(401);
        $this->putJson("/api/projects/{$project->id}", [])->assertStatus(401);
        $this->deleteJson("/api/projects/{$project->id}")->assertStatus(401);
        $this->getJson('/api/my-projects')->assertStatus(401);
    }
}
