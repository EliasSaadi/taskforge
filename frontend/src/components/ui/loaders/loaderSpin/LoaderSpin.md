# LoaderSpin Component

Composant de chargement avec animation de double cercle rotatif, basé sur le design utilisé dans les routes d'authentification.

## Utilisation

```tsx
import { LoaderSpin } from '@/components/ui';

// Loader plein écran (pour les routes)
<LoaderSpin fullScreen={true} />

// Loader dans un bouton
<button disabled={loading}>
  {loading ? (
    <div className="flex items-center gap-2">
      <LoaderSpin size="sm" />
      <span>Chargement...</span>
    </div>
  ) : (
    "Valider"
  )}
</button>

// Loader dans une section
<div className="p-4">
  <LoaderSpin size="md" />
</div>

// Loader avec classes personnalisées
<LoaderSpin 
  size="lg" 
  className="my-8" 
/>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'` | Taille du loader |
| `fullScreen` | `boolean` | `false` | Si true, occupe tout l'écran avec min-h-screen |
| `className` | `string` | `''` | Classes CSS supplémentaires |

## Tailles disponibles

- **sm**: 8x8 / 6x6 (pour les boutons)
- **md**: 12x12 / 10x10 (pour les sections moyennes)
- **lg**: 20x20 / 16x16 (défaut, pour les sections larges)
- **xl**: 28x28 / 24x24 (pour les grands espaces)

## Design

Le loader utilise un double cercle avec :
- Cercle extérieur : couleur `tf-erin` (vert)
- Cercle intérieur : couleur `tf-fuschia` (rose)
- Animation de rotation dans le même sens pour les deux cercles

## Utilisé dans

- `PublicRoute` et `PrivateRoute` (fullScreen=true)
- Modales d'authentification (size=sm dans les boutons)
- Potentiellement dans d'autres composants nécessitant un indicateur de chargement
