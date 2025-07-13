import { LoaderSpin, LoaderDots, Notification, StatusSelect, RoleSelect } from '@/components/ui';
import { useNotification } from '@/contexts/core/NotificationContext';
import { useState } from 'react';

/**
 * Page de démonstration des composants UI (loaders, notifications, selects)
 */
export default function UIDemo() {
  const { showSuccess, showError } = useNotification();
  const [showStaticNotification, setShowStaticNotification] = useState(false);
  
  // États pour StatusSelect
  const [statusValue1, setStatusValue1] = useState<'à faire' | 'en cours' | 'terminé'>('à faire');
  const [statusValue2, setStatusValue2] = useState<'à faire' | 'en cours' | 'terminé'>('en cours');
  const [statusValue3, setStatusValue3] = useState<'à faire' | 'en cours' | 'terminé'>('terminé');
  
  // États pour RoleSelect
  const [roleValue1, setRoleValue1] = useState<'Chef de Projet' | 'Assistant' | 'Membre'>('Chef de Projet');
  const [roleValue2, setRoleValue2] = useState<'Chef de Projet' | 'Assistant' | 'Membre'>('Assistant');
  const [roleValue3, setRoleValue3] = useState<'Chef de Projet' | 'Assistant' | 'Membre'>('Membre');
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🎨 Composants UI</h1>
          <p className="text-gray-600 text-lg">
            Loaders, notifications, sélecteurs et autres composants d'interface
          </p>
        </div>

        <div className="space-y-16">
          {/* Section Loaders */}
          <section id="loaders" className="space-y-4">
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

          {/* Section StatusSelect */}
          <section id="statusselect" className="space-y-4">
            <h2 className="text-3xl font-bold border-b-2 border-gray-200 pb-2">🎯 Sélecteur de Statut</h2>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">StatusSelect</h3>
              <p className="text-gray-600 mb-6">
                Composant de sélection de statut avec couleurs spécifiques et gestion du disabled
              </p>

              {/* États interactifs */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">États interactifs</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">À faire (modifiable)</span>
                    <StatusSelect
                      value={statusValue1}
                      onChange={setStatusValue1}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">value="à faire"</code>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">En cours (modifiable)</span>
                    <StatusSelect
                      value={statusValue2}
                      onChange={setStatusValue2}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">value="en cours"</code>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">Terminé (modifiable)</span>
                    <StatusSelect
                      value={statusValue3}
                      onChange={setStatusValue3}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">value="terminé"</code>
                  </div>
                </div>
              </div>

              {/* États disabled */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">États disabled (non modifiables)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">À faire (disabled)</span>
                    <StatusSelect
                      value="à faire"
                      disabled={true}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">disabled=true</code>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">En cours (disabled)</span>
                    <StatusSelect
                      value="en cours"
                      disabled={true}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">disabled=true</code>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">Terminé (disabled)</span>
                    <StatusSelect
                      value="terminé"
                      disabled={true}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">disabled=true</code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section RoleSelect */}
          <section id="roleselect" className="space-y-4">
            <h2 className="text-3xl font-bold border-b-2 border-gray-200 pb-2">👥 Sélecteur de Rôle</h2>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">RoleSelect</h3>
              <p className="text-gray-600 mb-6">
                Composant de sélection de rôle avec couleurs spécifiques et gestion du disabled
              </p>

              {/* États interactifs */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Rôles interactifs</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">Chef de Projet (modifiable)</span>
                    <RoleSelect
                      value={roleValue1}
                      onChange={setRoleValue1}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">Fuschia (violet)</code>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">Assistant (modifiable)</span>
                    <RoleSelect
                      value={roleValue2}
                      onChange={setRoleValue2}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">Erin (vert)</code>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">Membre (modifiable)</span>
                    <RoleSelect
                      value={roleValue3}
                      onChange={setRoleValue3}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">Battleship (gris)</code>
                  </div>
                </div>
              </div>

              {/* États disabled */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">Rôles disabled (non modifiables)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">Chef de Projet (disabled)</span>
                    <RoleSelect
                      value="Chef de Projet"
                      disabled={true}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">disabled=true</code>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">Assistant (disabled)</span>
                    <RoleSelect
                      value="Assistant"
                      disabled={true}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">disabled=true</code>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium">Membre (disabled)</span>
                    <RoleSelect
                      value="Membre"
                      disabled={true}
                    />
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">disabled=true</code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Notifications */}
          <section id="notifications" className="space-y-4">
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
        </div>
      </div>
    </div>
  );
}
