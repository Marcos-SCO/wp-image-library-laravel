@php

$page = indexParamExistsOrDefault($_GET, 'page', 1);
$search = indexParamExistsOrDefault($_GET, 'search', '');

@endphp

@extends('layouts.app')

@section('content')

<div class="img-preview-item button-img-item" data-images-modal-trigger="1" imgs-select-limit="5">
  <button data-js="open-gallery-modal" data-modal-trigger>
    {{ __('Select images') }}
  </button>

  <input type="hidden" name="select_itens_json" data-selected-json>
  <input type="hidden" name="selected_images[]" value="" data-img-ids>

  <div class="preview-container">
    <p class="preview-text-info">{{ __('Click on the items to remove') }}</p>
    <div class="img-preview" data-img-preview></div>
  </div>
</div>

<div class="img-preview-item button-img-item" data-images-modal-trigger="2" imgs-select-limit="2">
  
  <button data-js="open-gallery-modal" data-modal-trigger>
    {{ __('Select Images') }}
  </button>

  <input type="hidden" name="select_itens_json" data-selected-json>
  <input type="hidden" name="selected_images[]" value="" data-img-ids>

  <div class="preview-container">
    <p class="preview-text-info">{{ __('Click on the items to remove') }}</p>
    <div class="img-preview" data-img-preview></div>
  </div>
</div>

@include('images-gallery.external-module.selector-container')

<article class="gallery-main-container" data-js="gallery-main-container" data-page="gallery">

@include('images-gallery.content.gallery-content')

</article>

@endsection