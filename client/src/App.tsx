import React, { useState, useEffect, useTransition } from 'react';
import { Product } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { PromoCarousel } from './components/PromoCarousel';
import { PopNowSection } from './components/PopNowSection';
import { CatalogSection } from './components/CatalogSection';
import { ProductModal } from './components/ProductModal';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminGate } from './components/AdminGate';

export function App() {
  // Theme state with localStorage persistence (Default: light mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('classybling_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('classybling_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Debounced Search
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubFilter, setSelectedSubFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Debounce search query by 250ms to prevent spamming network requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Modals & Admin Gate / Dashboard
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPopNowModalOpen, setIsPopNowModalOpen] = useState(false);
  
  // Check if admin route / param requested (adminGate=true, admin=true, or /adminGate)
  const isInitialAdminRequested = () => {
    const search = window.location.search;
    const path = window.location.pathname;
    return search.includes('adminGate') || search.includes('admin=true') || path.includes('adminGate');
  };

  const [isAdminRequested, setIsAdminRequested] = useState(isInitialAdminRequested);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('classybling_admin_token');
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Computed modal active state for hiding floating BottomNav
  const isAnyModalOpen = Boolean(selectedProduct || isPopNowModalOpen || isAdminRequested);

  // Verify admin token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem('classybling_admin_token');
      if (token) {
        const res = await api.verifyAdmin(token);
        if (res.authenticated) {
          setAdminToken(token);
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('classybling_admin_token');
          setAdminToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);

  // Fetch Categories & Brands ONCE on mount (cached in memory)
  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
    api.getBrands().then(setBrands).catch(() => {});
  }, []);

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    setIsAuthenticated(true);
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      await api.logoutAdmin(adminToken);
    }
    sessionStorage.removeItem('classybling_admin_token');
    setAdminToken(null);
    setIsAuthenticated(false);
    setIsAdminRequested(false);
    if (window.location.search.includes('adminGate') || window.location.search.includes('admin=true')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const loadData = async () => {
    try {
      let minPrice: number | undefined = undefined;
      let maxPrice: number | undefined = undefined;
      let inStockOnly = false;
      let categoryFilter = selectedCategory !== 'All' ? selectedCategory : undefined;

      // Handle sub-filter values
      if (selectedSubFilter === 'plush') {
        categoryFilter = 'Plush Dolls';
      } else if (selectedSubFilter === 'box') {
        categoryFilter = 'Blind Box';
      } else if (selectedSubFilter === 'in_stock') {
        inStockOnly = true;
      } else if (selectedSubFilter === 'under_12') {
        maxPrice = 12;
      } else if (selectedSubFilter === '12_15') {
        minPrice = 12;
        maxPrice = 15;
      } else if (selectedSubFilter === 'over_15') {
        minPrice = 15;
      }

      const prodRes = await api.getProducts({
        search: debouncedSearch || undefined,
        category: categoryFilter,
        inStockOnly,
        minPrice,
        maxPrice,
        sort
      });

      setProducts(prodRes.products);
    } catch (err) {
      console.error('Error loading catalog data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [debouncedSearch, selectedCategory, selectedSubFilter, sort]);

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await api.updateProduct(id, updates);
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      setSelectedProduct(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200" id="home">
      
      {/* Top Header with Classy Bling Logo, Telegram, TikTok & Theme */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-16 space-y-3 sm:space-y-4">
        
        {/* Promotional Carousel Banner with Touch Swipe */}
        <PromoCarousel />

        {/* 3D Pop Up "POP NOW" Section */}
        <PopNowSection onModalChange={setIsPopNowModalOpen} />

        {/* Main Catalog Area */}
        <CatalogSection
          products={products}
          isLoading={isLoading}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedSubFilter={selectedSubFilter}
          onSelectSubFilter={setSelectedSubFilter}
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          onOpenModal={setSelectedProduct}
        />

      </main>

      {/* Rich Footer */}
      <Footer />

      {/* Floating Bottom Navigation Bar for Mobile Phones & Tablets */}
      <BottomNav isHidden={isAnyModalOpen} />

      {/* Customer Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Admin Security Gate (When Requested but Not Authenticated) */}
      {isAdminRequested && !isAuthenticated && (
        <AdminGate
          onSuccess={handleAdminLoginSuccess}
          onClose={() => {
            setIsAdminRequested(false);
            if (window.location.search.includes('adminGate') || window.location.search.includes('admin=true')) {
              window.history.replaceState({}, '', window.location.pathname);
            }
          }}
        />
      )}

      {/* Full Admin Dashboard Control Center (When Authenticated) */}
      {isAdminRequested && isAuthenticated && (
        <AdminDashboard
          onClose={() => {
            setIsAdminRequested(false);
            if (window.location.search.includes('adminGate') || window.location.search.includes('admin=true')) {
              window.history.replaceState({}, '', window.location.pathname);
            }
          }}
          onLogout={handleAdminLogout}
          onRefreshCatalog={loadData}
        />
      )}

    </div>
  );
}

export default App;
