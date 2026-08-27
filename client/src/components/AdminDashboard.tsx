import React, { useState, useEffect } from 'react';
import { Product, StockStatus } from '../types';
import { api } from './../services/api';
import { 
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  Package,
  FileText,
  Tag,
  Settings,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  ArrowLeft,
  Save,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Printer,
  Download,
  AlertTriangle,
  Flame,
  Truck,
  Send,
  Grid,
  List,
  Calendar as CalendarIcon,
  MapPin,
  Globe,
  Share2,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Crosshair,
  Navigation,
  Compass,
  User,
  Megaphone,
  EyeOff,
  MessageSquare
} from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshCatalog: () => void;
  onLogout?: () => void;
}

type NavSection = 'overview' | 'reports' | 'pos' | 'catalog' | 'invoices' | 'promotions' | 'settings';
type OverviewPeriod = 'today' | 'this_week' | 'this_month' | 'this_year';
type ReportTab = 'reports' | 'calendar';

export interface StoreSettingsData {
  ownerName: string;
  ownerRole: string;
  storeName: string;
  tagline: string;
  locationName: string;
  address: string;
  googleMapsUrl: string;
  telegramPhone: string;
  telegramUsername: string;
  telegramUrl: string;
  tiktokHandle: string;
  tiktokUrl: string;
  facebookName: string;
  facebookUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  khrRate: number;
  showAnnouncement?: boolean;
  announcementText?: string;
}

const DEFAULT_SETTINGS: StoreSettingsData = {
  ownerName: 'Xiao yi',
  ownerRole: 'SHOP_OWNER',
  storeName: 'CLASSY BLING',
  tagline: 'Viral Blind Boxes & Luxury Plush Charms',
  locationName: 'Classy Bling Flagship Showroom',
  address: 'Street 271, Sangkat Phsar Doeum Thkov, Khan Chamkarmon, Phnom Penh, Cambodia',
  googleMapsUrl: 'https://maps.google.com/?q=Phnom+Penh+Cambodia',
  telegramPhone: '092917831 (+85592917831)',
  telegramUsername: '@classybling_order',
  telegramUrl: 'https://t.me/+85592917831',
  tiktokHandle: '@classy.bling',
  tiktokUrl: 'https://www.tiktok.com/@classy.bling',
  facebookName: 'Classy Bling Cambodia',
  facebookUrl: 'https://facebook.com',
  instagramHandle: '@classybling.kh',
  instagramUrl: 'https://instagram.com',
  khrRate: 4100,
  showAnnouncement: false,
  announcementText: 'Hey , if you seeing this , i just want to let you use this for free , i hope you interest but you dont seem to interest so i just dont want to rush , the fact is just we can work it and complete the product. well i guess thats it . Doing this as a friend to help in needed. :)',
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onRefreshCatalog,
  onLogout,
}) => {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  // Overview Date Period state
  const [overviewPeriod, setOverviewPeriod] = useState<OverviewPeriod>('this_week');

  // Reports Tab state (Reports vs Calendar)
  const [reportTab, setReportTab] = useState<ReportTab>('reports');
  const [reportTimeframe, setReportTimeframe] = useState('All Time');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(23);

  // Settings state
  const [settings, setSettings] = useState<StoreSettingsData>(() => {
    const saved = localStorage.getItem('classybling_store_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_SETTINGS; }
    }
    return DEFAULT_SETTINGS;
  });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);
  const [latitude, setLatitude] = useState(11.5368);
  const [longitude, setLongitude] = useState(104.9124);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [locationSearchResults, setLocationSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters for Catalog & POS
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // POS Cart State
  const [posCart, setPosCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [orderType, setOrderType] = useState('TELEGRAM (Telegram Order)');
  const [invoices, setInvoices] = useState<Array<{ no: string; date: string; customer: string; salesman: string; total: string; status: string }>>([]);

  // Product Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promotions State
  const [promotions, setPromotions] = useState([
    { id: 'promo-1', title: 'Baby Three Zodiac Series Banner', subtitle: 'Photo-only Banner', img: '/banner_classybling_babythree.png' },
    { id: 'promo-2', title: 'Nommi Pinky Energy Series Drop', subtitle: 'Photo-only Banner', img: '/banner_classybling_nommi.png' },
    { id: 'promo-3', title: 'Mega Space Molly 100% Collector Banner', subtitle: 'Photo-only Banner', img: '/banner_classybling_spacemolly.png' },
  ]);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<{ id: string; title: string; subtitle: string; img: string } | null>(null);

  // Available 3D studio box presets
  const boxPresets = [
    { label: 'Baby Three Zodiac', url: '/3d_boxes/baby_three_zodiac_studio_box_1787476804515.jpg' },
    { label: 'Mega Space Molly', url: '/3d_boxes/mega_space_molly_box_1787473086799.jpg' },
    { label: 'Nommi Pinky Energy', url: '/3d_boxes/nommi_pinky_energy_box_1787473059976.jpg' },
    { label: 'Baby Three Lolita', url: '/3d_boxes/baby_three_lolita_dream_box_1787473539024.jpg' },
    { label: 'Molly Baking Time', url: '/3d_boxes/molly_baking_time_box_1787473509030.jpg' },
    { label: 'Disney Stitch Sleep', url: '/3d_boxes/stitch_sleep_box_1787473179186.jpg' },
    { label: 'Baby Molly Tabby', url: '/3d_boxes/baby_molly_baby_tabby_box_1787473570037.jpg' },
    { label: 'Yumi EDM Festival', url: '/3d_boxes/yumi_edm_festival_box_1787473599903.jpg' },
    { label: 'Fox & Bunny Trick', url: '/3d_boxes/fox_bunny_trick_treat_box_1787473734642.jpg' },
    { label: 'Baby Three Mini', url: '/3d_boxes/baby_three_mini_animals_box_1787473113424.jpg' },
    { label: 'Molly Fruit Watermelon', url: '/3d_boxes/molly_fruit_watermelon_box_1787473215089.jpg' },
    { label: 'Baby Three Weirdly', url: '/3d_boxes/baby_three_weirdly_adorable_box_1787473293359.jpg' },
  ];

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes, brandRes, settingsRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getBrands(),
        api.getSettings()
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
      setBrands(brandRes);
      if (settingsRes && typeof settingsRes === 'object') {
        setSettings(settingsRes);
        if (settingsRes.googleMapsUrl) {
          const match = settingsRes.googleMapsUrl.match(/q=([0-9.-]+),([0-9.-]+)/);
          if (match) {
            setLatitude(parseFloat(match[1]) || 11.5368);
            setLongitude(parseFloat(match[2]) || 104.9124);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Filtered product list
  const filteredProducts = products.filter(p => {
    const matchSearch = search === '' || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchBrand = brandFilter === 'All' || p.brand.toLowerCase() === brandFilter.toLowerCase();
    const isInStock = p.stockStatus === 'In Stock';
    const matchStock = stockFilter === 'all' || 
      (stockFilter === 'in_stock' && isInStock) || 
      (stockFilter === 'out_of_stock' && !isInStock);

    return matchSearch && matchCategory && matchBrand && matchStock;
  });

  // Calculate Overview Stats based on period (Real dynamic data)
  const periodStats = {
    today: {
      revenue: 0.00,
      orders: 0,
      productsCount: products.length,
      visitors: 1,
      pageViews: 1,
      revGrowth: '0% today',
      ordersGrowth: '0 today',
      chartData: [
        { label: '09:00', value: '0%' },
        { label: '11:00', value: '0%' },
        { label: '13:00', value: '0%' },
        { label: '15:00', value: '0%' },
        { label: '17:00', value: '0%' },
        { label: '19:00', value: '0%' },
        { label: '21:00', value: '0%' },
      ]
    },
    this_week: {
      revenue: 0.00,
      orders: 0,
      productsCount: products.length,
      visitors: 1,
      pageViews: 1,
      revGrowth: '0% this week',
      ordersGrowth: '0 new',
      chartData: [
        { label: 'Mon', value: '0%' },
        { label: 'Tue', value: '0%' },
        { label: 'Wed', value: '0%' },
        { label: 'Thu', value: '0%' },
        { label: 'Fri', value: '0%' },
        { label: 'Sat', value: '0%' },
        { label: 'Sun', value: '0%' },
      ]
    },
    this_month: {
      revenue: 0.00,
      orders: 0,
      productsCount: products.length,
      visitors: 1,
      pageViews: 1,
      revGrowth: '0% this month',
      ordersGrowth: '0 this week',
      chartData: [
        { label: 'Week 1', value: '0%' },
        { label: 'Week 2', value: '0%' },
        { label: 'Week 3', value: '0%' },
        { label: 'Week 4', value: '0%' },
      ]
    },
    this_year: {
      revenue: 0.00,
      orders: 0,
      productsCount: products.length,
      visitors: 1,
      pageViews: 1,
      revGrowth: '0% this year',
      ordersGrowth: '0 this month',
      chartData: [
        { label: 'Q1', value: '0%' },
        { label: 'Q2', value: '0%' },
        { label: 'Q3', value: '0%' },
        { label: 'Q4', value: '0%' },
      ]
    }
  };

  const currentOverview = periodStats[overviewPeriod];

  // POS Actions
  const addToPosCart = (product: Product) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setPosCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as Array<{ product: Product; quantity: number }>);
  };

  const clearPosCart = () => {
    setPosCart([]);
  };

  const posSubtotal = posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Open Add Product Drawer
  const handleAddNew = () => {
    setEditingProduct({
      name: '',
      brand: 'Baby Three',
      category: 'Plush Dolls',
      series: 'Collector Edition',
      currency: 'USD',
      price: 13.50,
      stockStatus: 'In Stock',
      croppedImageUrl: boxPresets[0].url,
      originalScreenshotUrl: boxPresets[0].url,
      description: 'Original factory sealed blind box collectible with authentic certificate and chance for rare secret chase edition.',
      tags: ['New Arrival', 'Blind Box', 'In Stock']
    });
    setIsEditorOpen(true);
  };

  // Open Edit Product Drawer
  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditorOpen(true);
  };

  // Upload Product Image File from Computer
  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditingProduct(prev => prev ? {
          ...prev,
          croppedImageUrl: result,
          originalScreenshotUrl: result
        } : null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Promo Banner File from Computer
  const handlePromoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditingPromo(prev => prev ? {
          ...prev,
          img: result
        } : null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) return;

    try {
      setIsSubmitting(true);
      if (editingProduct.id) {
        const updated = await api.updateProduct(editingProduct.id, editingProduct);
        setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      } else {
        const created = await api.createProduct({
          ...editingProduct,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setProducts(prev => [created, ...prev]);
      }
      setIsEditorOpen(false);
      setEditingProduct(null);
      onRefreshCatalog();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error saving product. Please verify fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product
  const handleConfirmDelete = async () => {
    if (!isDeletingId) return;
    try {
      await api.deleteProduct(isDeletingId);
      setProducts(prev => prev.filter(p => p.id !== isDeletingId));
      setIsDeletingId(null);
      onRefreshCatalog();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Save Settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      window.dispatchEvent(new CustomEvent('classybling_settings_updated', { detail: settings }));
      setSettingsSavedToast(true);
      setTimeout(() => setSettingsSavedToast(false), 3500);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Error saving settings. Please try again.');
    }
  };

  // Toggle Announcement Status handler
  const handleToggleAnnouncement = async () => {
    const newStatus = !(settings.showAnnouncement ?? true);
    const updated = { ...settings, showAnnouncement: newStatus };
    setSettings(updated);
    try {
      await api.updateSettings(updated);
      window.dispatchEvent(new CustomEvent('classybling_settings_updated', { detail: updated }));
      setSettingsSavedToast(true);
      setTimeout(() => setSettingsSavedToast(false), 3000);
    } catch (err) {
      console.error('Failed to toggle announcement:', err);
    }
  };

  // GPS Locate Me Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        setSettings(prev => ({
          ...prev,
          googleMapsUrl: mapsUrl,
          address: prev.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}, Phnom Penh, Cambodia`
        }));
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          if (data && data.display_name) {
            setSettings(prev => ({
              ...prev,
              address: data.display_name,
              googleMapsUrl: mapsUrl
            }));
          }
        } catch (e) {
          // fallback
        }
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert("Could not retrieve GPS coordinates. Please allow location permissions in your browser or select an area below.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Smart Google Maps coordinate and URL parser
  const parseGoogleMapsCoords = (text: string): { lat: number; lng: number } | null => {
    if (!text) return null;
    const clean = text.trim();

    // 1. Google Maps Place format with 3d/4d coordinates: !3d11.523898!4d104.8247774
    const placeMatch = clean.match(/!3d([0-9.-]+)!4d([0-9.-]+)/);
    if (placeMatch) {
      const lat = parseFloat(placeMatch[1]);
      const lng = parseFloat(placeMatch[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }

    // 2. Plain coordinate pair: "11.5368, 104.9124", "11.5368,104.9124", "11.5368 104.9124"
    const plainCoordMatch = clean.match(/^[-+]?([0-9]+(?:\.[0-9]+)?)[,\s]+[-+]?([0-9]+(?:\.[0-9]+)?)$/);
    if (plainCoordMatch) {
      const lat = parseFloat(plainCoordMatch[1]);
      const lng = parseFloat(plainCoordMatch[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }

    // 3. Google Maps URL query / location: ?q=11.5368,104.9124 or @11.5368,104.9124
    const urlMatch = clean.match(/[@?&](?:q|ll|query|center|daddr)?=?([0-9.-]+)[,%2C\s]+([0-9.-]+)/i) ||
                     clean.match(/@([0-9.-]+),([0-9.-]+)/);
    if (urlMatch) {
      const lat = parseFloat(urlMatch[1]);
      const lng = parseFloat(urlMatch[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }

    return null;
  };

  // Location Search Handler (Supports address, landmark, coordinates, or Google Maps URL)
  const handleSearchLocation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = locationSearchQuery.trim();
    if (!query) return;

    // Check if query is a coordinate pair or Google Maps URL
    const parsedCoords = parseGoogleMapsCoords(query);
    if (parsedCoords) {
      const { lat, lng } = parsedCoords;
      setLatitude(lat);
      setLongitude(lng);
      const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
      setSettings(prev => ({
        ...prev,
        googleMapsUrl: mapsUrl,
        address: prev.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}, Phnom Penh, Cambodia`
      }));

      // Reverse geocode coordinate to get street address
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        if (data && data.display_name) {
          setSettings(prev => ({
            ...prev,
            address: data.display_name,
            locationName: prev.locationName || data.display_name.split(',')[0],
            googleMapsUrl: mapsUrl
          }));
        }
      } catch {}

      setLocationSearchResults([]);
      setLocationSearchQuery('');
      return;
    }

    // Otherwise standard search
    setIsSearchingLocation(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLocationSearchResults(data);
      } else {
        setLocationSearchResults([]);
        alert(`No locations found for "${query}". Please try another street, landmark, or coordinates.`);
      }
    } catch (err) {
      console.error('Location search error:', err);
      alert('Error searching for location. Please check your network connection.');
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Select a search result
  const handleSelectSearchResult = (item: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setLatitude(lat);
    setLongitude(lng);
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    setSettings(prev => ({
      ...prev,
      address: item.display_name,
      locationName: prev.locationName || item.display_name.split(',')[0],
      googleMapsUrl: mapsUrl
    }));
    setLocationSearchResults([]);
    setLocationSearchQuery('');
  };

  // Quick Preset Location Handler
  const handleSelectPresetLocation = (name: string, lat: number, lng: number, addr: string) => {
    setLatitude(lat);
    setLongitude(lng);
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    setSettings(prev => ({
      ...prev,
      locationName: name,
      address: addr,
      googleMapsUrl: mapsUrl
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#F4EFE6] dark:bg-[#121214] text-slate-900 dark:text-zinc-100 flex font-sans select-none">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} shrink-0 bg-[#FAF7F2] dark:bg-zinc-900/90 border-r border-[#E8E1D5] dark:border-zinc-800 flex flex-col justify-between transition-all duration-300 z-30`}>
        
        <div className="p-4 sm:p-5 space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2.5 overflow-hidden ${isSidebarCollapsed ? 'hidden' : 'flex'}`}>
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-xs shadow-xs">
                CB
              </div>
              <span className="font-extrabold text-base font-display tracking-tight text-slate-900 dark:text-white">
                Classy Bling
              </span>
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg border border-[#E0D7C6] dark:border-zinc-700 hover:bg-[#EFE8DC] dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 transition-colors mx-auto"
              title="Toggle sidebar"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Section: GENERAL */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 px-3 pb-1 block">
                GENERAL
              </span>
            )}

            {/* Overview */}
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeSection === 'overview'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-[#E0D7C6] dark:border-zinc-700 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-[#EFE8DC] dark:hover:bg-zinc-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Overview</span>}
            </button>

            {/* Reports */}
            <button
              onClick={() => setActiveSection('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeSection === 'reports'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-[#E0D7C6] dark:border-zinc-700 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-[#EFE8DC] dark:hover:bg-zinc-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Reports</span>}
            </button>

            {/* POS */}
            <button
              onClick={() => setActiveSection('pos')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeSection === 'pos'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-[#E0D7C6] dark:border-zinc-700 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-[#EFE8DC] dark:hover:bg-zinc-800/60'
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>POS Register</span>}
            </button>

            {/* Catalog */}
            <button
              onClick={() => setActiveSection('catalog')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeSection === 'catalog'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-[#E0D7C6] dark:border-zinc-700 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-[#EFE8DC] dark:hover:bg-zinc-800/60'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Catalog</span>}
            </button>

            {/* Invoices */}
            <button
              onClick={() => setActiveSection('invoices')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeSection === 'invoices'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-[#E0D7C6] dark:border-zinc-700 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-[#EFE8DC] dark:hover:bg-zinc-800/60'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Invoices & Orders</span>}
            </button>

            {/* Promotions */}
            <button
              onClick={() => setActiveSection('promotions')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeSection === 'promotions'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-[#E0D7C6] dark:border-zinc-700 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-[#EFE8DC] dark:hover:bg-zinc-800/60'
              }`}
            >
              <Tag className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Promotions</span>}
            </button>
          </div>

          {/* Nav Section: MANAGEMENT */}
          <div className="space-y-1 pt-2">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 px-3 pb-1 block">
                MANAGEMENT
              </span>
            )}

            {/* Settings */}
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeSection === 'settings'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-[#E0D7C6] dark:border-zinc-700 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-[#EFE8DC] dark:hover:bg-zinc-800/60'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Settings</span>}
            </button>
          </div>

        </div>

        {/* Sidebar Bottom: Sound Status indicator */}
        <div className="p-4 border-t border-[#E8E1D5] dark:border-zinc-800">
          <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-800/50 border border-[#E0D7C6] dark:border-zinc-700 text-center text-[11px] font-bold text-slate-500 dark:text-zinc-400">
            {isSidebarCollapsed ? '🔊' : '🔊 Sound: Active'}
          </div>
        </div>

      </aside>

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F4EFE6] dark:bg-[#18181B] transition-colors">
        
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-transparent px-6 lg:px-8 flex items-center justify-between border-b border-[#E8E1D5] dark:border-zinc-800/80">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white capitalize font-display">
              {activeSection === 'overview' && 'Store Overview'}
              {activeSection === 'reports' && 'Financial Reports'}
              {activeSection === 'pos' && 'Live POS Terminal'}
              {activeSection === 'catalog' && 'Menu Management'}
              {activeSection === 'invoices' && 'Invoice Ledger'}
              {activeSection === 'promotions' && 'Promotions Manager'}
              {activeSection === 'settings' && 'Storefront & Location Settings'}
            </h2>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-[#E0D7C6] dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors shadow-xs"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-zinc-800 border border-[#E0D7C6] dark:border-zinc-700 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-[#B88E56] text-white flex items-center justify-center font-black text-xs">
                {settings.ownerName ? settings.ownerName.trim().charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  {settings.ownerName || 'Shop Owner'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-400 uppercase font-bold">
                  {settings.ownerRole || 'SHOP_OWNER'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onLogout) onLogout();
                onClose();
              }}
              className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-[#E0D7C6] dark:border-zinc-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors shadow-xs flex items-center gap-1.5 text-xs font-bold"
              title="Logout & Lock Admin Gate"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
          
          {/* TAB 1: OVERVIEW SCREEN with Working Date Period Filters */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Working Date Filter Tabs on Top Right */}
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold">
                {[
                  { key: 'today', label: 'Today' },
                  { key: 'this_week', label: 'This Week' },
                  { key: 'this_month', label: 'This Month' },
                  { key: 'this_year', label: 'This Year' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setOverviewPeriod(tab.key as OverviewPeriod)}
                    className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-extrabold ${
                      overviewPeriod === tab.key
                        ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 shadow-xs scale-105'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white/50 dark:bg-zinc-800/40 border border-[#E0D7C6]/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 5 Dynamic KPI Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                
                {/* 1. REVENUE */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-500 flex items-center justify-center font-black">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      REVENUE
                    </span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-display">
                      ${currentOverview.revenue.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>↗ {currentOverview.revGrowth}</span>
                  </div>
                </div>

                {/* 2. TOTAL ORDERS */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500 flex items-center justify-center font-black">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      TOTAL ORDERS
                    </span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-display">
                      {currentOverview.orders}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>↗ {currentOverview.ordersGrowth}</span>
                  </div>
                </div>

                {/* 3. TOTAL PRODUCTS */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center font-black">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      TOTAL PRODUCTS
                    </span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-display">
                      {products.length}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Active in catalog
                  </div>
                </div>

                {/* 4. ACTIVE VISITORS */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center font-black">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      ACTIVE VISITORS
                    </span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-display">
                      {currentOverview.visitors}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>Live Right Now</span>
                  </div>
                </div>

                {/* 5. STORE PAGE VIEWS */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center font-black">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      STORE PAGE VIEWS
                    </span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-display">
                      {currentOverview.pageViews}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    Total Store Visits
                  </div>
                </div>

              </div>

              {/* Middle Row: Dynamic Sales Chart & Low Stock Alert */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Sales Chart Container (8 cols) */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Sales Trend ({overviewPeriod.replace('_', ' ')})
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {overviewPeriod}
                    </span>
                  </div>

                  <div className="h-44 w-full flex items-end justify-between gap-2 pt-4 px-2">
                    {currentOverview.chartData.map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div 
                          className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-blue-500/20 to-blue-500 dark:from-blue-600/20 dark:to-blue-400 transition-all duration-300 group-hover:brightness-110 shadow-xs"
                          style={{ height: item.value }}
                        />
                        <span className="text-[11px] font-bold text-slate-400">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Alert (4 cols) */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Low Stock Alert</span>
                  </div>

                  <div className="py-6 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    {products.some(p => p.stockStatus === 'Out of Stock') ? (
                      <div className="space-y-2 text-left">
                        {products.filter(p => p.stockStatus === 'Out of Stock').slice(0, 3).map(p => (
                          <div key={p.id} className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 flex items-center justify-between text-xs font-bold">
                            <span className="line-clamp-1">{p.name}</span>
                            <span className="shrink-0 text-[10px] bg-rose-200 dark:bg-rose-900 px-1.5 py-0.5 rounded">0 left</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      'All items are in healthy stock levels.'
                    )}
                  </div>

                  <button 
                    onClick={() => setActiveSection('catalog')}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Manage Inventory
                  </button>
                </div>

              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Top Products */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-900 dark:text-white">
                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                    <span>Top Products</span>
                  </div>

                  <div className="space-y-2">
                    {products.slice(0, 3).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-zinc-800/80">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-zinc-200 line-clamp-1 max-w-[140px]">{p.name}</span>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white">${p.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Customers */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-900 dark:text-white">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>Top Customers</span>
                  </div>

                  <div className="py-5 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    No customer transactions recorded yet.
                  </div>
                </div>

                {/* Outstanding */}
                <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 uppercase">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Outstanding</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase">LIVE</span>
                  </div>

                  <div className="text-2xl font-black text-slate-900 dark:text-white font-display">
                    $0.00
                  </div>
                  <p className="text-[11px] text-slate-400">
                    0 invoices, 0 overdue payments.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: FINANCIAL REPORTS with Interactive Calendar View (Matching Reference Screenshots 1 & 2) */}
          {activeSection === 'reports' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Top Controls Toolbar matching Screenshot 1 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                    Financial Reports
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    View and print aggregated sales data and daily revenue calendars.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Toggle Pill: Reports vs Calendar */}
                  <div className="flex items-center rounded-2xl bg-white dark:bg-zinc-800 border border-[#E0D7C6] dark:border-zinc-700 p-1 shadow-xs">
                    <button
                      onClick={() => setReportTab('reports')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        reportTab === 'reports'
                          ? 'bg-[#2B6CB0] text-white shadow-xs'
                          : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Reports</span>
                    </button>

                    <button
                      onClick={() => setReportTab('calendar')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        reportTab === 'calendar'
                          ? 'bg-[#2B6CB0] text-white shadow-xs'
                          : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Calendar</span>
                    </button>
                  </div>

                  {/* Dropdown Timeframe */}
                  <select
                    value={reportTimeframe}
                    onChange={(e) => setReportTimeframe(e.target.value)}
                    className="py-1.5 px-3 rounded-xl border border-[#E0D7C6] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold"
                  >
                    <option value="All Time">All Time</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                  </select>

                  <button 
                    onClick={() => alert('Exporting CSV of sales performance...')}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-[#E0D7C6] dark:border-zinc-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button 
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                </div>
              </div>

              {/* VIEW 1: Traditional Reports Performance View */}
              {reportTab === 'reports' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">GROSS REVENUE</span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">$0.00</div>
                      <span className="text-[11px] text-slate-400 font-semibold">0 completed orders</span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">TOTAL ORDERS</span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">0</div>
                      <span className="text-[11px] text-slate-400 font-semibold">Successful completions</span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">ITEMS SOLD</span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">0</div>
                      <span className="text-[11px] text-slate-400 font-semibold">Across all categories</span>
                    </div>
                  </div>

                  {/* Product Performance Table */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Product Performance
                    </h4>

                    <div className="py-12 text-center text-slate-400 dark:text-zinc-500 text-xs">
                      No sales records for this period. Completed customer and POS orders will appear here.
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW 2: Interactive August 2026 Monthly Calendar View */}
              {reportTab === 'calendar' && (
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-6 animate-fade-in">
                  
                  {/* Calendar Top Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                      <CalendarIcon className="w-5 h-5 text-blue-500" />
                      <span>August 2026</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-bold">
                        <option value="monthly">Monthly View</option>
                        <option value="weekly">Weekly View</option>
                      </select>

                      <button
                        onClick={() => setSelectedCalendarDate(23)}
                        className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold hover:bg-slate-50"
                      >
                        Today
                      </button>

                      <div className="flex items-center border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-800">
                        <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-700"><ChevronLeft className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-700"><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>

                  {/* 7-Column Day Header */}
                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase text-slate-400">
                    <div>SUN</div>
                    <div>MON</div>
                    <div>TUE</div>
                    <div>WED</div>
                    <div>THU</div>
                    <div>FRI</div>
                    <div>SAT</div>
                  </div>

                  {/* Calendar Cells Grid */}
                  <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    
                    {/* Empty cell for Saturday start (August 1, 2026 is Saturday) */}
                    <div className="h-20 sm:h-24 rounded-2xl bg-slate-50/30 dark:bg-zinc-800/20 border border-transparent"></div>
                    <div className="h-20 sm:h-24 rounded-2xl bg-slate-50/30 dark:bg-zinc-800/20 border border-transparent"></div>
                    <div className="h-20 sm:h-24 rounded-2xl bg-slate-50/30 dark:bg-zinc-800/20 border border-transparent"></div>
                    <div className="h-20 sm:h-24 rounded-2xl bg-slate-50/30 dark:bg-zinc-800/20 border border-transparent"></div>
                    <div className="h-20 sm:h-24 rounded-2xl bg-slate-50/30 dark:bg-zinc-800/20 border border-transparent"></div>
                    <div className="h-20 sm:h-24 rounded-2xl bg-slate-50/30 dark:bg-zinc-800/20 border border-transparent"></div>
                    
                    {/* Day 1 */}
                    <div className="h-20 sm:h-24 p-2 rounded-2xl border border-slate-200/60 dark:border-zinc-800 bg-[#FAF7F2]/40 dark:bg-zinc-800/30 text-xs font-bold text-slate-500">
                      1
                    </div>

                    {/* Days 2 to 31 */}
                    {Array.from({ length: 30 }, (_, i) => i + 2).map((day) => {
                      const isToday = day === 23;
                      const isSelected = selectedCalendarDate === day;

                      return (
                        <div
                          key={day}
                          onClick={() => setSelectedCalendarDate(day)}
                          className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isToday
                              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                              : isSelected
                              ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30'
                              : 'border-slate-200/60 dark:border-zinc-800 bg-[#FAF7F2]/40 dark:bg-zinc-800/30 hover:border-slate-300'
                          }`}
                        >
                          <span className={`text-xs font-bold ${isToday ? 'text-emerald-700 dark:text-emerald-300 font-black' : 'text-slate-600 dark:text-zinc-400'}`}>
                            {day}
                          </span>

                          {isToday && (
                            <span className="inline-block text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 w-fit">
                              Today
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: POS REGISTER TERMINAL with "Clear All" Button */}
          {activeSection === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              
              {/* Left Product Menu Grid (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs flex items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search catalog..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs focus:outline-none"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-bold"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredProducts.map((p) => {
                    const imgUrl = p.croppedImageUrl || p.originalScreenshotUrl;
                    return (
                      <div
                        key={p.id}
                        onClick={() => addToPosCart(p)}
                        className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer group select-none flex flex-col justify-between"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-950 mb-2 flex items-center justify-center">
                          <img src={imgUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-black text-rose-600">${p.price.toFixed(2)}</span>
                            <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-bold">{p.brand}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Checkout Register Panel with "Clear All" Button */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs flex flex-col justify-between h-[650px]">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-900 dark:text-white">
                      <ShoppingCart className="w-4 h-4 text-blue-500" />
                      <span>Checkout Register</span>
                    </div>

                    {/* Clear All Button */}
                    {posCart.length > 0 && (
                      <button
                        onClick={clearPosCart}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors flex items-center gap-1"
                        title="Clear all items in cart"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>

                  {/* Cart Items List */}
                  <div className="py-4 space-y-3 max-h-[360px] overflow-y-auto no-scrollbar">
                    {posCart.length === 0 ? (
                      <div className="py-20 text-center text-slate-400 dark:text-zinc-500 text-xs">
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p>Terminal is Empty</p>
                        <p className="text-[10px]">Click items on the left to add to cart</p>
                      </div>
                    ) : (
                      posCart.map(item => (
                        <div key={item.product.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 text-xs">
                          <div className="flex-1 pr-2">
                            <p className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{item.product.name}</p>
                            <p className="text-[10px] text-slate-400">${item.product.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCartQty(item.product.id, -1)} className="w-6 h-6 rounded bg-slate-200 dark:bg-zinc-700 font-bold">-</button>
                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.product.id, 1)} className="w-6 h-6 rounded bg-slate-200 dark:bg-zinc-700 font-bold">+</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Bottom Checkout Actions */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Order Type</label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-bold"
                    >
                      <option value="TELEGRAM (Telegram Order)">TELEGRAM (Telegram Order)</option>
                      <option value="LIVE (Live Stream Unbox)">LIVE STREAM (Unbox on TikTok)</option>
                      <option value="PICKUP (Store Pickup)">STORE PICKUP</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 font-bold">Subtotal</span>
                    <span className="font-black text-slate-900 dark:text-white">${posSubtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm font-black pt-1">
                    <span>Total</span>
                    <span className="text-lg text-rose-600">${posSubtotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (posCart.length === 0) return;
                      alert(`Order processed successfully! Total: $${posSubtotal.toFixed(2)}`);
                      setPosCart([]);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[#5B7898] hover:bg-[#4d6682] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Place Order & Complete
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: CATALOG MANAGEMENT */}
          {activeSection === 'catalog' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Bar */}
              <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-medium"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-bold"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value as any)}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-bold"
                  >
                    <option value="all">All Status</option>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <div className="flex items-center border border-slate-200 dark:border-zinc-700 rounded-xl p-0.5 bg-slate-50 dark:bg-zinc-800">
                    <button
                      onClick={() => setViewLayout('grid')}
                      className={`p-1.5 rounded-lg ${viewLayout === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-slate-400'}`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewLayout('list')}
                      className={`p-1.5 rounded-lg ${viewLayout === 'list' ? 'bg-white dark:bg-zinc-700 shadow-xs' : 'text-slate-400'}`}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddNew}
                    className="py-2 px-4 rounded-xl bg-[#2B6CB0] hover:bg-[#23588f] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Product</span>
                  </button>
                </div>

              </div>

              {/* Grid Layout */}
              {viewLayout === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {filteredProducts.map((p) => {
                    const imgUrl = p.croppedImageUrl || p.originalScreenshotUrl;
                    const isActive = p.stockStatus === 'In Stock';
                    return (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/70 dark:border-zinc-800 shadow-xs flex flex-col justify-between group"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-950 mb-2.5">
                          <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-xs ${
                            isActive ? 'bg-[#00BA88]' : 'bg-rose-500'
                          }`}>
                            {isActive ? 'ACTIVE' : 'OUT'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-400 uppercase">{p.category.split(' ')[0]}</span>
                            <span className="font-black text-slate-900 dark:text-white text-xs">${p.price.toFixed(2)}</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200 line-clamp-1 uppercase">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-slate-400">Stock Count: 100 units</p>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-3 mt-1 border-t border-slate-100 dark:border-zinc-800">
                          <button
                            onClick={() => handleEdit(p)}
                            className="py-1 px-2 rounded-lg border border-slate-200 dark:border-zinc-700 text-[11px] font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 flex items-center justify-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setIsDeletingId(p.id)}
                            className="py-1 px-2 rounded-lg border border-rose-200 dark:border-rose-900/60 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                /* List Layout */
                <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase text-slate-400">
                        <th className="py-2.5 px-3">Item</th>
                        <th className="py-2.5 px-3">Brand</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                          <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white">{p.name}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-500">{p.brand}</td>
                          <td className="py-2.5 px-3">{p.category}</td>
                          <td className="py-2.5 px-3 font-black">${p.price.toFixed(2)}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600">
                              {p.stockStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button onClick={() => handleEdit(p)} className="p-1 text-blue-600 mr-2"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setIsDeletingId(p.id)} className="p-1 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: INVOICES & ORDERS */}
          {activeSection === 'invoices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
                    Invoice Ledger
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Browse completed receipts, print invoices, and monitor storefront revenue.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E0D7C6] bg-white dark:bg-zinc-800 text-xs"
                    />
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-[#E0D7C6] text-xs font-bold">
                    Refresh
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs overflow-x-auto">
                {invoices.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-slate-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">No invoices recorded yet</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Completed customer orders, Telegram checkouts, and POS sales receipts will be listed here.
                    </p>
                    <button
                      onClick={() => setActiveSection('pos')}
                      className="mt-2 px-4 py-2 rounded-xl bg-[#2B6CB0] text-white text-xs font-bold shadow-xs hover:bg-[#23588f]"
                    >
                      Open POS Register
                    </button>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase text-slate-400">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">INVOICE NO</th>
                        <th className="py-2.5 px-3">DATE</th>
                        <th className="py-2.5 px-3">CUSTOMER</th>
                        <th className="py-2.5 px-3">SALESMAN</th>
                        <th className="py-2.5 px-3">GRAND TOTAL</th>
                        <th className="py-2.5 px-3">REMAINING</th>
                        <th className="py-2.5 px-3">STATUS</th>
                        <th className="py-2.5 px-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {invoices.map((inv, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                          <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">{inv.no}</td>
                          <td className="py-3 px-3 text-slate-500">{inv.date}</td>
                          <td className="py-3 px-3 font-bold">{inv.customer}</td>
                          <td className="py-3 px-3 text-slate-400">{inv.salesman}</td>
                          <td className="py-3 px-3 font-black">{inv.total}</td>
                          <td className="py-3 px-3 text-slate-400">—</td>
                          <td className="py-3 px-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-blue-600 mr-1.5 hover:bg-slate-50">View</button>
                            <button className="px-2.5 py-1 rounded-lg border border-rose-200 text-[11px] font-bold text-rose-600 hover:bg-rose-50">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: PROMOTIONS MANAGER */}
          {activeSection === 'promotions' && (
            <div className="space-y-6 animate-fade-in max-w-5xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                    Promotions Manager
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    Manage the promotional banners that appear at the top of your shop.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingPromo({
                      id: '',
                      title: 'New Featured Blind Box Drop',
                      subtitle: 'Photo-only Banner',
                      img: '/banner_classybling_babythree.png'
                    });
                    setIsPromoModalOpen(true);
                  }}
                  className="py-2.5 px-5 rounded-2xl bg-[#2B6CB0] hover:bg-[#23588f] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add Promo</span>
                </button>
              </div>

              {/* Quick Top Announcement Banner Control Card in Promotions Tab */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 dark:from-pink-500/20 dark:via-rose-500/15 dark:to-amber-500/15 border border-pink-200/80 dark:border-pink-900/40 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white font-display">
                          Top Announcement & Message Section
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          settings.showAnnouncement !== false
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700'
                        }`}>
                          {settings.showAnnouncement !== false ? '🟢 Active & Visible' : '⚪ Hidden / OFF'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Displays right above the carousel slides on the homepage. Turn ON/OFF with 1 click.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleToggleAnnouncement}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        settings.showAnnouncement !== false
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600'
                      }`}
                    >
                      {settings.showAnnouncement !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Turn OFF Banner</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Turn ON Banner</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('settings')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-xs font-extrabold text-slate-700 dark:text-zinc-300 cursor-pointer"
                    >
                      Edit Text in Settings &gt;
                    </button>
                  </div>
                </div>

                {settings.showAnnouncement !== false && (settings.announcementText || '').trim() && (
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-pink-200/60 dark:border-pink-900/30 text-xs font-medium text-slate-800 dark:text-zinc-200 line-clamp-2">
                    "{settings.announcementText}"
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/70 dark:border-zinc-800 shadow-xs space-y-4">
                {promotions.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    No promotional banners found. Click "+ Add Promo" to create one.
                  </div>
                ) : (
                  promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="p-3 sm:p-4 rounded-2xl border border-[#E0D7C6]/80 dark:border-zinc-800 bg-[#FAF7F2]/50 dark:bg-zinc-800/30 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#D0C4AF] transition-all"
                    >
                      <div className="w-full sm:w-56 aspect-[21/9] rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 shrink-0 border border-slate-200/80 dark:border-zinc-700 shadow-2xs">
                        <img src={promo.img} alt={promo.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {promo.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">
                          {promo.subtitle || 'Photo-only Banner'}
                        </p>
                      </div>

                      <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-28">
                        <button
                          onClick={() => {
                            setEditingPromo({ ...promo });
                            setIsPromoModalOpen(true);
                          }}
                          className="flex-1 sm:w-full py-1.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 text-xs font-extrabold text-slate-800 dark:text-zinc-200 transition-colors shadow-2xs text-center"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setPromotions(prev => prev.filter(p => p.id !== promo.id));
                          }}
                          className="flex-1 sm:w-full py-1.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 hover:bg-rose-100 dark:bg-rose-950/40 text-xs font-extrabold text-rose-600 dark:text-rose-400 transition-colors shadow-2xs text-center"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 7: STOREFRONT & LOCATION SETTINGS with Social Media & Map Pin Editor */}
          {activeSection === 'settings' && (
            <div className="max-w-4xl space-y-6 animate-fade-in">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                    Storefront, Location & Social Settings
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    Configure physical store address, Google Maps pin, Telegram hotline, and social channels.
                  </p>
                </div>

                {settingsSavedToast && (
                  <div className="px-4 py-2 rounded-2xl bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Settings Saved Successfully!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* 1. Top Announcement & Homepage Text Section (Turn ON / OFF + Custom Text Editor) */}
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 dark:text-white font-display">
                            Homepage Announcement & Text Section
                          </h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            settings.showAnnouncement !== false
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700'
                          }`}>
                            {settings.showAnnouncement !== false ? '🟢 Active & Visible' : '⚪ Turned OFF / Hidden'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Edit the text message and turn ON/OFF anytime without re-pushing code.
                        </p>
                      </div>
                    </div>

                    {/* Master Turn ON / OFF Switch */}
                    <button
                      type="button"
                      onClick={handleToggleAnnouncement}
                      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all shadow-xs cursor-pointer ${
                        settings.showAnnouncement !== false
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20 active:scale-95'
                          : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-700 active:scale-95'
                      }`}
                    >
                      {settings.showAnnouncement !== false ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Turned ON (Click to Hide)</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Turned OFF (Click to Show)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Textarea for Announcement Text */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block uppercase text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                        Custom Announcement / Notice Text
                      </label>
                      <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                        {(settings.announcementText || '').length} characters
                      </span>
                    </div>

                    <textarea
                      rows={3}
                      value={settings.announcementText ?? ''}
                      onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                      placeholder="Type any message, store announcement, free offer, flash sale, live schedule..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all leading-relaxed"
                    />
                  </div>

                  {/* Preset Template Chips */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 block mb-1.5">
                      Quick Preset Templates (Click to apply):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        {
                          label: '💬 Friend / Free Gift Note',
                          text: 'Hey , if you seeing this , i just want to let you use this for free , i hope you interest but you dont seem to interest so i just dont want to rush , the fact is just we can work it and complete the product. well i guess thats it . Doing this as a friend to help in needed. :)'
                        },
                        {
                          label: '🔥 TikTok Live Special Drops',
                          text: '🔥 Catch our daily TikTok Live shows @classy.bling for live unboxings, secret chase drops, and exclusive free mystery gifts with every order! ✨'
                        },
                        {
                          label: '🚚 Nationwide Fast Delivery',
                          text: '🚚 Fast nationwide delivery across Phnom Penh & all Cambodia provinces! Order directly on Telegram @classybling_order (Hotline: 092917831).'
                        },
                        {
                          label: '✨ New Pop Mart Blind Boxes',
                          text: '✨ NEW ARRIVALS: 100% Authentic Pop Mart Labubu, Baby Three Zodiac, Nommi, and Mega Space Molly collections now in stock!'
                        },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSettings(prev => ({ ...prev, announcementText: preset.text, showAnnouncement: true }))}
                          className="py-1 px-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:border-pink-300 dark:hover:border-pink-800 transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Homepage Banner Preview */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">
                      Live Customer Homepage Preview:
                    </span>
                    {settings.showAnnouncement !== false && (settings.announcementText || '').trim() ? (
                      <div className="px-4 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 dark:from-pink-500/20 dark:via-rose-500/15 dark:to-amber-500/15 border border-pink-200/80 dark:border-pink-900/40 text-center shadow-xs">
                        <p className="font-display text-xs sm:text-sm md:text-base font-medium text-slate-800 dark:text-zinc-100 leading-relaxed whitespace-pre-line max-w-3xl mx-auto">
                          {settings.announcementText}
                        </p>
                      </div>
                    ) : (
                      <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-800/50 border border-dashed border-slate-300 dark:border-zinc-700 text-center text-slate-400 dark:text-zinc-500 text-xs italic">
                        {settings.showAnnouncement === false
                          ? '⚪ Text section is currently turned OFF. Customers will not see any message banner.'
                          : '⚠️ Announcement text is empty. Enter text above to display the banner.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Shop Owner Profile & Store Identity */}
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3">
                    <User className="w-4 h-4 text-amber-500" />
                    <span>Shop Owner Profile & Store Identity</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700 dark:text-zinc-300">
                    <div>
                      <label className="block uppercase text-[10px] text-slate-400 mb-1">
                        <span className="text-rose-500 mr-0.5">*</span>Shop Owner Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.ownerName}
                        onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                        placeholder="e.g. Xiao yi or Owner Name"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-[10px] text-slate-400 mb-1">Owner Title / Role</label>
                      <input
                        type="text"
                        value={settings.ownerRole}
                        onChange={(e) => setSettings({ ...settings, ownerRole: e.target.value })}
                        placeholder="e.g. SHOP_OWNER, Store Director"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-[10px] text-slate-400 mb-1">
                        <span className="text-rose-500 mr-0.5">*</span>Store Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-extrabold"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-[10px] text-slate-400 mb-1">Tagline / Slogan</label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Physical Location & Map Pin Picker with Locate Me */}
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-900 dark:text-white">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>Location & Google Maps Pin</span>
                    </div>

                    {/* Locate Me Button */}
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      disabled={isLocating}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
                    >
                      <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Detecting GPS Location...' : '📍 Locate Me (Use GPS)'}</span>
                    </button>
                  </div>

                  {/* Location Search Bar & Geocoder */}
                  <div className="space-y-2">
                    <label className="block uppercase text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                      Search Any Address, Mall, or Landmark
                    </label>
                    <div className="relative">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={locationSearchQuery}
                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchLocation();
                              }
                            }}
                            placeholder="Type an address, street, or landmark (e.g. Aeon Mall, BKK1, Street 271, Toul Tom Poung)..."
                            className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          {locationSearchQuery && (
                            <button
                              type="button"
                              onClick={() => {
                                setLocationSearchQuery('');
                                setLocationSearchResults([]);
                              }}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSearchLocation()}
                          disabled={isSearchingLocation || !locationSearchQuery.trim()}
                          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          <Search className={`w-3.5 h-3.5 ${isSearchingLocation ? 'animate-spin' : ''}`} />
                          <span>{isSearchingLocation ? 'Searching...' : 'Search'}</span>
                        </button>
                      </div>

                      {/* Dropdown of Search Results */}
                      {locationSearchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800 animate-fade-in max-h-64 overflow-y-auto">
                          <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/80 text-[10px] font-bold uppercase text-slate-500 dark:text-zinc-400 flex items-center justify-between">
                            <span>Found Locations ({locationSearchResults.length})</span>
                            <button
                              type="button"
                              onClick={() => setLocationSearchResults([])}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              Close
                            </button>
                          </div>
                          {locationSearchResults.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectSearchResult(item)}
                              className="w-full p-3 text-left hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-start gap-2.5 transition-colors cursor-pointer"
                            >
                              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                  {item.display_name.split(',')[0]}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                  {item.display_name}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Map Display */}
                  <div className="space-y-2">
                    <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 shadow-inner">
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.008}%2C${latitude - 0.006}%2C${longitude + 0.008}%2C${latitude + 0.006}&layer=mapnik&marker=${latitude}%2C${longitude}`}
                        className="w-full h-full border-0"
                        title="Store Location Map Pin"
                      />
                      <div className="absolute top-2 right-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-slate-200 dark:border-zinc-700 text-[11px] font-bold text-slate-700 dark:text-zinc-200 shadow-xs">
                        📍 Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  {/* Quick Preset Location Chips */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 block mb-2">
                      Select Popular Area Pin:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Classy Bling Flagship Showroom', lat: 11.523898, lng: 104.8247774, label: '✨ Official Classy Bling Showroom', addr: 'Classy Bling, Khan Por Senchey / Chom Chao, Phnom Penh, Cambodia' },
                        { name: 'Classy Bling BKK1', lat: 11.5516, lng: 104.9255, label: '🏢 BKK 1 (Boeung Keng Kang)', addr: 'Street 51 corner Street 302, Sangkat Boeung Keng Kang 1, Khan BKK, Phnom Penh' },
                        { name: 'Classy Bling Aeon 1', lat: 11.5484, lng: 104.9351, label: '🏬 Samdach Sothearos (Aeon 1)', addr: 'Samdach Sothearos Blvd, Sangkat Tonle Bassac, Khan Chamkarmon, Phnom Penh' },
                        { name: 'Classy Bling Tuol Kork', lat: 11.5794, lng: 104.8966, label: '🛍️ Tuol Kork (Street 289)', addr: 'Street 289, Sangkat Boeung Kak 1, Khan Tuol Kork, Phnom Penh' },
                        { name: 'Classy Bling Diamond Island', lat: 11.5492, lng: 104.9452, label: '💎 Koh Pich (Diamond Island)', addr: 'Koh Pich City, Sangkat Tonle Bassac, Khan Chamkarmon, Phnom Penh' },
                        { name: 'Classy Bling Riverside', lat: 11.5684, lng: 104.9304, label: '🚢 Riverside (Sisowath Quay)', addr: 'Sisowath Quay, Sangkat Chey Chumneas, Khan Daun Penh, Phnom Penh' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPresetLocation(item.name, item.lat, item.lng, item.addr)}
                          className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-[11px] font-bold text-slate-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-zinc-300 pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <div>
                      <label className="block uppercase text-[10px] text-slate-400 mb-1">Location Name / Showroom</label>
                      <input
                        type="text"
                        value={settings.locationName}
                        onChange={(e) => setSettings({ ...settings, locationName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-[10px] text-slate-400 mb-1">Full Physical Address</label>
                      <textarea
                        rows={2}
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        placeholder="Street, Sangkat, Khan, City, Country"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase text-[10px] text-slate-400 mb-1">Latitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={latitude}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setLatitude(val);
                            setSettings(prev => ({
                              ...prev,
                              googleMapsUrl: `https://maps.google.com/?q=${val},${longitude}`
                            }));
                          }}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block uppercase text-[10px] text-slate-400 mb-1">Longitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={longitude}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setLongitude(val);
                            setSettings(prev => ({
                              ...prev,
                              googleMapsUrl: `https://maps.google.com/?q=${latitude},${val}`
                            }));
                          }}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="uppercase text-[10px] text-slate-400">Google Maps Pin URL</label>
                        {settings.googleMapsUrl && (
                          <a
                            href={settings.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold"
                          >
                            <span>Test Pin Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input
                        type="text"
                        value={settings.googleMapsUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          const parsed = parseGoogleMapsCoords(val);
                          if (parsed) {
                            setLatitude(parsed.lat);
                            setLongitude(parsed.lng);
                          }
                          setSettings(prev => ({ ...prev, googleMapsUrl: val }));
                        }}
                        placeholder="Paste Google Maps link or coordinates (e.g. 11.5368, 104.9124)"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Social Media & Customer Ordering Channels */}
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#E0D7C6]/60 dark:border-zinc-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3">
                    <Share2 className="w-4 h-4 text-purple-500" />
                    <span>Social Media & Contact Ordering Channels</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700 dark:text-zinc-300">
                    
                    {/* Telegram */}
                    <div>
                      <label className="block uppercase text-[10px] text-[#229ED9] mb-1">Telegram Phone Number</label>
                      <input
                        type="text"
                        value={settings.telegramPhone}
                        onChange={(e) => setSettings({ ...settings, telegramPhone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-[10px] text-[#229ED9] mb-1">Telegram Direct Chat URL</label>
                      <input
                        type="text"
                        value={settings.telegramUrl}
                        onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-mono text-xs"
                      />
                    </div>

                    {/* TikTok */}
                    <div>
                      <label className="flex items-center gap-1.5 uppercase text-[10px] text-[#FE2C55] mb-1 font-bold">
                        <TikTokIcon className="w-3.5 h-3.5" />
                        <span>TikTok Handle</span>
                      </label>
                      <input
                        type="text"
                        value={settings.tiktokHandle}
                        onChange={(e) => setSettings({ ...settings, tiktokHandle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 uppercase text-[10px] text-[#FE2C55] mb-1 font-bold">
                        <TikTokIcon className="w-3.5 h-3.5" />
                        <span>TikTok Profile URL</span>
                      </label>
                      <input
                        type="text"
                        value={settings.tiktokUrl}
                        onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-mono text-xs"
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label className="block uppercase text-[10px] text-blue-600 mb-1">Facebook Page Name</label>
                      <input
                        type="text"
                        value={settings.facebookName}
                        onChange={(e) => setSettings({ ...settings, facebookName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-[10px] text-blue-600 mb-1">Facebook Page URL</label>
                      <input
                        type="text"
                        value={settings.facebookUrl}
                        onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-mono text-xs"
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="block uppercase text-[10px] text-pink-600 mb-1">Instagram Handle</label>
                      <input
                        type="text"
                        value={settings.instagramHandle}
                        onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-[10px] text-pink-600 mb-1">Instagram Profile URL</label>
                      <input
                        type="text"
                        value={settings.instagramUrl}
                        onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-mono text-xs"
                      />
                    </div>

                    {/* Currency Rate */}
                    <div className="sm:col-span-2">
                      <label className="block uppercase text-[10px] text-amber-500 mb-1">USD to KHR Conversion Rate</label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">$1.00 USD =</span>
                        <input
                          type="number"
                          value={settings.khrRate}
                          onChange={(e) => setSettings({ ...settings, khrRate: parseInt(e.target.value) || 4100 })}
                          className="w-32 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 font-black text-sm"
                        />
                        <span className="text-xs font-bold">KHR (៛)</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl bg-[#2B6CB0] hover:bg-[#23588f] text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Store Settings</span>
                  </button>
                </div>

              </form>

            </div>
          )}

        </main>

      </div>

      {/* Add / Edit Product Drawer Modal */}
      {isEditorOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                  {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Fill in product details, pricing, and 3D box visual.
                </p>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Baby Three Zodiac Series - Vinyl Plush Blind Box"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs sm:text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    placeholder="e.g. Pop Mart, Baby Three, Nommi"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs sm:text-sm font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category || 'Plush Dolls'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs sm:text-sm font-semibold focus:outline-none"
                  >
                    <option value="Plush Dolls">Plush Dolls</option>
                    <option value="Blind Box">Blind Box</option>
                    <option value="Action Figures">Action Figures</option>
                    <option value="Designer Toys">Designer Toys</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs sm:text-sm font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Stock Availability
                  </label>
                  <select
                    value={editingProduct.stockStatus || 'In Stock'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockStatus: e.target.value as StockStatus })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs sm:text-sm font-semibold focus:outline-none"
                  >
                    <option value="In Stock">In Stock (Available Now)</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Pre-order">Pre-order</option>
                  </select>
                </div>
              </div>

              {/* Product Image: File Upload Input & 3D Presets */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  Product Image *
                </label>

                {/* Main File Upload Dropzone / Button */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60 hover:border-blue-500 transition-all">
                  
                  {/* Visual Preview Box */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shrink-0 flex items-center justify-center shadow-xs">
                    {editingProduct.croppedImageUrl ? (
                      <img src={editingProduct.croppedImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  {/* File Upload Action */}
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <label
                      htmlFor="product-image-file-input"
                      className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#2B6CB0] hover:bg-[#23588f] text-white font-extrabold text-xs cursor-pointer shadow-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose / Upload Image File</span>
                    </label>
                    <input
                      type="file"
                      id="product-image-file-input"
                      accept="image/*"
                      onChange={handleProductFileUpload}
                      className="hidden"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Upload from phone or computer (PNG, JPG, WEBP)
                    </p>
                  </div>
                </div>

                {/* 3D Studio Packaging Presets */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 block mb-1.5">
                    Or select from 3D studio packaging presets:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
                    {boxPresets.map((box, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEditingProduct({
                          ...editingProduct,
                          croppedImageUrl: box.url,
                          originalScreenshotUrl: box.url
                        })}
                        className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                          editingProduct.croppedImageUrl === box.url
                            ? 'border-2 border-blue-500 ring-2 ring-blue-500/20 scale-105'
                            : 'border-slate-200 dark:border-zinc-700 opacity-60 hover:opacity-100'
                        }`}
                        title={box.label}
                      >
                        <img src={box.url} alt={box.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Description / Collector Notes
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Collector features, material info, secret chase rates..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 font-bold text-xs hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Confirm Delete Product?
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              This action will permanently remove this item from your catalog database and customer store.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeletingId(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promo Add/Edit Modal */}
      {isPromoModalOpen && editingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <h4 className="text-lg font-black text-slate-900 dark:text-white font-display">
                {editingPromo.id ? 'Edit Promotional Banner' : 'Add New Promotional Banner'}
              </h4>
              <button
                onClick={() => setIsPromoModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingPromo.id) {
                  setPromotions(prev => prev.map(p => p.id === editingPromo.id ? editingPromo : p));
                } else {
                  setPromotions(prev => [
                    ...prev,
                    {
                      ...editingPromo,
                      id: `promo-${Date.now()}`
                    }
                  ]);
                }
                setIsPromoModalOpen(false);
              }}
              className="space-y-4 text-xs font-bold"
            >
              <div>
                <label className="block uppercase text-slate-400 mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={editingPromo.title}
                  onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                  placeholder="e.g. Baby Three Zodiac Special Drop"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-400 mb-1">Banner Tag / Subtitle</label>
                <input
                  type="text"
                  value={editingPromo.subtitle}
                  onChange={(e) => setEditingPromo({ ...editingPromo, subtitle: e.target.value })}
                  placeholder="e.g. Photo-only Banner or Limited 2026 Edition"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800"
                />
              </div>

              {/* Banner Image File Upload & Presets */}
              <div className="space-y-3">
                <label className="block uppercase text-slate-400 mb-1">Banner Image *</label>

                {/* Banner File Upload Dropzone */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60 hover:border-blue-500 transition-all">
                  
                  {/* Banner Preview */}
                  <div className="w-full sm:w-40 aspect-[21/9] rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shrink-0 flex items-center justify-center shadow-xs">
                    {editingPromo.img ? (
                      <img src={editingPromo.img} alt="Banner Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  {/* File Upload Action */}
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <label
                      htmlFor="promo-image-file-input"
                      className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#2B6CB0] hover:bg-[#23588f] text-white font-extrabold text-xs cursor-pointer shadow-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose / Upload Banner File</span>
                    </label>
                    <input
                      type="file"
                      id="promo-image-file-input"
                      accept="image/*"
                      onChange={handlePromoFileUpload}
                      className="hidden"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Widescreen banner (PNG, JPG, WEBP)
                    </p>
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    Or select from presets:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Baby Three', url: '/banner_classybling_babythree.png' },
                      { label: 'Nommi Pink', url: '/banner_classybling_nommi.png' },
                      { label: 'Space Molly', url: '/banner_classybling_spacemolly.png' },
                    ].map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEditingPromo({ ...editingPromo, img: preset.url })}
                        className={`aspect-[21/9] rounded-lg overflow-hidden border transition-all ${
                          editingPromo.img === preset.url ? 'border-2 border-blue-500 ring-2 ring-blue-500/20 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2B6CB0] hover:bg-[#23588f] text-white font-extrabold shadow-sm"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
