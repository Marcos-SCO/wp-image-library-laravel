@php use \App\Helpers\Classes\SvgHelper; @endphp
<header class="page-header py-4 pb-5 pt-xl-5 text-white bg-dark position-relative">

    <div class="container position-relative">

        <div class="session-controls-container d-flex justify-content-end align-items-center top-0 end-0 mt-3 me-3">
            @auth

            <div class="auth-username me-3 d-flex align-center">
                <span>{!! SvgHelper::getSvg('user-icon') !!}</span>
                <span>{{ auth()->user()->name }}</span>
            </div>

            <form action="{{ route('logout') }}" method="POST" class="d-inline" hx-boost="false">
                @csrf
                <button type="submit" class="btn btn-outline-light btn-sm">
                    {{ __('Logout') }}
                </button>
            </form>

            @else
            <a href="{{ route('login') }}" class="btn btn-outline-light btn-sm">
                {{ __('Login') }}
            </a>
            @endauth
        </div>

        <div>
            <h1 class="text-center mb-3">{{ __('WP Media Library Laravel') }}</h1>
            
            <small class="d-block mb-3 text-center">A image library inspired by Wordpress</small>
        </div>

        <nav class="d-flex flex-wrap justify-content-center gap-3 pt-2">
            <a href="{{ route('gallery.index') }}" class="btn btn-light py-2 px-4">{{ __('Main library page') }}</a>
            <a href="{{ route('gallery.demonstrationButtonsPage') }}" class="btn btn-light py-2 px-4">{{ __('Demonstration  Modal buttons') }}</a>
        </nav>
    </div>
</header>