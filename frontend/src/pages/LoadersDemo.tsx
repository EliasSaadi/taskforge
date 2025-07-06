import { LoaderSpin, LoaderDots } from '@/components/ui';

/**
 * Page de démonstration des composants de loading
 * (À supprimer une fois les tests terminés)
 */
export default function LoadersDemo() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Démonstration des Loaders</h1>
      
      {/* LoaderSpin */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">LoaderSpin</h2>
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <p className="mb-2">Small</p>
            <LoaderSpin size="sm" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="mb-2">Medium</p>
            <LoaderSpin size="md" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="mb-2">Large</p>
            <LoaderSpin size="lg" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="mb-2">Extra Large</p>
            <LoaderSpin size="xl" />
          </div>
        </div>
      </section>

      {/* LoaderDots */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">LoaderDots</h2>
        
        {/* Tailles */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Tailles</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-2">
              <p className="mb-2">XS</p>
              <LoaderDots size="xs" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="mb-2">Small</p>
              <LoaderDots size="sm" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="mb-2">Medium</p>
              <LoaderDots size="md" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="mb-2">Large</p>
              <LoaderDots size="lg" />
            </div>
          </div>
        </div>

        {/* Couleurs */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Couleurs</h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="flex flex-col items-center gap-2">
              <p className="mb-2">Blue</p>
              <LoaderDots color="blue" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="mb-2">Green</p>
              <LoaderDots color="green" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="mb-2">Purple</p>
              <LoaderDots color="purple" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="mb-2">Red</p>
              <LoaderDots color="red" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="mb-2">Gray</p>
              <LoaderDots color="gray" />
            </div>
          </div>
        </div>
      </section>

      {/* Usage en contexte */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage en contexte</h2>
        
        <div className="space-y-4">
          {/* Boutons avec loaders */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Dans des boutons</h3>
            <div className="flex gap-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
                <LoaderDots size="sm" color="custom" customColor="bg-white" />
                <span>LoaderDots</span>
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                <LoaderSpin size="sm" />
                <span>LoaderSpin</span>
              </button>
            </div>
          </div>

          {/* Texte inline */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Texte inline</h3>
            <p className="flex items-center gap-2">
              Chargement en cours <LoaderDots size="xs" /> veuillez patienter...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
