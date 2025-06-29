import { Plus } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="tf-text-h1 font-bold mb-4">Bienvenue sur TaskForge</h1>
      <p className="text-lg mb-8">Votre plateforme de gestion de tâches collaborative.</p>
      <button
          data-modal-target="registerModal"
          data-modal-toggle="registerModal"
          className="bg-tf-erin px-5 py-3 tf-text-button rounded-lg hover:bg-tf-lime
                      hover:scale-105 duration-300 transition-transform
                      flex items-center gap-1"
        >
          <Plus/> Créer un projet
      </button>
    </div>
  );
}

export default Home;