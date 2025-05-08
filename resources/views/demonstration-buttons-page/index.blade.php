@php

$page = indexParamExistsOrDefault($_GET, 'page', 1);
$search = indexParamExistsOrDefault($_GET, 'search', '');

@endphp

@extends('layouts.app')

@section('content')

<div class="demonstration-buttons-container container">

    <div class="demonstration-item-container">
        <p>Open modal and select a maximum of 2 images</p>
        @include('images-gallery.partials.image-selector', [
        'triggerId' => 1,
        'limit' => 2,
        'selectLabel' => __('Modal with 2 images'),
        ])
    </div>

    <div class="demonstration-item-container">
        <p>Open modal and select a maximum of 5 images</p>
        @include('images-gallery.partials.image-selector', [
        'triggerId' => 2,
        'limit' => 5,
        'selectLabel' => __('Modal with 5 images'),
        ])
    </div>

    <div class="demonstration-item-container">
        <p>Open modal and select a maximum of 10 images</p>
        @include('images-gallery.partials.image-selector', [
        'triggerId' => 3,
        'limit' => 10,
        'selectLabel' => __('Modal with 10 images'),
        ])
    </div>

    @include('images-gallery.external-module.selector-container')

</div>

@endsection