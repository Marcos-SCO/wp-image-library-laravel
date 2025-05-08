@php

$page = indexParamExistsOrDefault($_GET, 'page', 1);
$search = indexParamExistsOrDefault($_GET, 'search', '');

@endphp

@extends('layouts.app')

@section('content')

<!-- @include('images-gallery.partials.image-selector', [
    'triggerId' => 1,
    'limit' => 5,
    'selectLabel' => __('Select images 1'),
]) -->

<!-- @include('images-gallery.partials.image-selector', [
    'triggerId' => 2,
    'limit' => 2,
    'selectLabel' => __('Select images 2'),
]) -->

@include('images-gallery.external-module.selector-container')

<article class="gallery-main-container gallery-page active" data-js="gallery-main-container" data-page="gallery">

@include('images-gallery.content.gallery-content')

</article>

@endsection