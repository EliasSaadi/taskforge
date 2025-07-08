// src/App.tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AppGuard } from './components/AppGuard'
import { PrivateRoute } from './components/PrivateRoute'
import { PublicRoute } from './components/PublicRoute'
import { VerrouPage } from './pages/PageVerouillage'
import { AuthProvider } from './contexts/AuthContext';
import { DeleteProvider } from './contexts/DeleteContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationContainer } from './components/ui';

// Importe aussi tes autres pages ici
import LayoutPublic from "@/components/layouts/LayouPublic";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import MonProfil from "@/pages/MonProfil";
import { ComponentsDemo, NotificationDemo } from "@/pages/demo";


const router = createBrowserRouter([
  {
    path: '/verrou',
    element: <VerrouPage />
  },
  {
    path: '/',
    element: (
      <AppGuard>
        <PublicRoute>
          <LayoutPublic />
        </PublicRoute>
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
        <PrivateRoute>
          <LayoutPublic />
        </PrivateRoute>
      </AppGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> }
    ],
  },
  {
    path: '/mon-profil',
    element: (
      <AppGuard>
        <PrivateRoute>
          <LayoutPublic />
        </PrivateRoute>
      </AppGuard>
    ),
    children: [
      { index: true, element: <MonProfil /> }
    ],
  },
  {
    path: '/demo',
    element: <ComponentsDemo />
  },
  {
    path: '/demo/notifications',
    element: <NotificationDemo />
  }
])

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DeleteProvider>
          <RouterProvider router={router} />
          <NotificationContainer />
        </DeleteProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
