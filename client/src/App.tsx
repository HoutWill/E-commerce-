import React, { useState, useEffect } from 'react';
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

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubFilter, setSelectedSubFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Modals & Admin Gate / Dashboard
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
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

  // Verify token on mount or when token changes
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
      setIsLoading(true);

      let minPrice: number | undefined = undefined;
      let maxPrice: number | undefined = undefined;
      let inStockOnly = false;
      let categoryFilter = selectedCategory !== 'All' ? selectedCategory : undefined;

      // Handle sub-filter icon rail values
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

      const [prodRes, catRes, brandRes] = await Promise.all([
        api.getProducts({
          search: search || undefined,
          category: categoryFilter,
          inStockOnly,
          minPrice,
          maxPrice,
          sort
        }),
        api.getCategories(),
        api.getBrands()
      ]);

      setProducts(prodRes.products);
      setCategories(catRes);
      setBrands(brandRes);
    } catch (err) {
      console.error('Error loading catalog data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory, selectedSubFilter, sort]);

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
      <main className="flex-1 pb-24 md:pb-16 space-y-4">
        
        {/* Clean Promotional Carousel Banner */}
        <PromoCarousel />

        {/* 3D Pop Up "POP NOW" Section */}
        <PopNowSection />

        {/* Main Catalog Area with Top Horizontal Category Tabs & Left Vertical Icon Rail */}
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

      {/* Rich Footer with Admin Gate Link */}
      <Footer onOpenAdmin={() => setIsAdminRequested(true)} />

      {/* Floating Bottom Navigation Bar for iPhone & iPad */}
      <BottomNav />

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
