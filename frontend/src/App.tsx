// src/App.tsx
import { RouterProvider, createBrowserRouter, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppGuard } from './components/appGuard'
import { VerrouPage } from './pages/PageVerouillage'
// Importe aussi tes autres pages ici

const router = createBrowserRouter([
  {
    path: '/verrou',
    element: <VerrouPage />
  },
  {
    path: '/',
    element: (
      <AppGuard>
        <div className="p-4">
          <h1>Bienvenue dans TaskForge 🚀</h1>
          {/* Remplace ça par ta vraie page d’accueil plus tard */}
        </div>
      </AppGuard>
    )
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
