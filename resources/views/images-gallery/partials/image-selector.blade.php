@php
    $triggerId = $triggerId ?? 1;
    $limit = $limit ?? 5;
    $selectLabel = $selectLabel ?? __('Select images');
@endphp

<div class="img-preview-item button-img-item" data-images-modal-trigger="{{ $triggerId }}" imgs-select-limit="{{ $limit }}">
    <button type="button" data-js="open-gallery-modal" data-modal-trigger>
        {{ $selectLabel }}
    </button>

    <input type="hidden" name="select_items_json" data-selected-json>
    <input type="hidden" name="selected_images[]" value="" data-img-ids>

    <div class="preview-container">
        <p class="preview-text-info">{{ __('Click on the items to remove') }}</p>
        <div class="img-preview" data-img-preview></div>
    </div>
</div>
