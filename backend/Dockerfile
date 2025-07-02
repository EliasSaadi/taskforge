# Étape 1 : Composer
FROM composer:2.7 AS vendor

WORKDIR /app
COPY . .
RUN composer install

# Étape 2 : Laravel PHP
FROM php:8.2-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git unzip curl libpng-dev libonig-dev libxml2-dev zip libzip-dev \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql zip

COPY --from=vendor /app/vendor ./vendor
COPY . .

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=8000
