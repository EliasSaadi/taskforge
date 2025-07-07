# LoaderDots Component

Composant de chargement avec animation de rebond de trois points, parfait pour les interfaces modernes et discrètes.

## Utilisation

```tsx
import { LoaderDots } from '@/components/ui';

// Loader par défaut (taille md, couleur bleue)
<LoaderDots />

// Loader dans un bouton
<button disabled={loading}>
  {loading ? (
    <div className="flex items-center gap-2">
      <LoaderDots size="sm" color="green" />
      <span>Chargement...</span>
    </div>
  ) : (
    "Valider"
  )}
</button>

// Loader avec couleur personnalisée
<LoaderDots 
  size="lg" 
  color="custom" 
  customColor="bg-gradient-to-r from-pink-500 to-violet-500" 
/>

// Loader centré dans une section
<div className="flex justify-center p-4">
  <LoaderDots size="md" color="purple" />
</div>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Taille des points |
| `color` | `'blue' \| 'green' \| 'purple' \| 'red' \| 'gray' \| 'custom'` | `'blue'` | Couleur prédéfinie |
| `customColor` | `string` | `undefined` | Couleur personnalisée (CSS class) |
| `className` | `string` | `''` | Classes CSS supplémentaires |

## Tailles disponibles

- **xs**: 2x2 (8px) - pour les petits éléments
- **sm**: 3x3 (12px) - pour les boutons compacts
- **md**: 4x4 (16px) - taille par défaut
- **lg**: 6x6 (24px) - pour les grands espaces

## Couleurs prédéfinies

- **blue**: `tf-dodger` (bleu primaire)
- **green**: `tf-erin` (vert d'action)
- **purple**: `tf-fuschia` (violet/rose)
- **red**: `tf-folly` (rouge d'erreur)
- **gray**: `tf-davys` (gris neutre)
- **custom**: utilise `customColor`

## Animation

Les trois points rebondissent avec des délais différents :
- 1er point : délai 0s
- 2ème point : délai 0.3s
- 3ème point : délai 0.5s

## Cas d'usage

- **Boutons de soumission** : `<LoaderDots size="sm" color="green" />`
- **Sections de contenu** : `<LoaderDots size="md" color="blue" />`
- **Indicateurs discrets** : `<LoaderDots size="xs" color="gray" />`
- **Chargements de données** : `<LoaderDots size="lg" color="purple" />`

## Comparaison avec LoaderSpin

| Aspect | LoaderDots | LoaderSpin |
|--------|------------|------------|
| **Style** | Moderne, discret | Classique, visible |
| **Taille** | Compact | Plus volumineux |
| **Usage** | Boutons, texte inline | Plein écran, sections larges |
| **Performance** | Léger | Animation plus complexe |
