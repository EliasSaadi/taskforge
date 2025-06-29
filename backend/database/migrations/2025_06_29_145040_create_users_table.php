<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // équivalent à id_utilisateur COUNTER
            $table->string('nom', 64);
            $table->string('prenom', 64);
            $table->string('email', 128)->unique();
            $table->string('password'); // Laravel attend un champ "password", donc on ne garde pas "mdp"
            $table->boolean('actif')->default(true);
            $table->string('theme', 32)->nullable();
            $table->timestamps(); // Ajoute created_at et updated_at automatiquement
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
