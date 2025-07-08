import { LoaderSpin, LoaderDots, Notification } from '@/components/ui';
import { useNotification } from '@/contexts/NotificationContext';
import { useState } from 'react';

/**
 * Page de démonstration de tous les composants UI
 * Utile pour tester visuellement tous les composants et leurs variantes
 */
export default function ComponentsDemo() {
  const { showSuccess, showError } = useNotification();
  const [showStaticNotification, setShowStaticNotification] = useState(false);
  
  return (
    <div className="min-h-screen p-8 space-y-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Démonstration des Composants UI</h1>
        <p className="text-gray-600 text-center mb-8">
          Tous les composants UI réutilisables avec leurs variantes et exemples d'utilisation
        </p>

        {/* Section Navigation */}
        <nav className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">Navigation rapide</h2>
          <div className="flex flex-wrap gap-4">
            <a href="#loaders" className="text-blue-600 hover:text-blue-800 underline">Loaders</a>
            <a href="#notifications" className="text-blue-600 hover:text-blue-800 underline">Notifications</a>
            <a href="#contextes" className="text-blue-600 hover:text-blue-800 underline">Utilisation en contexte</a>
          </div>
        </nav>

        {/* Section Loaders */}
        <section id="loaders" className="space-y-8">
          <h2 className="text-3xl font-bold border-b-2 border-gray-200 pb-2">🔄 Composants de Chargement</h2>
          
          {/* LoaderSpin */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">LoaderSpin</h3>
            <p className="text-gray-600 mb-6">Composant avec animation de double cercle rotatif</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium">Small</span>
                <LoaderSpin size="sm" />
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">size="sm"</code>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium">Medium</span>
                <LoaderSpin size="md" />
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">size="md"</code>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium">Large</span>
                <LoaderSpin size="lg" />
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">size="lg"</code>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium">Extra Large</span>
                <LoaderSpin size="xl" />
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">size="xl"</code>
              </div>
            </div>
          </div>

          {/* LoaderDots */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">LoaderDots</h3>
            <p className="text-gray-600 mb-6">Composant avec animation de rebond de trois points</p>
            
            {/* Tailles */}
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">Tailles disponibles</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-medium">Extra Small</span>
                  <LoaderDots size="xs" />
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">size="xs"</code>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-medium">Small</span>
                  <LoaderDots size="sm" />
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">size="sm"</code>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-medium">Medium</span>
                  <LoaderDots size="md" />
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">size="md"</code>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-medium">Large</span>
                  <LoaderDots size="lg" />
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">size="lg"</code>
                </div>
              </div>
            </div>

            {/* Couleurs */}
            <div>
              <h4 className="text-lg font-medium mb-4">Couleurs disponibles</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-medium">Blue (défaut)</span>
                  <LoaderDots color="blue" />
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">color="blue"</code>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-medium">Green</span>
                  <LoaderDots color="green" />
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">color="green"</code>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-medium">Purple</span>
                  <LoaderDots color="purple" />
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">color="purple"</code>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-medium">Red</span>
                  <LoaderDots color="red" />
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">color="red"</code>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-medium">Gray</span>
                  <LoaderDots color="gray" />
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">color="gray"</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Notifications */}
        <section id="notifications" className="space-y-8">
          <h2 className="text-3xl font-bold border-b-2 border-gray-200 pb-2">🔔 Système de Notifications</h2>
          
          {/* Tests de notifications contextuelles */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Notifications contextuelles</h3>
            <p className="text-gray-600 mb-6">
              Système global de notifications avec auto-fermeture et empilage
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Tests de base</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => showSuccess('Votre action a été effectuée avec succès !')}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Notification de succès
                  </button>
                  <button
                    onClick={() => showError('Une erreur s\'est produite lors de l\'opération.')}
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Notification d'erreur
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Tests avancés</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      showSuccess('Les données ont été sauvegardées.', 'Sauvegarde réussie');
                      setTimeout(() => {
                        showError('Impossible de se connecter au serveur.', 'Erreur de connexion');
                      }, 1000);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Titres personnalisés
                  </button>
                  <button
                    onClick={() => {
                      showSuccess('Première notification');
                      setTimeout(() => showError('Notification d\'erreur'), 500);
                      setTimeout(() => showSuccess('Deuxième notification'), 1000);
                    }}
                    className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Notifications multiples
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification statique pour démonstration */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Composant Notification statique</h3>
            <p className="text-gray-600 mb-6">
              Aperçu visuel des variantes du composant Notification
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowStaticNotification(!showStaticNotification)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {showStaticNotification ? 'Masquer' : 'Afficher'} les notifications statiques
              </button>

              {showStaticNotification && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="max-w-md">
                    <Notification
                      type="success"
                      message="Votre compte a bien été supprimé."
                      onClose={() => setShowStaticNotification(false)}
                      title="Suppression réussie"
                    />
                  </div>
                  <div className="max-w-md">
                    <Notification
                      type="error"
                      message="Impossible de supprimer l'élément. Vérifiez vos permissions."
                      onClose={() => setShowStaticNotification(false)}
                      title="Erreur de suppression"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section Utilisation en contexte */}
        <section id="contextes" className="space-y-8">
          <h2 className="text-3xl font-bold border-b-2 border-gray-200 pb-2">🎯 Utilisation en Contexte</h2>
          
          {/* Dans des boutons */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Dans des boutons</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                <LoaderDots size="sm" color="custom" customColor="bg-white" />
                <span>Envoi en cours...</span>
              </button>
              <button className="bg-green-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                <LoaderSpin size="sm" />
                <span>Traitement...</span>
              </button>
              <button className="bg-purple-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors">
                <LoaderDots size="sm" color="custom" customColor="bg-white" />
                <span>Sauvegarde...</span>
              </button>
            </div>
          </div>

          {/* Texte inline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Texte inline</h3>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-center gap-2">
                Chargement des données <LoaderDots size="xs" /> veuillez patienter...
              </p>
              <p className="flex items-center gap-2">
                Connexion au serveur <LoaderSpin size="sm" />
              </p>
              <p className="flex items-center gap-2">
                Téléchargement en cours <LoaderDots size="sm" color="green" /> 45%
              </p>
            </div>
          </div>

          {/* Sections de contenu */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">Sections de contenu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
                <LoaderSpin size="lg" />
                <p className="mt-4 text-gray-600">Chargement des projets...</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
                <LoaderDots size="lg" color="purple" />
                <p className="mt-4 text-gray-600">Synchronisation en cours...</p>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation technique */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📚 Documentation Technique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Import des composants</h3>
              <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`import { 
  LoaderSpin, 
  LoaderDots, 
  Notification 
} from '@/components/ui';`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Contexte de notification</h3>
              <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`import { useNotification } from '@/contexts/NotificationContext';

const { showSuccess, showError } = useNotification();
showSuccess('Message de succès');`}
              </pre>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Caractéristiques</h3>
            <ul className="text-gray-700 space-y-1 list-disc list-inside">
              <li><strong>Loaders :</strong> Animations optimisées, multiple tailles et couleurs</li>
              <li><strong>Notifications :</strong> Auto-fermeture (5s), fermeture manuelle, empilage</li>
              <li><strong>Structure :</strong> Composants organisés dans des sous-dossiers cohérents</li>
              <li><strong>TypeScript :</strong> Types complets et documentation JSDoc</li>
              <li><strong>Responsive :</strong> Adaptatif sur tous les écrans</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
