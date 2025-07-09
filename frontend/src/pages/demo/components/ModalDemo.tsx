import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Page de démonstration des composants Modal
 */
export default function ModalDemo() {
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
          <h1 className="text-4xl font-bold mb-4">🎭 Composants Modal</h1>
          <p className="text-gray-600 text-lg">
            Fenêtres modales et dialogues réutilisables
          </p>
        </div>

        <div className="space-y-16">
          {/* Section placeholder */}
          <section className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-semibold mb-4">En cours de développement</h3>
              <p className="text-gray-600 mb-6">
                Les composants Modal seront ajoutés prochainement.<br/>
                Cette section contiendra des exemples de :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">🗑️ Modal de Suppression</h4>
                  <p className="text-sm text-gray-600">Confirmation avant suppression d'éléments</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">✏️ Modal d'Édition</h4>
                  <p className="text-sm text-gray-600">Formulaires d'édition en popup</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">ℹ️ Modal d'Information</h4>
                  <p className="text-sm text-gray-600">Affichage d'informations détaillées</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">➕ Modal de Création</h4>
                  <p className="text-sm text-gray-600">Formulaires de création d'éléments</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">⚠️ Modal d'Alerte</h4>
                  <p className="text-sm text-gray-600">Messages d'alerte et d'avertissement</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">🔧 Modal Personnalisée</h4>
                  <p className="text-sm text-gray-600">Modals avec contenu personnalisé</p>
                </div>
              </div>
            </div>
          </section>

          {/* Documentation préliminaire */}
          <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">📚 Documentation Modal (Prévisionnel)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Import futur</h3>
                <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`import { 
  ConfirmModal,
  EditModal,
  InfoModal,
  CreateModal 
} from '@/components/modals';`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Utilisation prévue</h3>
                <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`<ConfirmModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleConfirm}
  title="Confirmer la suppression"
  message="Êtes-vous sûr ?"
/>`}
                </pre>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Fonctionnalités prévues</h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li><strong>Accessibilité :</strong> Support clavier, focus management, ARIA</li>
                <li><strong>Animation :</strong> Transitions fluides d'ouverture/fermeture</li>
                <li><strong>Overlay :</strong> Arrière-plan semi-transparent avec fermeture au clic</li>
                <li><strong>Responsive :</strong> Adaptation mobile avec slide-up sur petit écran</li>
                <li><strong>Scroll :</strong> Gestion du scroll du body et contenu long</li>
                <li><strong>Tailles :</strong> Différentes tailles prédéfinies (sm, md, lg, xl)</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
