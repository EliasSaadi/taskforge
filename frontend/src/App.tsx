// src/App.tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AppGuard } from './components/AppGuard'
import { VerrouPage } from './pages/PageVerouillage'
import { AuthProvider } from './contexts/AuthContext';

// Importe aussi tes autres pages ici
import LayoutPublic from "@/components/layouts/LayouPublic";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";


const router = createBrowserRouter([
  {
    path: '/verrou',
    element: <VerrouPage />
  },
  {
    path: '/',
    element: (
      <AppGuard>
        <LayoutPublic />
      </AppGuard>
    ),
    children: [
      { index: true, element: <Home /> }
    ],
  },
  {
    path: '/dashboard',
    element: (
      <AppGuard>
        <LayoutPublic />
      </AppGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> }
    ],
  }
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
