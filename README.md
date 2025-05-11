# wp-image-library-laravel
A Image Library inspired by Worpress in Laravel

<p>Available at: <a href="https://wpmediaimageslibrary.infinityfreeapp.com/" target="_blank">https://wpmediaimageslibrary.infinityfreeapp.com/</a></p>

### Technologies Used 💻

- Docker
- PHP 8.3
- Node.js v22.15.0
- Mysql
- Laravel
- Vite
- Sass
- Bootstrap
- Javascript

<a href="https://www.youtube.com/watch?v=iG4d5Ay2i0A&ab_channel=MarcosSCO" target="_blank">
  <img src="resources/img/gif-preview.gif" alt="Video Preview" />
</a>

## Instructions for Running Locally 🚀

This repository contains the necessary Docker files to run the development environment.

## Prerequisites  📋

- Docker: Make sure Docker is installed on your machine.


## File Configuration .env 🛠️

1. Locate the `.env.example`.

2. Copy this file and paste it in the same directory, renaming it to `.env`.

3. Open the `.env`  file in a text editor.

4. Replace the environment variable values as needed for your application's configuration.

5. Save the changes to the file.

## How to Use  🛠️

1. Navigate to the directory where the files are located.

2. Make sure your application is properly structured, including all necessary files such as `package.json`, `src`  and others as expected by the Dockerfile and docker-compose.yml..

3. From the project root, run the following command to build and start the Docker containers:

    ```
    docker-compose up -d --build
    ```



## Access the Container
From the root directory (outside the expense-app folder), run the command to access the container:

```bash
docker-compose exec -it app sh
```
### Composer commands
```bash
composer install

composer dump-autoload -o
```

### Run Front-End Scripts
```bash
npm install

npm run build
```

### Generate a New Laravel Key
```bash
php artisan key:generate
```
### Run Migrations and Seeders
```bash
php artisan migrate:fresh --seed
```

### Run migration and gallery seeder
```bash
php artisan migrate:fresh --seed

php artisan db:seed --class=ImageGallerySeeder
```

### Link Storage
```bash
php artisan storage:link
```

Locally, the application will be available at: http://localhost:8043/