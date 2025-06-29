// src/components/layouts/footer.tsx
const Footer = () => {
  return (
    <footer className="h-8 flex items-center justify-center tf-text-secondaire">
      © {new Date().getFullYear()} TaskForge — Tous droits réservés
    </footer>
  )
}

export default Footer
