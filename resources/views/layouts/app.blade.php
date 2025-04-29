<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ env("APP_NAME", "Wp Media Library Laravel") }}</title>

  @vite(['resources/css/app.css', 'resources/scss/app.scss', 'resources/js/app.js'])

</head>

<body>
  <main class="main-container container mt-4 mb-5">

    @yield('content')
  </main>
</body>

</html>