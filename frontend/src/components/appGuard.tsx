// src/components/AppGuard.tsx
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

type Props = {
  children: React.ReactNode
}

export const AppGuard = ({ children }: Props) => {
  const navigate = useNavigate()
  const lockEnabled = import.meta.env.VITE_APP_LOCKED === "true"
  const unlockCode = import.meta.env.VITE_APP_UNLOCK_CODE
  const access = localStorage.getItem("taskforge:access")

  useEffect(() => {
    if (lockEnabled && access !== unlockCode) {
      navigate("/verrou")
    }
  }, [access, navigate])

  return <>{children}</>
}
