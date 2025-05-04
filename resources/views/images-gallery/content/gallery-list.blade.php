@php use Illuminate\Support\Facades\Storage;

$imagesLoopCount = 0;

@endphp

@foreach ($images as $image)

@php

$imagesLoopCount += 1;

$loadingAttribute = $imagesLoopCount <= 3 ? 'eager' : 'lazy';

$imgId = objParamExistsOrDefault($image,'id');
if (!$imgId) continue;

$imgPath = objParamExistsOrDefault($image, 'file_path');
$imgUrl = Storage::url($imgPath);

$imgAlt = objParamExistsOrDefault($image,'alt_text', '');

@endphp

<div class="gallery-item" data-gallery-item="{{ $imgId }}">

  <figure class="image-wrapper" data-js="image-loading-wrapper">
    <div class="image-loader"></div>

    <img
      src="{{ $imgUrl }}"
      alt="{{ $imgAlt }}"
      title="{{ $imgAlt }}"
      data-img-url="{{ $imgUrl }}"
      data-img-item="{{ $imgId }}"
      class="gallery-image"
      height="266px"
      width="266px"
      loading="{{ $loadingAttribute }}">
  </figure>

  <div class="gallery-actions">
    <button class="edit-btn" data-js="edit-btn" data-id="{{ $image->id }}">{{ __('Edit') }}</button>

    <button class="delete-btn" data-js="delete-btn" data-id="{{ $image->id }}">{{ __('Delete') }}</button>
  </div>

</div>
@endforeach