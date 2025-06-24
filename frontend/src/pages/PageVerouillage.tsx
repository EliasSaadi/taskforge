// src/pages/VerrouPage.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const VerrouPage = () => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const correctCode = import.meta.env.VITE_APP_ACCESS_TOKEN
  const isActive = import.meta.env.VITE_APP_LOCKED === "true"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isActive) {
      navigate("/") // Protection désactivée
      return
    }

    if (code === correctCode) {
      localStorage.setItem("taskforge:access", code)
      navigate("/") // Redirige vers l’app
    } else {
      setError("Code incorrect. Veuillez réessayer.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">🔒 Accès protégé</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Entrez le code d'accès"
          className="p-2 border rounded w-64"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Déverrouiller
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  )
}
