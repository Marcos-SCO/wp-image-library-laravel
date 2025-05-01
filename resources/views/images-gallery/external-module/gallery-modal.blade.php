@php 

$page = indexParamExistsOrDefault($_GET, 'page', 1);
$search = indexParamExistsOrDefault($_GET, 'search', '');

@endphp

<div class="gallery-main-container modal-gallery" data-js="gallery-main-container">

    @include('images-gallery.content.gallery-content')

</div>