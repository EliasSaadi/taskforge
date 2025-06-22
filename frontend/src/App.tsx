import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button";
import { login } from "./services/auth";

import './App.css'

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <CheckCircle className="text-green-500 w-12 h-12" />
        <h1 className="text-4xl font-bold text-fuchsia-600">TaskForge + Tailwind</h1>
      </div> 
      <br />
      <Button className="bg-fuchsia-600 text-white hover:bg-fuchsia-700">
        Je suis un bouton ShadCN
      </Button>
      <br />
      <button onClick={() => login("test@example.com", "password")}>
        Tester connexion
      </button>
    </>
  )
}

export default App
