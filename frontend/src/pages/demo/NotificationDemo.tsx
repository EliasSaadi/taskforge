import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';

/**
 * Page de démonstration pour tester les notifications
 */
export const NotificationDemo: React.FC = () => {
  const { showSuccess, showError } = useNotification();

  const handleTestSuccess = () => {
    showSuccess('Votre action a été effectuée avec succès !');
  };

  const handleTestError = () => {
    showError('Une erreur s\'est produite lors de l\'opération.');
  };

  const handleTestCustomTitles = () => {
    showSuccess('Les données ont été sauvegardées.', 'Sauvegarde réussie');
    setTimeout(() => {
      showError('Impossible de se connecter au serveur.', 'Erreur de connexion');
    }, 1000);
  };

  const handleTestMultiple = () => {
    showSuccess('Première notification de succès');
    setTimeout(() => {
      showError('Notification d\'erreur');
    }, 500);
    setTimeout(() => {
      showSuccess('Deuxième notification de succès');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Démonstration des notifications
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tests de base */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tests de base</h3>
              <div className="space-y-3">
                <button
                  onClick={handleTestSuccess}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Notification de succès
                </button>
                <button
                  onClick={handleTestError}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Notification d'erreur
                </button>
              </div>
            </div>

            {/* Tests avancés */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tests avancés</h3>
              <div className="space-y-3">
                <button
                  onClick={handleTestCustomTitles}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Titres personnalisés
                </button>
                <button
                  onClick={handleTestMultiple}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Notifications multiples
                </button>
              </div>
            </div>
          </div>

          {/* Exemples de suppression */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Notification de suppression de compte :</h3>
            <div className="text-blue-700 text-sm space-y-1">
              <p>Après la suppression d'un compte utilisateur, une notification apparaîtra automatiquement :</p>
              <p className="bg-white p-2 rounded border-l-4 border-green-400">
                <strong>Succès</strong><br />
                Votre compte a bien été supprimé.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Fonctionnalités :</h3>
            <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
              <li>Auto-fermeture après 5 secondes</li>
              <li>Fermeture manuelle avec le bouton ×</li>
              <li>Support de titres personnalisés</li>
              <li>Animations d'entrée</li>
              <li>Empilage de plusieurs notifications</li>
              <li>Styles différents pour succès et erreur</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
