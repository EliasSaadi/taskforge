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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id(); // id_tache
            $table->string('titre', 128);
            $table->text('description')->nullable();
            $table->enum('statut', ['à faire', 'en cours', 'terminé']);
            $table->date('date_debut');
            $table->date('date_limite');

            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');

            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
