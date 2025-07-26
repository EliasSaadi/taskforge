<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_cree_un_utilisateur()
    {
        $response = $this->postJson('/api/register', [
            'prenom' => 'Lucie',
            'nom' => 'Dupont',
            'email' => 'lucie@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'user']);
        
        $this->assertDatabaseHas('users', [
            'email' => 'lucie@example.com',
        ]);
    }

    public function test_login_avec_credential_valide()
    {
        $user = User::factory()->create([
            'email' => 'valid@example.com',
            'password' => Hash::make('validpassword'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'valid@example.com',
            'password' => 'validpassword',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'user']);
    }

    public function test_login_avec_credential_invalide()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'wrong@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Identifiants invalides']);
    }

    public function test_logout()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Déconnexion réussie']);
    }

    public function test_user_route_renvoie_user_connecte()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Utilisateurs récupérés avec succès']);
    }
}
