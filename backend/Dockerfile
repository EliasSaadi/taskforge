FROM php:8.2-fpm

# Installer les extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    unzip git zip curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql zip bcmath

# Copier Composer depuis l’image officielle
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copier tout le code du backend
COPY . .

# Créer les dossiers nécessaires pour Laravel
RUN mkdir -p bootstrap/cache && chmod -R 775 bootstrap/cache

# Installer les dépendances Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
