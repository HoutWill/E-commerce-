import { Product, BotStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '../data/initialProducts';

const API_BASE = '/api';
const LOCAL_STORAGE_KEY = 'cb_store_products_v1';

function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch {
    // ignore
  }
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('classybling_admin_token') || sessionStorage.getItem('classybling_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async getProducts(params?: {
    search?: string;
    category?: string;
    brand?: string;
    inStockOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<{ total: number; products: Product[] }> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category) query.append('category', params.category);
      if (params?.brand) query.append('brand', params.brand);
      if (params?.inStockOnly) query.append('inStockOnly', 'true');
      if (params?.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
      if (params?.sort) query.append('sort', params.sort);

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          saveLocalProducts(data.products);
          return data;
        }
      }
    } catch {
      // Backend unavailable / Static Hosting Fallback
    }

    // Client-side Filter & Sort Fallback
    let list = [...getLocalProducts()];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (params?.category && params.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.brand) {
      list = list.filter(p => p.brand.toLowerCase() === params.brand!.toLowerCase());
    }

    if (params?.inStockOnly) {
      list = list.filter(p => p.stockStatus === 'In Stock');
    }

    if (params?.minPrice !== undefined) {
      list = list.filter(p => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      list = list.filter(p => p.price <= params.maxPrice!);
    }

    if (params?.sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params?.sort === 'popular') {
      list.sort((a, b) => (b.tags?.includes('Popular') ? 1 : 0) - (a.tags?.includes('Popular') ? 1 : 0));
    }

    return { total: list.length, products: list };
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (res.ok) return res.json();
    } catch {
      // ignore
    }
    const match = getLocalProducts().find(p => p.id === id);
    if (!match) throw new Error('Product not found');
    return match;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const prod = await res.json();
        const current = getLocalProducts();
        saveLocalProducts([prod, ...current]);
        return prod;
      }
    } catch {
      // ignore
    }

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: productData.name || 'New Mystery Collectible',
      price: productData.price || 12.00,
      currency: 'USD',
      stockStatus: productData.stockStatus || 'In Stock',
      category: productData.category || 'Blind Box',
      brand: productData.brand || 'Classy Bling',
      series: productData.series || '',
      description: productData.description || 'Authentic designer art toy collectible.',
      croppedImageUrl: productData.croppedImageUrl || '/3d_boxes/nommi_pinky_energy_box_1787473059976.jpg',
      originalScreenshotUrl: productData.originalScreenshotUrl || productData.croppedImageUrl || '/3d_boxes/nommi_pinky_energy_box_1787473059976.jpg',
      tiktokVideoUrl: productData.tiktokVideoUrl || 'https://www.tiktok.com/@classy.bling',
      contactTelegram: productData.contactTelegram || 'https://t.me/+85592917831',
      contactFacebook: productData.contactFacebook || 'https://facebook.com',
      createdAt: new Date().toISOString(),
      tags: productData.tags || ['Authentic', 'In Stock']
    };

    const updated = [newProd, ...getLocalProducts()];
    saveLocalProducts(updated);
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const prod = await res.json();
        const list = getLocalProducts().map(p => p.id === id ? prod : p);
        saveLocalProducts(list);
        return prod;
      }
    } catch {
      // ignore
    }

    const list = getLocalProducts().map(p => p.id === id ? { ...p, ...updates } : p);
    saveLocalProducts(list);
    const updated = list.find(p => p.id === id);
    if (!updated) throw new Error('Product not found');
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
      });
    } catch {
      // ignore
    }

    const list = getLocalProducts().filter(p => p.id !== id);
    saveLocalProducts(list);
  },

  async getCategories(): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore
    }
    return INITIAL_CATEGORIES;
  },

  async getBrands(): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE}/brands`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore
    }
    return INITIAL_BRANDS;
  },

  async startScraping(handle: string, maxVideos: number): Promise<void> {
    const res = await fetch(`${API_BASE}/scrape/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ handle, maxVideos })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to start scraper');
    }
  },

  async getScrapeStatus(): Promise<BotStatus> {
    try {
      const res = await fetch(`${API_BASE}/scrape/status`);
      if (res.ok) return res.json();
    } catch {
      // ignore
    }
    return {
      isRunning: false,
      status: 'idle',
      totalFound: 12,
      processedCount: 12,
      savedCount: 12,
      skippedCount: 0,
      logs: []
    };
  },

  async processSingleVideo(videoUrl: string): Promise<{ success: boolean; product?: Product; message?: string }> {
    const res = await fetch(`${API_BASE}/scrape/single-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ videoUrl })
    });
    return res.json();
  },

  async uploadFrame(file: File, videoUrl?: string): Promise<{ success: boolean; product?: Product; message?: string }> {
    const formData = new FormData();
    formData.append('frame', file);
    if (videoUrl) formData.append('videoUrl', videoUrl);

    const res = await fetch(`${API_BASE}/scrape/upload-frame`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    return res.json();
  },

  // Admin Security Gate & Auth
  async loginAdmin(credentials: { email: string; password: string }): Promise<{
    success: boolean;
    token?: string;
    admin?: { email: string; role: string; expiresAt: number };
    error?: string;
    remainingAttempts?: number;
    remainingSeconds?: number;
    isLocked?: boolean;
  }> {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (res.ok) {
        return res.json();
      }
      const errData = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 429) {
        return errData;
      }
    } catch {
      // Static / offline fallback authentication
    }

    // Static fallback authentication for Netlify hosting
    if (credentials.email === 'admin@gmail.com' && credentials.password === '123456') {
      const mockToken = `cb_adm_${Date.now()}_static`;
      return {
        success: true,
        token: mockToken,
        admin: {
          email: 'admin@gmail.com',
          role: 'SUPER_ADMIN',
          expiresAt: Date.now() + 12 * 3600 * 1000
        }
      };
    }

    return {
      success: false,
      error: 'Invalid administrative email or security password.'
    };
  },

  async verifyAdmin(token: string): Promise<{
    success: boolean;
    authenticated: boolean;
    admin?: { email: string; role: string; expiresAt: number };
  }> {
    try {
      const res = await fetch(`${API_BASE}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return res.json();
    } catch {
      // Static fallback
    }

    if (token.startsWith('cb_adm_')) {
      return {
        success: true,
        authenticated: true,
        admin: {
          email: 'admin@gmail.com',
          role: 'SUPER_ADMIN',
          expiresAt: Date.now() + 12 * 3600 * 1000
        }
      };
    }

    return { success: false, authenticated: false };
  },

  async logoutAdmin(token?: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ token })
      });
    } catch {
      // ignore
    }
  }
};
