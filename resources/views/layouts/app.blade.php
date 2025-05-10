<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ env("APP_NAME", "Wp Image Library Laravel") }}</title>

  <meta name="csrf-token" content="{{ csrf_token() }}">

  @vite(['resources/css/app.css', 'resources/scss/app.scss', 'resources/js/app.js'])

</head>

<body>
  @include('layouts.header')

  @include('auth/authMessages')

  <main class="main-container mt-4 mb-5">

    @yield('content')
  </main>
  @php
  $currentYear = date('Y');
  $currentYearCalc = $currentYear > 2025 ? '2025 - ' . $currentYear : $currentYear;
  @endphp
  <footer class="main-footer">
    <address><span class="current-year">&copy; {{ $currentYearCalc }} </span> | <a href="https://www.linkedin.com/in/marcos-sco/" target="_blank">Developed by Marcos-SCO</a></address>
  </footer>
</body>

</html>