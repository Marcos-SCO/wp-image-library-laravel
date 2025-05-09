@php use \App\Helpers\Classes\SvgHelper; 

$classIfNoImageDisplayNone = $images->isEmpty() ? ' d-none' : '';

@endphp

<form data-js="main-search-inputs-form" action="{{ route('gallery.index') }}">
  <div class="search-type-container">
    <label for="search-images">
      {!! SvgHelper::getSvg('search-icon'); !!}
      <span>{{ __('Search for Images') }}</span>
    </label>
    <div class="input-container">
      <input type="text" name="search" data-js="search-input" value="{{ $search }}" id="search-images" placeholder="Search" autocomplete="off" @if (!empty($search)) autofocus @endif>
      <span class="input-line"></span>
    </div>
  </div>

  <input type="hidden" name="page" data-current-page="{{ $page }}" value="{{ $page }}">

  <input type="hidden" name="base-url" data-base-url="{{ url('') }}">
  <input type="hidden" name="base-path" data-base-path="{{ url('gallery'); }}">
</form>

<!-- Image Upload Form -->
<div class="image-upload-form">
  <form data-js="upload-form" action="/gallery/upload" method="POST" enctype="multipart/form-data">
    @csrf
    <input type="file" name="images[]" data-js="upload-images" accept="image/*" multiple>
    <div class="drop-zone" data-js="drop-zone">
      <p>{{ __('Drag and drop images here') }}</p>
    </div>

    <div data-js="upload-error" style="color: red; margin-bottom:1.5rem;"></div>
  </form>
</div>


<div data-js="gallery-container">
  @include('images-gallery.content.gallery-list')
</div>

@include('images-gallery.pagination.index', ['images' => $images])

<!-- Edit Modal -->
<div class="image-gallery-modal edit-modal lightbox-modal" data-js="edit-modal">
  <div class="modal-content">
    <form data-js="update-form" action="/gallery/id" method="POST" enctype="multipart/form-data">
      <!-- <input type="hidden" name="_method" value="PUT"> -->
      <input type="hidden" name="_method" value="POST">
      <input type="hidden" data-js="edit-image-id" name="image_id">

      <div>
        <div class="input-container">
          <label for="edit-description">{{ __('Description') }}</label>
          <input type="text" data-js="edit-description" name="description" id="edit-description" placeholder="{{ __('Give a description to the image') }}">
        </div>


        <div class="input-container">
          <label for="edit-alt-text">{{ __('Alternative Text') }}</label>
          <input type="text" data-js="edit-alt-text" name="alt_text" id="edit-alt-text" placeholder="{{ __('Type the image\'s alternative text') }}">
        </div>
      </div>

      <div class="input-container image-input-container">
        <label for="input-edit-image">
          <img data-js="edit-image" src="" alt="Image Preview" width="400px" height="400px" title="{{ __('Change image') }}">
        </label>

        <input type="file" class="file-input" accept="image/*" data-js="file-input" id="input-edit-image">
      </div>

      <button type="submit">{{ __('Save') }}</button>

      <button class="close-button" type="button" data-js="close-edit-modal" close-modal>{!! SvgHelper::getSvg('close-icon'); !!}</button>

    </form>
  </div>
</div>