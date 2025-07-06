import { Plus } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="tf-text-h1 font-bold mb-4">Vous n'avez pas de projet</h1>
      <button
          data-modal-target="" // Ajoute l'ID de ton modal ici
          data-modal-toggle="" // Ajoute l'ID de ton modal ici
          className="bg-tf-erin px-5 py-3 tf-text-button rounded-lg hover:bg-tf-lime
                      hover:scale-105 duration-300 transition-transform
                      flex items-center gap-1"
        >
          <Plus/> Créer un projet
      </button>
    </div>
  );
}

export default Dashboard;