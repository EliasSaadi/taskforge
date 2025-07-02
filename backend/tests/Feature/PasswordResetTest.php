<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_utilisateur_peut_recevoir_un_token_de_reinitialisation()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/password/forgot', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'reset_link']);

        $this->assertDatabaseHas('password_resets', [
            'email' => $user->email,
        ]);
    }

    public function test_un_token_est_requis_et_valide_pour_reset()
    {
        $user = User::factory()->create();

        // Simulation : on génère manuellement un token haché
        $plainToken = Str::random(64);
        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => Hash::make($plainToken),
            'created_at' => now(),
        ]);

        $response = $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'token' => $plainToken,
            'password' => 'nouveaumdp123',
            'password_confirmation' => 'nouveaumdp123',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Mot de passe réinitialisé avec succès']);

        // Le mot de passe est bien modifié
        $this->assertTrue(Hash::check('nouveaumdp123', $user->fresh()->password));
    }

    public function test_un_token_invalide_doit_echouer()
    {
        $user = User::factory()->create();

        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => Hash::make(Str::random(64)),
            'created_at' => now(),
        ]);

        $response = $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'token' => 'token_incorrect',
            'password' => 'abc123456',
            'password_confirmation' => 'abc123456',
        ]);

        $response->assertStatus(400)
                 ->assertJson(['message' => 'Token invalide']);
    }

    public function test_un_token_expire_est_refuse()
    {
        $user = User::factory()->create();

        $plainToken = Str::random(64);
        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => Hash::make($plainToken),
            'created_at' => now()->subHours(2), // Expiré
        ]);

        $response = $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'token' => $plainToken,
            'password' => 'nouveau456',
            'password_confirmation' => 'nouveau456',
        ]);

        $response->assertStatus(400)
                 ->assertJson(['message' => 'Token expiré']);
    }
}
