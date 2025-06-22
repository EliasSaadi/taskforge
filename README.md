# 🧱 TaskForge

**TaskForge** est un gestionnaire de tâches collaboratif développé dans le cadre du titre professionnel **Concepteur Développeur d’Applications (CDA)**.  
Il repose sur une architecture **full-stack** :  
➡️ **Laravel** pour l’API,  
➡️ **React + Vite + Tailwind CSS** pour le front-end.

---

## 🚀 Fonctionnalités principales

- Authentification avec 2FA (email)
- Création et gestion de projets collaboratifs
- Attribution de rôles personnalisés par projet (Chef, Assistant, Membre)
- Système de tâches avec statuts dynamiques
- Recherche avancée de projets et tâches
- Interface moderne responsive (ShadCN, Tailwind)
- Page profil, gestion du compte, désactivation et suppression

---

## 🛠️ Stack technique

| Technologie      | Utilisation                      |
|------------------|----------------------------------|
| **Laravel**   | Back-end API sécurisée (Sanctum) |
| **React + Vite** | Front-end SPA modulaire         |
| **Tailwind CSS** | Design system léger et rapide    |
| **ShadCN UI**    | Composants UI personnalisables   |
| **Lucide Icons** | Iconographie vectorielle        |

---

## 📁 Arborescence du projet

```
/taskforge
├── backend     → Laravel API
└── frontend    → React (Vite + TypeScript)
```

---

## 🔧 Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/taskforge.git
cd taskforge
```

### 2. Backend – Laravel

```bash
cd backend
cp .env.example .env
composer install
php artisan migrate
php artisan serve
```

### 3. Frontend – React

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

---

## 🔐 Sécurité

- Authentification Sanctum avec cookie sécurisé
- 2FA (vérification par code email)
- Middleware d’accès global par `ACCESS_TOKEN`
- Gestion RGPD : suppression / désactivation / réactivation du compte

---

## 📌 Variables d’environnement

| Variable             | Exemple                          |
|----------------------|----------------------------------|
| FRONTEND_URL         | http://localhost:5173            |
| VITE_API_BASE_URL    | http://localhost:8000            |
| ACCESS_TOKEN         | supersecrettoken123              |

---

## 👨‍💻 Auteur

Projet réalisé par **SAADI Elias**  
Certification **RNCP Niveau 6 – Concepteur Développeur d’Applications**  
**Institut G4**

---

## 📄 Licence

Projet à but éducatif uniquement – non destiné à la production.
