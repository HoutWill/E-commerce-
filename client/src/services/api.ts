import { Product, BotStatus } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('cb_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: globalThis.Response, defaultErrMsg: string): Promise<T> {
  if (res.status === 429) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Security Alert: IP Rate limit exceeded. Please wait a moment before trying again.');
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || defaultErrMsg);
  }

  return res.json();
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
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.brand) query.append('brand', params.brand);
    if (params?.inStockOnly) query.append('inStockOnly', 'true');
    if (params?.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
    if (params?.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return handleResponse<{ total: number; products: Product[] }>(res, 'Failed to fetch products');
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse<Product>(res, 'Failed to fetch product');
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(productData)
    });
    return handleResponse<Product>(res, 'Failed to create product');
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    return handleResponse<Product>(res, 'Failed to update product');
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<void>(res, 'Failed to delete product');
  },

  async getCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) return [];
    return res.json();
  },

  async getBrands(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/brands`);
    if (!res.ok) return [];
    return res.json();
  },

  async startScraping(handle: string, maxVideos: number): Promise<void> {
    const res = await fetch(`${API_BASE}/scrape/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ handle, maxVideos })
    });
    return handleResponse<void>(res, 'Failed to start scraper');
  },

  async getScrapeStatus(): Promise<BotStatus> {
    const res = await fetch(`${API_BASE}/scrape/status`);
    return handleResponse<BotStatus>(res, 'Failed to fetch scraper status');
  },

  async processSingleVideo(videoUrl: string): Promise<{ success: boolean; product?: Product; message?: string }> {
    const res = await fetch(`${API_BASE}/scrape/single-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ videoUrl })
    });
    return handleResponse<{ success: boolean; product?: Product; message?: string }>(res, 'Failed to process video');
  },

  async uploadFrame(file: File, videoUrl?: string): Promise<{ success: boolean; product?: Product; message?: string }> {
    const formData = new FormData();
    formData.append('frame', file);
    if (videoUrl) formData.append('videoUrl', videoUrl);

    const res = await fetch(`${API_BASE}/scrape/upload-frame`, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
      },
      body: formData
    });
    return handleResponse<{ success: boolean; product?: Product; message?: string }>(res, 'Failed to upload photo');
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
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
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
      return res.json();
    } catch {
      return { success: false, authenticated: false };
    }
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
