import { useAuth } from '@/contexts/AuthContext';

const MonProfil = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="tf-text-h1 mb-6">Mon Profil</h1>
        
        {user && (
          <div className="bg-tf-platinum rounded-lg p-6 shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="tf-text-label">Prénom</label>
                <p className="tf-text-base font-medium">{user.prenom}</p>
              </div>
              
              <div>
                <label className="tf-text-label">Nom</label>
                <p className="tf-text-base font-medium">{user.nom}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="tf-text-label">Email</label>
                <p className="tf-text-base font-medium">{user.email}</p>
              </div>
              
              <div>
                <label className="tf-text-label">Membre depuis</label>
                <p className="tf-text-base font-medium">
                  {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div>
                <label className="tf-text-label">Statut</label>
                <p className="tf-text-base font-medium">
                  {user.actif ? 'Actif' : 'Inactif'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-tf-davys">
              <button className="bg-tf-fuschia px-5 py-3 tf-text-button rounded-lg hover:bg-tf-steelpink hover:scale-105 duration-300 transition-transform">
                Modifier le profil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonProfil;
