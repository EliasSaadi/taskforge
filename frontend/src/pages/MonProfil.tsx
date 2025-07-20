import { useAuth } from '@/contexts/core/AuthContext';
import { formatDate } from '@/lib/utils/dateUtils';
import { DeleteModal } from '@/components/modals/Delete';
import { useDelete } from '@/contexts/core/DeleteContext';
import { LoaderSpin } from '@/components/ui';
import { useState } from 'react';

const MonProfil = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRedirectingAfterDelete, setIsRedirectingAfterDelete] = useState(false);
  const { isDeleting, deleteCurrentAccount } = useDelete();

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      return;
    }
    
    const success = await deleteCurrentAccount(user.id);
    
    if (success) {
      setShowDeleteModal(false);
      setIsRedirectingAfterDelete(true);
      
      // Délai pour afficher le loader avant la déconnexion/redirection
      setTimeout(() => {
        logout(); // Déconnecter l'utilisateur
        setIsRedirectingAfterDelete(false);
      }, 1500);
    } else {
      setShowDeleteModal(false);
    }
    // Les erreurs sont gérées automatiquement par le contexte et affichées via les notifications
  };

  // Fermer la modale
  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {/* LoaderSpin en plein écran pendant la redirection après suppression */}
      {isRedirectingAfterDelete && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <LoaderSpin size="xl" />
        </div>
      )}
      
      {/* LoaderSpin en plein écran pendant la déconnexion */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <LoaderSpin size="xl" />
        </div>
      )}
      
      <div className="min-w-[512px] flex flex-col items-center gap-8">
        <div className="flex justify-between items-center w-full">
            <h1 className="tf-text-h2">Mon Profil</h1>
            <button className="bg-tf-dodger px-5 py-3 tf-text-button rounded-lg
                      hover:scale-105 duration-300 transition-transform">
                Modifier
            </button>
        </div>
        
        {user && (
            <div className="flex flex-col px-4 py-6 gap-4 rounded-lg shadow-lg border-2 border-tf-battleship w-full">  
                <div className="flex items-center gap-8 w-full">
                    <div className="flex flex-col justify-start items-center gap-4">
                        <div className="w-full">
                            <span className="tf-text-label">Prénom</span>
                            <p className="tf-text-base">{user.prenom}</p>
                        </div>

                        <div className="w-full">
                            <span className="tf-text-label">Email</span>
                            <p className="tf-text-base">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="w-full">
                            <span className="tf-text-label">Nom</span>
                            <p className="tf-text-base">{user.nom}</p>
                        </div>

                        <div className="w-full">
                            <span className="tf-text-label">Membre depuis</span>
                            <p className="tf-text-base">
                                {formatDate(user.created_at)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full py-[2px] bg-tf-davys rounded-full"></div>

                <div className="flex justify-between items-center">
                    <button className="bg-tf-fuschia px-5 py-3 tf-text-button rounded-lg hover:bg-tf-steelpink hover:scale-105 duration-300 transition-transform">
                        Modifier le mot de passe
                    </button>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-tf-folly px-5 py-3 tf-text-button rounded-lg hover:scale-105 duration-300 transition-transform"
                    >
                        Supprimer le compte
                    </button>
                </div>
            </div>
        )}

        {/* Modale de suppression du compte */}
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseModal}
          onConfirm={handleDeleteAccount}
          itemType="utilisateur"
          itemName={user ? `${user.prenom} ${user.nom}` : undefined}
          isLoading={isDeleting}
        />
      </div>
    </>
  );
};

export default MonProfil;
