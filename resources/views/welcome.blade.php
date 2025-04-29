@extends('layouts.app')

@php use \App\Helpers\Classes\SvgHelper; @endphp

@section('content')

{!! SvgHelper::getSvg('close-icon'); !!}
<h1>Welcome</h1>

@endsection