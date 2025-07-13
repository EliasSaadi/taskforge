import { Plus } from 'lucide-react';
import { useProjects } from '@/contexts/project/ProjectContext';
import { ProjectCard } from '@/components/card';
import { LoaderSpin } from '@/components/ui';

const Dashboard = () => {
  const { projects, loading, error, removeProject, clearError } = useProjects();

  // Gérer la suppression d'un projet depuis la carte
  const handleProjectDeleted = (projectId: number) => {
    removeProject(projectId);
  };

  // Composant pour l'état vide (aucun projet)
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <h1 className="tf-text-h2 font-bold mb-4 text-tf-night">Aucun projet trouvé</h1>
      <p className="tf-text-base mb-6 text-tf-battleship max-w-md">
        Vous ne participez à aucun projet pour le moment. 
        Commencez par en créer un ou demandez à être ajouté à un projet existant !
      </p>
      <button
        data-modal-target="" // TODO: Ajouter l'ID de la modal de création de projet
        data-modal-toggle="" // TODO: Ajouter l'ID de la modal de création de projet
        className="bg-tf-erin px-6 py-3 tf-text-button rounded-lg hover:bg-tf-lime
                  hover:scale-105 duration-300 transition-transform
                  flex items-center gap-2 shadow-[3px_3px_6px_rgba(0,0,0,0.25)]"
      >
        <Plus size={20} /> Créer un projet
      </button>
    </div>
  );

  // Composant pour l'état d'erreur
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <h1 className="tf-text-h2 font-bold mb-4 text-tf-folly">Erreur de chargement</h1>
      <p className="tf-text-base mb-6 text-tf-battleship max-w-md">
        {error}
      </p>
      <button
        onClick={clearError}
        className="bg-tf-battleship px-6 py-3 tf-text-button rounded-lg hover:bg-gray-500 text-white
                  hover:scale-105 duration-300 transition-transform"
      >
        Réessayer
      </button>
    </div>
  );

  // Affichage du loader pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderSpin size="lg" />
      </div>
    );
  }

  // Affichage de l'erreur s'il y en a une
  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-tf-platinum p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="tf-text-h1 text-tf-night mb-2">Mes Projets</h1>
            <p className="tf-text-base text-tf-battleship">
              {projects.length > 0 
                ? `Vous participez à ${projects.length} projet${projects.length > 1 ? 's' : ''}`
                : 'Vous ne participez à aucun projet pour le moment'
              }
            </p>
          </div>
          
          <button
            data-modal-target="" // TODO: Ajouter l'ID de la modal de création de projet
            data-modal-toggle="" // TODO: Ajouter l'ID de la modal de création de projet
            className="bg-tf-erin px-6 py-3 tf-text-button rounded-lg hover:bg-tf-lime
                      hover:scale-105 duration-300 transition-transform
                      flex items-center gap-2 shadow-[3px_3px_6px_rgba(0,0,0,0.25)]"
          >
            <Plus size={20} /> Nouveau projet
          </button>
        </div>

        {/* Grille des projets */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onProjectDeleted={handleProjectDeleted}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Dashboard;