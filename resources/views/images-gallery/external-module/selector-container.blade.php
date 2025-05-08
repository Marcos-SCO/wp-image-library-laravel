@php use \App\Helpers\Classes\SvgHelper; @endphp
<!-- Modal for Gallery Selection -->
<div class="gallery-modal gallery-external-modal lightbox-modal" data-js="gallery-selector-modal">
  <input type="hidden" name="base-url" data-base-url="{{ url('') }}">

  <div class="modal-content">
    <button class="close-button" data-js="close-gallery-modal" close-modal>{!! SvgHelper::getSvg('close-icon'); !!} </button>
    <!-- Modal content will be dynamically loaded here -->
    <div data-js="modal-gallery-content"></div>
  </div>

</div>