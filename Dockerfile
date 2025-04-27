FROM node:22.15.0-alpine as node
FROM php:8.3-fpm-alpine

ARG user
ARG uid

WORKDIR "/application"

# Install required PHP extensions for MySQL and PDO
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy Composer binary from the Composer image
COPY --from=composer:2.2 /usr/bin/composer /usr/local/bin/composer

# Create the user and set permissions
RUN adduser -u 1000 -G root -G www-data -D -h /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user /home/$user

# Install dependencies
RUN apk --no-cache update

RUN apk add --no-cache \
    g++ \
    make \
    zlib-dev \
    libpng-dev \
    curl \
    gnupg \
    ca-certificates \
    tar \
    xz

# Copy Node.js and npm from the node:alpine image
COPY --from=node /usr/local/bin /usr/local/bin
COPY --from=node /usr/local/lib /usr/local/lib

# Switch to the user
USER $user
