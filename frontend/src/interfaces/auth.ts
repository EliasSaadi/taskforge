import type { ReactNode } from 'react'
import type { Utilisateur } from "./data"

export interface AuthContextType {
  user: Utilisateur | null
  isAuthenticated: boolean
}

export interface AuthProviderProps {
  children: ReactNode
}