@extends('layouts.app')

@section('title', 'CLASSY BLING — Authentic Blind Boxes, Plush Dolls & Designer Toys')

@section('content')
    <!-- 1. Original Wavy Promotional Split Carousel Banner -->
    @include('components.promo-carousel')

    <!-- 2. Original POP NOW Drops Shelf with Pick Now Modal -->
    @include('components.pop-now')

    <!-- 3. Original Signature Catalog Section (Top Tabs + Left Sub-filter Icon Rail + Product Cards) -->
    @include('components.catalog')
@endsection
