@php 

$page = indexParamExistsOrDefault($_GET, 'page', 1);
$search = indexParamExistsOrDefault($_GET, 'search', '');

@endphp

<article class="gallery-main-container" data-js="gallery-main-container">

    @include('images-gallery.content.gallery-content')

</article>