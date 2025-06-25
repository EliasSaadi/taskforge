# TaskForge

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
php artisan key:generate
cp .env .env.docker
composer install
php artisan migrate
```

### 3. Frontend – React

```bash
cd ../frontend
cp .env.example .env
cp .env.example .env.docker
npm install
```

### 4. Utilisation de Make sur Windows

Ce projet utilise un fichier `Makefile` pour automatiser les commandes courantes (ex. : lancer le projet, migrer la base de données, etc.). Cette commande est native sous Linux/macOS, mais **Windows nécessite une installation préalable**.

#### Installation de `make` via Chocolatey

1. **Ouvre PowerShell en mode administrateur**
2. Installe [Chocolatey](https://chocolatey.org/install) avec cette commande :

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = `
[System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

3. Installe `make` :

```powershell
choco install make
```

4. Redémarre PowerShell pour que la commande `make` soit accessible partout.

---

#### Introduction au Makefile

Un fichier `Makefile` est fourni à la racine du projet pour faciliter le développement. Il contient des commandes comme :

- `make up` – Lance les services Docker (`frontend`, `backend`, `db`, `phpMyAdmin`)
- `make migrate` – Lance les migrations Laravel dans le conteneur
- `make stop` – Arrête tous les conteneurs et volumes

Chaque commande est bien commentée directement dans le fichier `Makefile` si tu veux en savoir plus.

---

## ▶️ Lancer le projet

Une fois l’installation terminée, vous pouvez démarrer tous les services grâce au `Makefile` :

- Lancez la commande :  
  ```bash
  make up
  ```
  Cela démarre automatiquement le frontend (React/Vite), le backend (Laravel) et la base de données (MySQL).

- Ensuite, ouvrez votre navigateur à l’adresse :  
  [http://localhost:5173](http://localhost:5173)  
  → Vous accéderez à l’interface de l’application **TaskForge**

- 🔁 Le backend est configuré pour rediriger toute requête directe vers l’API vers le frontend si nécessaire, afin de sécuriser les accès.

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