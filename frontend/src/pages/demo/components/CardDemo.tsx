import { ProjectCard } from '@/components/card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Page de démonstration des composants Card
 */
export default function CardDemo() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation retour */}
        <div className="mb-8">
          <Link 
            to="/demo" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Retour à la page démo principale</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🃏 Composants Card</h1>
          <p className="text-gray-600 text-lg">
            Cartes réutilisables pour afficher différents types de contenu
          </p>
        </div>

        <div className="space-y-16">
          {/* Section ProjectCard */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold border-b-2 border-gray-200 pb-2">📋 ProjectCard</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">ProjectCard - Différents rôles et statuts</h3>
              <p className="text-gray-600 mb-6">
                Carte de projet avec affichage du rôle, progression, statut et actions selon les permissions
              </p>
              
              {/* Exemples de cartes */}
              <div className="space-y-8">
                {/* Carte 1: Membre avec statut à faire */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Membre</span>
                    Statut "à faire" - Progression 0%
                  </h4>
                  <div className="flex justify-center">
                    <ProjectCard
                      project={{
                        id: 1,
                        nom: 'Projet Alpha',
                        description: 'Développement d\'une nouvelle fonctionnalité pour améliorer l\'expérience utilisateur',
                        dateDebut: '2027-01-01',
                        dateFin: '2028-12-31',
                        dateCreation: '2023-01-01',
                        user_role: 'Membre',
                        progressPercentage: 0,
                      }}
                      onProjectDeleted={(id) => console.log(`Projet ${id} supprimé`)}
                    />
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    • Pas de bouton de suppression (rôle Membre)<br/>
                    • Icône utilisateur grise<br/>
                    • Statut calculé selon les dates
                  </div>
                </div>

                {/* Carte 2: Chef de Projet avec statut en cours */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Chef de Projet</span>
                    Statut "en cours" - Progression 65%
                  </h4>
                  <div className="flex justify-center">
                    <ProjectCard
                      project={{
                        id: 2,
                        nom: 'Projet Beta',
                        description: 'Développement de la nouvelle application mobile avec interface moderne',
                        dateDebut: '2024-06-01',
                        dateFin: '2025-12-31',
                        dateCreation: '2024-05-15',
                        user_role: 'Chef de Projet',
                        progressPercentage: 65,
                      }}
                      onProjectDeleted={(id) => console.log(`Projet ${id} supprimé`)}
                    />
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    • Bouton de suppression visible (rôle Chef de Projet)<br/>
                    • Icône couronne rose<br/>
                    • Barre de progression dynamique
                  </div>
                </div>

                {/* Carte 3: Assistant avec statut terminé */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Assistant</span>
                    Statut "terminé" - Progression 100%
                  </h4>
                  <div className="flex justify-center">
                    <ProjectCard
                      project={{
                        id: 3,
                        nom: 'Projet Gamma',
                        description: 'Migration complète de la base de données vers le cloud avec optimisations',
                        dateDebut: '2023-01-15',
                        dateFin: '2024-03-30',
                        dateCreation: '2023-01-01',
                        user_role: 'Assistant',
                        progressPercentage: 100,
                      }}
                      onProjectDeleted={(id) => console.log(`Projet ${id} supprimé`)}
                    />
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    • Pas de bouton de suppression (rôle Assistant)<br/>
                    • Icône groupe verte<br/>
                    • Projet terminé avec progression complète
                  </div>
                </div>

                {/* Carte 4: Projet avec nom long */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Test Design</span>
                    Nom de projet très long
                  </h4>
                  <div className="flex justify-center">
                    <ProjectCard
                      project={{
                        id: 4,
                        nom: 'Projet Delta - Refonte Complète du Système de Gestion',
                        description: 'Un projet avec un nom particulièrement long pour tester l\'affichage et le comportement responsive de la carte projet',
                        dateDebut: '2024-01-01',
                        dateFin: '2024-12-31',
                        dateCreation: '2023-12-01',
                        user_role: 'Chef de Projet',
                        progressPercentage: 32,
                      }}
                      onProjectDeleted={(id) => console.log(`Projet ${id} supprimé`)}
                    />
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    • Test du comportement avec nom long<br/>
                    • Adaptation responsive<br/>
                    • Gestion de l\'ellipsis ou wrapping
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">📚 Documentation ProjectCard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Props disponibles</h4>
                  <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`interface ProjectCardProps {
  project: Projet;
  onProjectDeleted: (id: number) => void;
}`}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Utilisation</h4>
                  <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`import { ProjectCard } from '@/components/card';

<ProjectCard 
  project={projectData}
  onProjectDeleted={handleDelete}
/>`}
                  </pre>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Fonctionnalités</h4>
                <ul className="text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Rôles :</strong> Affichage conditionnel selon le rôle (Chef de Projet, Assistant, Membre)</li>
                  <li><strong>Progression :</strong> Barre de progression dynamique avec pourcentage</li>
                  <li><strong>Statut :</strong> Calculé automatiquement selon les dates (à faire, en cours, terminé)</li>
                  <li><strong>Actions :</strong> Bouton de suppression visible uniquement pour les chefs de projet</li>
                  <li><strong>Navigation :</strong> Clic sur la carte pour aller vers la page de détail</li>
                  <li><strong>Modal :</strong> Confirmation de suppression intégrée</li>
                  <li><strong>Responsive :</strong> Taille fixe optimisée pour grille de cartes</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
