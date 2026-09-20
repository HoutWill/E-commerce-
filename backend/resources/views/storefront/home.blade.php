@extends('layouts.app')

@section('title', 'CLASSY BLING — Viral Blind Boxes, Plush Dolls & Designer Toys')

@section('content')
    <!-- 1. Original Wavy Promotional Split Carousel Banner -->
    @include('components.promo-carousel')

    <!-- 2. Original POP NOW Drops Shelf with Pick Now Modal -->
    @include('components.pop-now')

    <!-- 3. Full Product Catalog Section (Direct on Homepage) -->
    <div id="products" class="scroll-mt-20">
        @include('components.catalog')
    </div>


@endsection
