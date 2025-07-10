import { Header, Footer } from '@/components/layouts';

/**
 * Page de démonstration des composants Layout
 */
export default function LayoutDemo() {
  return (
    <div className="min-h-screen">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">🏗️ Composants Layout</h1>
            <p className="text-gray-600 text-lg">
              Composants de mise en page et structure de l'application
            </p>
          </div>

          <div className="space-y-16">
            {/* Section Header */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold border-b-2 border-gray-200 pb-2">📌 Header</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Header de navigation</h3>
                <p className="text-gray-600 mb-6">
                  Barre de navigation principale avec logo, menu et actions utilisateur
                </p>
                
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <Header />
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Fonctionnalités du Header</h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Logo et nom de l'application</li>
                    <li>Navigation principale (Dashboard, Profil)</li>
                    <li>Indicateur de statut utilisateur</li>
                    <li>Bouton de déconnexion</li>
                    <li>Menu responsive pour mobile</li>
                    <li>États de chargement intégrés</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section Footer */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold border-b-2 border-gray-200 pb-2">📌 Footer</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Footer de l'application</h3>
                <p className="text-gray-600 mb-6">
                  Pied de page avec informations et liens utiles
                </p>
                
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <Footer />
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Contenu du Footer</h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Informations de copyright</li>
                    <li>Liens vers les conditions d'utilisation</li>
                    <li>Version de l'application</li>
                    <li>Liens de contact ou support</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section LayoutPublic */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold border-b-2 border-gray-200 pb-2">🎨 LayoutPublic</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Layout complet</h3>
                <p className="text-gray-600 mb-6">
                  Structure complète avec Header, contenu principal et Footer
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">📝 Note sur LayoutPublic</h4>
                    <p className="text-blue-700 text-sm">
                      Le LayoutPublic est utilisé comme wrapper dans App.tsx et contient la structure 
                      générale de l'application avec Header + Outlet + Footer. Il s'adapte automatiquement 
                      selon si l'utilisateur est connecté ou non.
                    </p>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Structure du layout</h4>
                    <pre className="text-sm bg-gray-800 text-white p-3 rounded overflow-x-auto">
{`<div className="min-h-screen flex flex-col">
  <Header />
  <main className="flex-1">
    <Outlet /> {/* Contenu de la page */}
  </main>
  <Footer />
</div>`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Documentation */}
            <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">📚 Documentation Layout</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Import des composants</h3>
                  <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`import { 
  LayoutPublic, 
  Header, 
  Footer 
} from '@/components/layouts';`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Utilisation dans le routing</h3>
                  <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`{
  path: '/dashboard',
  element: <LayoutPublic />,
  children: [
    { index: true, element: <Dashboard /> }
  ]
}`}
                  </pre>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Caractéristiques</h3>
                <ul className="text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Header :</strong> Navigation adaptative, gestion des états utilisateur</li>
                  <li><strong>Footer :</strong> Informations statiques, liens utiles</li>
                  <li><strong>LayoutPublic :</strong> Structure flex avec Header fixe et Footer en bas</li>
                  <li><strong>Responsive :</strong> Tous les composants s'adaptent aux différentes tailles d'écran</li>
                  <li><strong>Contexte :</strong> Intégration avec AuthContext pour les états utilisateur</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
