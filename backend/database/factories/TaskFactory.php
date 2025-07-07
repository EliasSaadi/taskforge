<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Le nom du modèle correspondant à cette factory.
     *
     * @var string
     */
    protected $model = Task::class;

    /**
     * Définir l'état par défaut du modèle.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dateDebut = $this->faker->dateTimeBetween('now', '+1 week');
        $dateLimite = $this->faker->dateTimeBetween($dateDebut, '+1 month');

        return [
            'titre' => $this->faker->sentence(4, false),
            'description' => $this->faker->paragraph(2),
            'statut' => $this->faker->randomElement(['à faire', 'en cours', 'terminé']),
            'date_debut' => $dateDebut->format('Y-m-d'),
            'date_limite' => $dateLimite->format('Y-m-d'),
            'project_id' => Project::factory(), // Crée un projet si non spécifié
        ];
    }

    /**
     * Indiquer que la tâche est en attente
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'à faire',
        ]);
    }

    /**
     * Indiquer que la tâche est en cours
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'en cours',
        ]);
    }

    /**
     * Indiquer que la tâche est terminée
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'terminé',
        ]);
    }

    /**
     * Tâche urgente avec date limite proche
     */
    public function urgent(): static
    {
        $dateDebut = $this->faker->dateTimeBetween('now', '+2 days');
        $dateLimite = $this->faker->dateTimeBetween($dateDebut, '+5 days');

        return $this->state(fn (array $attributes) => [
            'titre' => '[URGENT] ' . $this->faker->sentence(3, false),
            'date_debut' => $dateDebut->format('Y-m-d'),
            'date_limite' => $dateLimite->format('Y-m-d'),
        ]);
    }

    /**
     * Tâche avec un titre spécifique
     */
    public function withTitle(string $title): static
    {
        return $this->state(fn (array $attributes) => [
            'titre' => $title,
        ]);
    }

    /**
     * Tâche pour un projet spécifique
     */
    public function forProject(int $projectId): static
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => $projectId,
        ]);
    }
}
