@php use Illuminate\Support\Facades\Storage; @endphp

@foreach ($images as $image)

@php

$imgId = objParamExistsOrDefault($image,'id');
if (!$imgId) continue;

$imgPath = objParamExistsOrDefault($image, 'file_path');
$imgUrl = Storage::url($imgPath);

$imgAlt = objParamExistsOrDefault($image,'alt_text', '');

@endphp

<div class="gallery-item" data-gallery-item="{{ $imgId }}">

  <img src="{{ $imgUrl }}" alt="{{ $imgAlt }}" title="{{ $imgAlt }}" data-img-url="{{ $imgUrl }}" data-img-item="{{ $imgId }}" class="gallery-image">

  <div class="gallery-actions">
    <button class="edit-btn" data-js="edit-btn" data-id="{{ $image->id }}">{{ __('Edit') }}</button>

    <button class="delete-btn" data-js="delete-btn" data-id="{{ $image->id }}">{{ __('Delete') }}</button>
  </div>

</div>
@endforeach