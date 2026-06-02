<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="app-url" content="{{ url('/') }}">

    <!-- SEO Meta Tags -->
    <title>IT Park Cafe Finder | セブ島ITパークのカフェ検索</title>
    <meta name="description" content="セブ島ITパークエリアのカフェを簡単に検索。Wi-Fi速度、コンセント有無、24時間営業などの条件でピッタリのカフェを見つけよう！">
    <meta name="keywords" content="Cebu, IT Park, Cafe, WiFi, Nomad, セブ島, ITパーク, カフェ, ノマド, 作業向き">

    <!-- Font Awesome (Free) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- OGP / Social Media Tags -->
    <meta property="og:title" content="IT Park Cafe Finder">
    <meta property="og:description" content="セブ島ITパークエリアのカフェを簡単に検索。Wi-Fi速度や電源の有無で条件絞り込み！">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:site_name" content="IT Park Cafe Finder">
    <meta property="og:image" content="{{ asset('images/ogp_banner.png') }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="{{ asset('images/ogp_banner.png') }}">

    <!-- Theme Color & Icons -->
    <meta name="theme-color" content="#2ABFBF">


    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
