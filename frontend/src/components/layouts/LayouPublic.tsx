// src/layouts/LayoutPublic.tsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

import {AuthModals} from '@/components/modals/Authentification';

const LayoutPublic = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center w-full">
        <Outlet />
      </main>

      <Footer />
      <AuthModals />
    </div>
  )
}

export default LayoutPublic
