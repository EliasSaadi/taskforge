// src/App.tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AppGuard } from './components/AppGuard'
import { PrivateRoute } from './components/PrivateRoute'
import { PublicRoute } from './components/PublicRoute'
import { VerrouPage } from './pages/PageVerouillage'
import { AuthProvider } from './contexts/AuthContext';
import { DeleteProvider } from './contexts/DeleteContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { NotificationContainer } from './components/ui';

// Importe aussi tes autres pages ici
import LayoutPublic from "@/components/layouts/LayouPublic";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import ProjectDetail from "@/pages/ProjectDetail";
import MonProfil from "@/pages/MonProfil";
import { ComponentsDemo } from "@/pages/demo";
import { UIDemo, CardDemo, LayoutDemo, ModalDemo } from "@/pages/demo/components";


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
      { index: true, element: <Dashboard /> },
      { path: ':projectNameId', element: <ProjectDetail /> }
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
    path: '/demo/ui',
    element: <UIDemo />
  },
  {
    path: '/demo/card',
    element: <CardDemo />
  },
  {
    path: '/demo/layout',
    element: <LayoutDemo />
  },
  {
    path: '/demo/modal',
    element: <ModalDemo />
  }
])

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProjectProvider>
          <DeleteProvider>
            <RouterProvider router={router} />
            <NotificationContainer />
          </DeleteProvider>
        </ProjectProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
