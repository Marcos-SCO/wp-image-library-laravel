@php

use Illuminate\Support\Facades\Storage;
use \App\Helpers\Classes\SvgHelper;

$imagesLoopCount = 0;

$isEmptyImages = (is_object($images) && method_exists($images, 'isEmpty') && $images->isEmpty());

$classIfNotEmptyDontShow = $isEmptyImages ? '' : ' d-none';

if ($isEmptyImages) echo '<style>.image-upload-form {display: none;}</style>';

@endphp

<div class="no-results-container{{ $classIfNotEmptyDontShow }}" data-js="no-results-container">
  <div class="faces-container">
    <span class="happy-face">{!! SvgHelper::getSvg('smiley-emoji-icon') !!}</span>

    <span class="sad-face">{!! SvgHelper::getSvg('sad-emoji-face-icon') !!} </span>
  </div>

  <p>
    <span class="not-results-text">{{ __('No results found...') }}</span>
  </p>
</div>

{{-- $imgUrl=Storage::url($imgPath); --}}

@foreach ($images as $image)

@php

$imagesLoopCount += 1;

$loadingAttribute = $imagesLoopCount <= 3 ? 'eager' : 'lazy';

$imgId=objParamExistsOrDefault($image,'id');
if (!$imgId) continue;

$imgPath=objParamExistsOrDefault($image, 'file_path');

$imgUrl=$imgPath;

$imgAlt=objParamExistsOrDefault($image,'alt_text', '');
$imgDescription=objParamExistsOrDefault($image, 'description');

@endphp

<div class="gallery-item" data-gallery-item="{{ $imgId }}">

<figure class="image-wrapper" data-js="image-loading-wrapper">
  <div class="image-loader"></div>

  <img
    src="{{ $imgUrl }}"
    alt="{{ $imgAlt }}"
    title="{{ $imgAlt }}"
    data-img-alt="{{ $imgAlt }}"
    data-img-description="{{ $imgDescription }}"
    data-img-path="{{ $imgPath }}"
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

@php // Add dummy empty slots if less than 12
  $isUploadRequest = isset($uploadRequest) && $uploadRequest;
  $remainingSlots = $imagesLoopCount > 8 ? 12 - $imagesLoopCount : 0;
@endphp

@if(!$isUploadRequest && !$isEmptyImages)
  @for ($i = 0; $i < $remainingSlots; $i++)
    <div class="gallery-item dummy" aria-hidden="true" style="opacity:0;">
      <div class="image-wrapper dummy-wrapper">
      </div>
      <div class="gallery-actions"></div>
    </div>
  @endfor
@endif