@if ($paginator->hasPages())
<nav>
  <ul class="pagination">

    {{-- First Page Link --}}
    @if (!$paginator->onFirstPage())
    <li class="page-item first-item">
      <a class="page-link" href="{{ $paginator->url(1) }}" rel="first" aria-label="@lang('pagination.first')" data-page="1">{{ __('First') }}</a>
    </li>
    @endif

    {{-- Previous Page Link --}}
    @if (!$paginator->onFirstPage())
    <li class="page-item">
      <a class="page-link" href="{{ $paginator->previousPageUrl() }}" rel="prev" aria-label="@lang('pagination.previous')" data-page="{{ $paginator->currentPage() - 1 }}">&lsaquo;</a>
    </li>
    @endif

    {{-- Pagination Elements --}}
    @foreach ($elements as $element)

    {{-- "Three Dots" Separator --}}
    @if (is_string($element))
    <li class="page-item disabled" aria-disabled="true"><span class="page-link">{{ $element }}</span></li>
    @endif

    {{-- Array Of Links --}}
    @if (is_array($element))

    @foreach ($element as $page => $url)

    @if ($page == $paginator->currentPage())
    <li class="page-item active" aria-current="page"><span class="page-link">{{ $page }}</span></li>
    @endif

    @if ($page != $paginator->currentPage())
    <li class="page-item">
      <a class="page-link" href="{{ $url }}" data-page="{{ $page }}">{{ $page }}</a>
    </li>
    @endif

    @endforeach

    @endif

    @endforeach

    {{-- Next Page Link --}}
    @if ($paginator->hasMorePages())
    <li class="page-item">
      <a class="page-link" href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="@lang('pagination.next')" data-page="{{ $paginator->currentPage() + 1 }}">&rsaquo;</a>
    </li>
    @endif

    {{-- Last Page Link --}}
    @if ($paginator->hasMorePages())
    <li class="page-item last-item">
      <a class="page-link" href="{{ $paginator->url($paginator->lastPage()) }}" rel="last" aria-label="@lang('pagination.last')" data-page="{{ $paginator->lastPage() }}">{{ __('Last') }}</a>
    </li>
    @endif

  </ul>

</nav>

@endif