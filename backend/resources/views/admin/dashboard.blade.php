<!DOCTYPE html>
<html lang="en" data-theme="pinion" data-tune="editorial" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin Dashboard Control Panel — CLASSY BLING</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">

    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-heading { font-family: 'Space Grotesk', sans-serif; }
    </style>
</head>
<body class="min-h-screen bg-base-200/50 text-base-content antialiased"
      x-data="{
          activeTab: 'products',
          addProductModal: false,
          editProductModal: false,
          editingProduct: null,
          theme: localStorage.getItem('classy_theme') || 'pinion',
          toggleTheme() {
              this.theme = this.theme === 'pinion' ? 'pinion-dark' : 'pinion';
              document.documentElement.setAttribute('data-theme', this.theme);
              localStorage.setItem('classy_theme', this.theme);
          },
          openEdit(product) {
              this.editingProduct = product;
              this.editProductModal = true;
          },
          async toggleStockAjax(productId, btn) {
              try {
                  const res = await fetch(`/admin/products/${productId}/toggle-stock`, {
                      method: 'POST',
                      headers: {
                          'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content,
                          'Accept': 'application/json'
                      }
                  });
                  const data = await res.json();
                  if (data.success) {
                      const badge = document.getElementById('stock-badge-' + productId);
                      if (badge) {
                          badge.textContent = data.stock_status;
                          badge.className = 'badge ' + data.badge_class + ' badge-sm font-bold uppercase text-[10px]';
                      }
                  }
              } catch (e) {
                  console.error(e);
              }
          }
      }"
      x-init="if (theme) document.documentElement.setAttribute('data-theme', theme);">

    <!-- Admin Top Navbar -->
    <header class="sticky top-0 z-40 bg-base-100 border-b border-base-300 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                
                <!-- Left: Branding & Tag -->
                <div class="flex items-center gap-3">
                    <img src="/logo.png" alt="Classy Bling" class="h-9 w-9 object-contain rounded-lg shadow-sm bg-white p-0.5 border border-base-300">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-heading font-extrabold text-base tracking-tight text-base-content">CLASSY BLING</span>
                            <span class="badge badge-primary badge-xs font-extrabold uppercase">Admin Control</span>
                        </div>
                        <div class="text-[10px] text-base-content/60 font-semibold">Store Management & Live Catalog</div>
                    </div>
                </div>

                <!-- Right: Storefront link, Theme switcher, Logout -->
                <div class="flex items-center gap-3">
                    <a href="{{ route('storefront.index') }}" target="_blank"
                       class="btn btn-sm btn-ghost border border-base-300 rounded-xl text-xs gap-1.5 font-semibold">
                        <i class="bi bi-shop"></i>
                        <span>Live Storefront</span>
                        <i class="bi bi-box-arrow-up-right text-[10px]"></i>
                    </a>

                    <button @click="toggleTheme()" class="btn btn-circle btn-sm btn-ghost border border-base-300">
                        <i class="bi" :class="theme === 'pinion' ? 'bi-moon-fill' : 'bi-sun-fill text-warning'"></i>
                    </button>

                    <div class="divider divider-horizontal my-3"></div>

                    <div class="flex items-center gap-2">
                        <div class="text-right hidden sm:block">
                            <div class="text-xs font-bold text-base-content">{{ Auth::user()->name }}</div>
                            <div class="text-[10px] text-primary font-semibold uppercase">Administrator</div>
                        </div>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="btn btn-sm btn-ghost text-error border border-error/20 hover:bg-error/10 rounded-xl text-xs font-bold gap-1">
                                <i class="bi bi-box-arrow-right"></i>
                                <span class="hidden sm:inline">Logout</span>
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    </header>

    <!-- Main Admin Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Flash Alerts -->
        @if(session('success'))
            <div class="alert alert-success shadow-md rounded-2xl mb-6 text-sm font-medium border border-success/30">
                <i class="bi bi-check-circle-fill text-lg"></i>
                <span>{{ session('success') }}</span>
            </div>
        @endif

        @if(session('error'))
            <div class="alert alert-error shadow-md rounded-2xl mb-6 text-sm font-medium border border-error/30">
                <i class="bi bi-exclamation-triangle-fill text-lg"></i>
                <span>{{ session('error') }}</span>
            </div>
        @endif

        <!-- KPI Metrics Strip -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
            <!-- Total Products -->
            <div class="card bg-base-100 border border-base-300 p-4 rounded-2xl shadow-sm">
                <div class="text-xs text-base-content/60 font-bold uppercase tracking-wider mb-1">Total Catalog</div>
                <div class="flex items-baseline justify-between">
                    <span class="font-heading font-extrabold text-2xl text-base-content">{{ $totalProducts }}</span>
                    <span class="text-primary text-xl"><i class="bi bi-boxes"></i></span>
                </div>
                <div class="text-[11px] text-base-content/50 mt-1">Live active SKUs</div>
            </div>

            <!-- In Stock -->
            <div class="card bg-base-100 border border-base-300 p-4 rounded-2xl shadow-sm">
                <div class="text-xs text-success font-bold uppercase tracking-wider mb-1">In Stock</div>
                <div class="flex items-baseline justify-between">
                    <span class="font-heading font-extrabold text-2xl text-success">{{ $inStockCount }}</span>
                    <span class="text-success text-xl"><i class="bi bi-check2-circle"></i></span>
                </div>
                <div class="text-[11px] text-base-content/50 mt-1">Available for delivery</div>
            </div>

            <!-- Sold Out -->
            <div class="card bg-base-100 border border-base-300 p-4 rounded-2xl shadow-sm">
                <div class="text-xs text-error font-bold uppercase tracking-wider mb-1">Sold Out</div>
                <div class="flex items-baseline justify-between">
                    <span class="font-heading font-extrabold text-2xl text-error">{{ $soldOutCount }}</span>
                    <span class="text-error text-xl"><i class="bi bi-slash-circle"></i></span>
                </div>
                <div class="text-[11px] text-base-content/50 mt-1">Awaiting restock</div>
            </div>

            <!-- Total Catalog Value -->
            <div class="card bg-base-100 border border-base-300 p-4 rounded-2xl shadow-sm">
                <div class="text-xs text-base-content/60 font-bold uppercase tracking-wider mb-1">Catalog Value</div>
                <div class="flex items-baseline justify-between">
                    <span class="font-heading font-extrabold text-2xl text-base-content">${{ number_format($totalValueUsd, 2) }}</span>
                    <span class="text-warning text-xl"><i class="bi bi-cash-stack"></i></span>
                </div>
                <div class="text-[11px] text-base-content/50 mt-1">~ {{ number_format($totalValueKhr) }} ៛</div>
            </div>

            <!-- Viral / Featured -->
            <div class="card bg-base-100 border border-base-300 p-4 rounded-2xl shadow-sm col-span-2 lg:col-span-1">
                <div class="text-xs text-error font-bold uppercase tracking-wider mb-1">Viral Spotlights</div>
                <div class="flex items-baseline justify-between">
                    <span class="font-heading font-extrabold text-2xl text-base-content">{{ $featuredCount }}</span>
                    <span class="text-error text-xl"><i class="bi bi-fire"></i></span>
                </div>
                <div class="text-[11px] text-base-content/50 mt-1">Hero & Viral Drops</div>
            </div>
        </div>

        <!-- Tab Controls -->
        <div class="flex items-center gap-2 mb-6 border-b border-base-300 pb-3">
            <button @click="activeTab = 'products'"
                    :class="activeTab === 'products' ? 'btn-primary font-bold shadow-sm' : 'btn-ghost text-base-content/70'"
                    class="btn btn-sm rounded-xl text-xs gap-2">
                <i class="bi bi-box-seam-fill"></i>
                <span>Product Inventory ({{ $products->total() }})</span>
            </button>

            <button @click="activeTab = 'settings'"
                    :class="activeTab === 'settings' ? 'btn-primary font-bold shadow-sm' : 'btn-ghost text-base-content/70'"
                    class="btn btn-sm rounded-xl text-xs gap-2">
                <i class="bi bi-gear-fill"></i>
                <span>Storefront Settings & Socials</span>
            </button>
        </div>

        <!-- TAB 1: PRODUCT INVENTORY MANAGEMENT -->
        <div x-show="activeTab === 'products'" class="space-y-6">
            
            <!-- Controls: Search, Filter, Add New Button -->
            <div class="bg-base-100 p-4 rounded-2xl border border-base-300 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                <!-- Search & Filters -->
                <form action="{{ route('admin.dashboard') }}" method="GET" class="flex flex-wrap items-center gap-2 flex-1">
                    <div class="relative flex-1 min-w-[200px]">
                        <input type="text" name="q" value="{{ request('q') }}"
                               placeholder="Search by name, brand, series..."
                               class="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        <i class="bi bi-search text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
                    </div>

                    <select name="stock_status" onchange="this.form.submit()" class="select select-bordered select-sm text-xs rounded-xl bg-base-200">
                        <option value="All">All Stock Statuses</option>
                        <option value="In Stock" {{ request('stock_status') == 'In Stock' ? 'selected' : '' }}>In Stock</option>
                        <option value="Low Stock" {{ request('stock_status') == 'Low Stock' ? 'selected' : '' }}>Low Stock</option>
                        <option value="Pre-Order" {{ request('stock_status') == 'Pre-Order' ? 'selected' : '' }}>Pre-Order</option>
                        <option value="Sold Out" {{ request('stock_status') == 'Sold Out' ? 'selected' : '' }}>Sold Out</option>
                    </select>

                    <button type="submit" class="btn btn-sm btn-neutral rounded-xl text-xs">Filter</button>
                    @if(request('q') || request('stock_status') || request('category'))
                        <a href="{{ route('admin.dashboard') }}" class="btn btn-sm btn-ghost text-error text-xs rounded-xl">Clear</a>
                    @endif
                </form>

                <!-- Add New Product Button -->
                <button @click="addProductModal = true" class="btn btn-sm btn-primary rounded-xl font-bold gap-2 text-xs shadow-md">
                    <i class="bi bi-plus-lg"></i>
                    <span>Add New Product</span>
                </button>
            </div>

            <!-- Products Table -->
            <div class="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="table table-sm w-full">
                        <thead class="bg-base-200/70 text-base-content/70 text-[11px] uppercase tracking-wider font-bold">
                            <tr>
                                <th>Item / Image</th>
                                <th>Brand & Category</th>
                                <th>Price</th>
                                <th>Stock Status</th>
                                <th class="text-center">Instant Stock Toggle</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-base-200 text-xs">
                            @foreach($products as $p)
                                <tr class="hover:bg-base-200/40 transition">
                                    
                                    <!-- Image + Name -->
                                    <td class="py-3">
                                        <div class="flex items-center gap-3">
                                            <div class="w-12 h-12 rounded-xl bg-base-200 border border-base-300 overflow-hidden shrink-0 flex items-center justify-center p-1">
                                                <img src="{{ $p->image_url }}" alt="{{ $p->name }}"
                                                     class="w-full h-full object-contain"
                                                     onerror="this.onerror=null; this.src='/logo.png';">
                                            </div>
                                            <div class="max-w-xs">
                                                <div class="font-bold text-base-content hover:text-primary transition">{{ $p->name }}</div>
                                                <div class="text-[10px] text-base-content/50 font-mono">{{ $p->id }}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Brand & Category -->
                                    <td>
                                        <div class="font-semibold text-base-content">{{ $p->brand ?? 'Classy Bling' }}</div>
                                        <div class="text-[11px] text-primary">{{ $p->category }}</div>
                                    </td>

                                    <!-- Price -->
                                    <td>
                                        <div class="font-heading font-extrabold text-sm text-base-content">${{ number_format($p->price, 2) }}</div>
                                        <div class="text-[10px] text-base-content/60 font-semibold">{{ $p->price_khr }} ៛</div>
                                    </td>

                                    <!-- Stock Status Badge -->
                                    <td>
                                        <span id="stock-badge-{{ $p->id }}" class="badge {{ $p->badge_class }} badge-sm font-bold uppercase text-[10px]">
                                            {{ $p->stock_status }}
                                        </span>
                                    </td>

                                    <!-- Instant Stock Toggle Button -->
                                    <td class="text-center">
                                        <button type="button"
                                                @click="toggleStockAjax('{{ $p->id }}', $el)"
                                                class="btn btn-xs btn-outline rounded-lg font-bold gap-1 transition"
                                                :class="'{{ $p->stock_status }}' === 'In Stock' ? 'btn-error' : 'btn-success'"
                                                title="1-Click toggle between In Stock and Sold Out">
                                            <i class="bi bi-arrow-repeat"></i>
                                            <span>Toggle Status</span>
                                        </button>
                                    </td>

                                    <!-- Actions: Edit & Delete -->
                                    <td class="text-right">
                                        <div class="flex items-center justify-end gap-1">
                                            <button @click="openEdit({{ json_encode($p) }})"
                                                    class="btn btn-ghost btn-xs btn-circle text-primary hover:bg-primary/10" title="Edit Product">
                                                <i class="bi bi-pencil-square text-sm"></i>
                                            </button>

                                            <form method="POST" action="{{ route('admin.products.destroy', $p->id) }}"
                                                  onsubmit="return confirm('Are you sure you want to delete {{ addslashes($p->name) }} from the catalog?');" class="inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10" title="Delete Product">
                                                    <i class="bi bi-trash3-fill text-sm"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>

                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="p-4 border-t border-base-200">
                    {{ $products->links() }}
                </div>
            </div>

        </div>

        <!-- TAB 2: STORE SETTINGS -->
        <div x-show="activeTab === 'settings'" class="max-w-3xl mx-auto space-y-6" style="display: none;">
            <div class="bg-base-100 p-6 sm:p-8 rounded-3xl border border-base-300 shadow-sm">
                <div class="mb-6">
                    <h3 class="font-heading font-extrabold text-lg text-base-content flex items-center gap-2">
                        <i class="bi bi-sliders text-primary"></i> Storefront Configuration & Social Links
                    </h3>
                    <p class="text-xs text-base-content/60">Manage direct Telegram numbers, TikTok handle, and live announcement banner</p>
                </div>

                <form method="POST" action="{{ route('admin.settings.update') }}" class="space-y-5">
                    @csrf

                    <!-- Store Name & Tagline -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-base-content/80 mb-1">Store Name</label>
                            <input type="text" name="store_name" value="{{ $settings['store_name'] }}" required
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-base-content/80 mb-1">Owner / Creator Name</label>
                            <input type="text" name="owner_name" value="{{ $settings['owner_name'] }}" required
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-base-content/80 mb-1">Tagline</label>
                        <input type="text" name="tagline" value="{{ $settings['tagline'] }}"
                               class="w-full px-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                    </div>

                    <!-- Telegram Settings -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-base-200">
                        <div>
                            <label class="block text-xs font-bold text-base-content/80 mb-1">Telegram Phone Hotline</label>
                            <input type="text" name="telegram_phone" value="{{ $settings['telegram_phone'] }}"
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-base-content/80 mb-1">Telegram Order URL</label>
                            <input type="url" name="telegram_url" value="{{ $settings['telegram_url'] }}"
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                    </div>

                    <!-- TikTok & Exchange Rate -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-base-content/80 mb-1">TikTok Handle</label>
                            <input type="text" name="tiktok_handle" value="{{ $settings['tiktok_handle'] }}"
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-base-content/80 mb-1">KHR Exchange Rate (1 USD = ? Riel)</label>
                            <input type="number" name="khr_rate" value="{{ $settings['khr_rate'] }}"
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                    </div>

                    <!-- Showroom Location -->
                    <div class="pt-2 border-t border-base-200 space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-base-content/80 mb-1">Showroom Address</label>
                            <input type="text" name="address" value="{{ $settings['address'] }}"
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-base-content/80 mb-1">Google Maps Showroom URL</label>
                            <input type="url" name="google_maps_url" value="{{ $settings['google_maps_url'] }}"
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                    </div>

                    <!-- Top Announcement Bar -->
                    <div class="pt-2 border-t border-base-200 space-y-3">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="show_announcement" value="1" {{ $settings['show_announcement'] ? 'checked' : '' }} class="checkbox checkbox-sm checkbox-primary rounded">
                            <span class="text-xs font-bold text-base-content">Display Top Live Announcement Banner</span>
                        </label>
                        <div>
                            <label class="block text-xs font-bold text-base-content/80 mb-1">Banner Announcement Text</label>
                            <textarea name="announcement_text" rows="2"
                                      class="w-full p-3 text-xs rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">{{ $settings['announcement_text'] }}</textarea>
                        </div>
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="btn btn-primary rounded-xl font-bold text-xs px-6 shadow-md">
                            Save All Settings
                        </button>
                    </div>

                </form>
            </div>
        </div>

    </main>

    <!-- MODAL: ADD NEW PRODUCT -->
    <div x-show="addProductModal"
         class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
         style="display: none;"
         @keydown.escape.window="addProductModal = false">
        
        <div @click.outside="addProductModal = false"
             class="bg-base-100 border border-base-300 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative">
            
            <button @click="addProductModal = false" class="btn btn-circle btn-sm btn-ghost absolute right-4 top-4">
                <i class="bi bi-x text-lg"></i>
            </button>

            <h3 class="font-heading font-extrabold text-lg text-base-content mb-4 flex items-center gap-2">
                <i class="bi bi-plus-circle-fill text-primary"></i> Add New Product to Catalog
            </h3>

            <form method="POST" action="{{ route('admin.products.store') }}" class="space-y-3 text-xs">
                @csrf

                <div>
                    <label class="block font-bold text-base-content/80 mb-1">Product Name</label>
                    <input type="text" name="name" required placeholder="e.g. Pop Mart Hirono V6"
                           class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-base-content/80 mb-1">Price (USD $)</label>
                        <input type="number" step="0.5" name="price" required placeholder="19.50"
                               class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                    </div>
                    <div>
                        <label class="block font-bold text-base-content/80 mb-1">Stock Status</label>
                        <select name="stock_status" class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Pre-Order">Pre-Order</option>
                            <option value="Sold Out">Sold Out</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-base-content/80 mb-1">Category</label>
                        <input type="text" name="category" required placeholder="Plush Dolls"
                               class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                    </div>
                    <div>
                        <label class="block font-bold text-base-content/80 mb-1">Brand</label>
                        <input type="text" name="brand" placeholder="Pop Mart"
                               class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-base-content/80 mb-1">Image URL / Box Path</label>
                    <input type="text" name="image_url" required placeholder="/3d_boxes/labubu_macaron_box_ai.jpg"
                           class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                </div>

                <div>
                    <label class="block font-bold text-base-content/80 mb-1">Description</label>
                    <textarea name="description" rows="2" placeholder="Description of the blind box or toy..."
                              class="w-full p-3 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary"></textarea>
                </div>

                <div class="pt-2 flex items-center justify-between">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="featured" value="1" class="checkbox checkbox-xs checkbox-primary rounded">
                        <span class="font-bold text-base-content">Mark as Featured / Viral Drop</span>
                    </label>

                    <button type="submit" class="btn btn-sm btn-primary rounded-xl font-bold">
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL: EDIT PRODUCT -->
    <div x-show="editProductModal"
         class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
         style="display: none;"
         @keydown.escape.window="editProductModal = false">
        
        <div @click.outside="editProductModal = false"
             class="bg-base-100 border border-base-300 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative">
            
            <button @click="editProductModal = false" class="btn btn-circle btn-sm btn-ghost absolute right-4 top-4">
                <i class="bi bi-x text-lg"></i>
            </button>

            <h3 class="font-heading font-extrabold text-lg text-base-content mb-4 flex items-center gap-2">
                <i class="bi bi-pencil-square text-primary"></i> Edit Product
            </h3>

            <template x-if="editingProduct">
                <form :action="'/admin/products/' + editingProduct.id" method="POST" class="space-y-3 text-xs">
                    @csrf
                    @method('PUT')

                    <div>
                        <label class="block font-bold text-base-content/80 mb-1">Product Name</label>
                        <input type="text" name="name" x-model="editingProduct.name" required
                               class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-bold text-base-content/80 mb-1">Price (USD $)</label>
                            <input type="number" step="0.5" name="price" x-model="editingProduct.price" required
                                   class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                        <div>
                            <label class="block font-bold text-base-content/80 mb-1">Stock Status</label>
                            <select name="stock_status" x-model="editingProduct.stock_status" class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Pre-Order">Pre-Order</option>
                                <option value="Sold Out">Sold Out</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-bold text-base-content/80 mb-1">Category</label>
                            <input type="text" name="category" x-model="editingProduct.category" required
                                   class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                        <div>
                            <label class="block font-bold text-base-content/80 mb-1">Brand</label>
                            <input type="text" name="brand" x-model="editingProduct.brand"
                                   class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-base-content/80 mb-1">Image URL</label>
                        <input type="text" name="image_url" x-model="editingProduct.image_url" required
                               class="w-full px-3 py-2 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary">
                    </div>

                    <div>
                        <label class="block font-bold text-base-content/80 mb-1">Description</label>
                        <textarea name="description" x-model="editingProduct.description" rows="2"
                                  class="w-full p-3 rounded-xl bg-base-200 border border-base-300 focus:outline-none focus:border-primary"></textarea>
                    </div>

                    <div class="pt-2 flex items-center justify-between">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="featured" value="1" :checked="editingProduct.featured" class="checkbox checkbox-xs checkbox-primary rounded">
                            <span class="font-bold text-base-content">Featured / Viral Drop</span>
                        </label>

                        <button type="submit" class="btn btn-sm btn-primary rounded-xl font-bold">
                            Update Product
                        </button>
                    </div>
                </form>
            </template>
        </div>
    </div>

</body>
</html>
