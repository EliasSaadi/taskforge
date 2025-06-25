# 🚀 TaskForge Makefile - Développement local Docker: Docker doit être installer et constamment ouvert

# Lancer l'environnement complet (back + front + DB)
up:
	docker-compose up -d --build

# Stopper tous les services
down:
	docker-compose down

# Lance tous les services
start:
	docker-compose start

stop:
	docker-compose stop

# Rebuilder + relancer (utile après modif Dockerfile ou .env)
restart:
	docker-compose down && docker-compose up --build

# Migrer la base de données
migrate:
	docker-compose exec backend php artisan migrate

# Supprimer toutes les tables et les reseeder
fresh:
	docker-compose exec backend php artisan migrate:fresh --seed

# Seeder uniquement
seed:
	docker-compose exec backend php artisan db:seed

# Lancer Tinker
tinker:
	docker-compose exec backend php artisan tinker

# Exécuter une commande artisan libre
artisan:
	docker-compose exec backend php artisan $(cmd)

# Exécuter une commande npm côté front
npm:
	docker-compose exec frontend npm run $(script)

# Lancer le terminal dans le conteneur Laravel
bash:
	docker-compose exec backend bash

# Afficher les logs en temps réel
logs:
	docker-compose logs -f

logs-front:
	docker-compose logs -f frontend

logs-back:
	docker-compose logs -f backend

# Générer la clé Laravel (si manquante)
key:
	docker-compose exec backend php artisan key:generate

# Lancer les tests Laravel
test:
	docker-compose exec backend php artisan test

# Nettoyer les volumes (⚠️ supprime aussi les données DB)
clean:
	docker-compose down -v