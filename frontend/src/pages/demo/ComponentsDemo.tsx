import { Link } from 'react-router-dom';

/**
 * Page principale de démonstration avec navigation vers les sous-pages
 */
export default function ComponentsDemo() {
  const demoSections = [
    {
      title: '🎨 Composants UI',
      description: 'Loaders, notifications, sélecteurs et autres composants d\'interface',
      path: '/demo/ui',
      color: 'from-blue-500 to-purple-600',
      items: ['LoaderSpin', 'LoaderDots', 'StatusSelect', 'RoleSelect', 'Notifications']
    },
    {
      title: '🃏 Composants Card',
      description: 'Cartes réutilisables pour afficher différents types de contenu',
      path: '/demo/card',
      color: 'from-green-500 to-teal-600',
      items: ['ProjectCard', 'UserCard', 'TaskCard', 'StatsCard']
    },
    {
      title: '🏗️ Composants Layout',
      description: 'Composants de mise en page et structure de l\'application',
      path: '/demo/layout',
      color: 'from-orange-500 to-red-600',
      items: ['Header', 'Footer', 'LayoutPublic', 'Sidebar']
    },
    {
      title: '🎭 Composants Modal',
      description: 'Fenêtres modales et dialogues réutilisables',
      path: '/demo/modal',
      color: 'from-purple-500 to-pink-600',
      items: ['ConfirmModal', 'EditModal', 'InfoModal', 'CreateModal']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              🧰 Bibliothèque de Composants
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez tous les composants UI réutilisables de TaskForge avec leurs variantes, 
              exemples d'utilisation et documentation complète.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation et grille des sections */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {demoSections.map((section, index) => (
            <Link
              key={index}
              to={section.path}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {section.title}
                  </h2>
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    →
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {section.description}
                </p>
                
                {/* Items preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Composants inclus
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium group-hover:bg-gray-200 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover:via-gray-400 transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">📚 Documentation Technique</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold mb-3">🎯 Objectifs</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Centraliser tous les composants réutilisables</li>
                  <li>• Fournir des exemples d'utilisation concrets</li>
                  <li>• Documenter les props et variantes</li>
                  <li>• Tester visuellement les composants</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">⚙️ Technologies</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• React 18 + TypeScript</li>
                  <li>• Tailwind CSS pour le styling</li>
                  <li>• Lucide React pour les icônes</li>
                  <li>• Context API pour l'état global</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                <strong>Navigation :</strong> Cliquez sur une catégorie ci-dessus pour explorer les composants de cette section.
                Chaque page contient des exemples interactifs et de la documentation détaillée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
