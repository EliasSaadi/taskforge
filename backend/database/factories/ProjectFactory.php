<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Le nom du modèle correspondant à cette factory.
     *
     * @var string
     */
    protected $model = Project::class;

    /**
     * Définir l'état par défaut du modèle.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dateDebut = $this->faker->dateTimeBetween('now', '+1 week');
        $dateFin = $this->faker->dateTimeBetween($dateDebut, '+3 months');

        return [
            'nom' => $this->faker->sentence(3, false), // Nom de projet court
            'description' => $this->faker->paragraph(3), // Description plus longue
            'date_debut' => $dateDebut->format('Y-m-d'),
            'date_fin' => $dateFin->format('Y-m-d'),
        ];
    }

    /**
     * Indiquer que le projet a déjà commencé
     */
    public function started(): static
    {
        $dateDebut = $this->faker->dateTimeBetween('-1 month', 'now');
        $dateFin = $this->faker->dateTimeBetween('now', '+2 months');

        return $this->state(fn (array $attributes) => [
            'date_debut' => $dateDebut->format('Y-m-d'),
            'date_fin' => $dateFin->format('Y-m-d'),
        ]);
    }

    /**
     * Indiquer que le projet est terminé
     */
    public function finished(): static
    {
        $dateDebut = $this->faker->dateTimeBetween('-3 months', '-1 month');
        $dateFin = $this->faker->dateTimeBetween($dateDebut, 'now');

        return $this->state(fn (array $attributes) => [
            'date_debut' => $dateDebut->format('Y-m-d'),
            'date_fin' => $dateFin->format('Y-m-d'),
        ]);
    }

    /**
     * Indiquer que le projet est urgent (courte durée)
     */
    public function urgent(): static
    {
        $dateDebut = $this->faker->dateTimeBetween('now', '+3 days');
        $dateFin = $this->faker->dateTimeBetween($dateDebut, '+1 week');

        return $this->state(fn (array $attributes) => [
            'nom' => '[URGENT] ' . $this->faker->sentence(2, false),
            'date_debut' => $dateDebut->format('Y-m-d'),
            'date_fin' => $dateFin->format('Y-m-d'),
        ]);
    }

    /**
     * Projet sans description
     */
    public function withoutDescription(): static
    {
        return $this->state(fn (array $attributes) => [
            'description' => null,
        ]);
    }

    /**
     * Projet avec un nom spécifique
     */
    public function withName(string $name): static
    {
        return $this->state(fn (array $attributes) => [
            'nom' => $name,
        ]);
    }
}
