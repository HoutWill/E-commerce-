import fs from 'fs';
import path from 'path';
import { ScrapedProduct } from '../types/product';

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'products.json');

export class ProductDatabase {
  private products: ScrapedProduct[] = [];

  constructor() {
    this.ensureDataDir();
    this.load();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    const croppedDir = path.resolve(__dirname, '../../uploads/cropped');
    const originalsDir = path.resolve(__dirname, '../../uploads/originals');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    if (!fs.existsSync(croppedDir)) fs.mkdirSync(croppedDir, { recursive: true });
    if (!fs.existsSync(originalsDir)) fs.mkdirSync(originalsDir, { recursive: true });
  }

  private load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.products = JSON.parse(raw);
      } catch (err) {
        console.error('Error loading products.json:', err);
        this.products = [];
      }
    } else {
      this.products = [];
      this.save();
    }
  }

  private save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  public getAll(): ScrapedProduct[] {
    this.load();
    return [...this.products];
  }

  public getById(id: string): ScrapedProduct | undefined {
    return this.products.find(p => p.id === id);
  }

  public add(product: ScrapedProduct): ScrapedProduct {
    const existingIndex = this.products.findIndex(
      p => (p.tiktokPostId && p.tiktokPostId === product.tiktokPostId) || (p.name.toLowerCase() === product.name.toLowerCase())
    );

    if (existingIndex >= 0) {
      // Update existing
      this.products[existingIndex] = {
        ...this.products[existingIndex],
        ...product,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.products[existingIndex];
    } else {
      this.products.unshift(product);
      this.save();
      return product;
    }
  }

  public update(id: string, updates: Partial<ScrapedProduct>): ScrapedProduct | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.products[index];
  }

  public delete(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    if (this.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public getCategories(): string[] {
    const set = new Set<string>();
    for (const p of this.products) {
      if (p.category) set.add(p.category);
    }
    return Array.from(set);
  }

  public getBrands(): string[] {
    const set = new Set<string>();
    for (const p of this.products) {
      if (p.brand) set.add(p.brand);
    }
    return Array.from(set);
  }

  public getSettings(): any {
    const settingsFile = path.join(DATA_DIR, 'settings.json');
    if (fs.existsSync(settingsFile)) {
      try {
        const raw = fs.readFileSync(settingsFile, 'utf-8');
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error reading settings.json:', e);
      }
    }
    return {
      ownerName: 'Xiao yi',
      ownerRole: 'SHOP_OWNER',
      storeName: 'CLASSY BLING',
      tagline: 'Viral Blind Boxes & Luxury Plush Charms',
      locationName: 'Classy Bling Flagship Showroom',
      address: 'Street 271, Sangkat Phsar Doeum Thkov, Khan Chamkarmon, Phnom Penh, Cambodia',
      googleMapsUrl: 'https://maps.google.com/?q=11.5368,104.9124',
      telegramPhone: '092917831 (+85592917831)',
      telegramUsername: '@classybling_order',
      telegramUrl: 'https://t.me/+85592917831',
      tiktokHandle: '@classy.bling',
      tiktokUrl: 'https://www.tiktok.com/@classy.bling',
      facebookName: 'Classy Bling Cambodia',
      facebookUrl: 'https://facebook.com',
      instagramHandle: '@classybling.kh',
      instagramUrl: 'https://instagram.com',
      khrRate: 4100
    };
  }

  public updateSettings(updates: any): any {
    const settingsFile = path.join(DATA_DIR, 'settings.json');
    const current = this.getSettings();
    const merged = { ...current, ...updates };
    fs.writeFileSync(settingsFile, JSON.stringify(merged, null, 2), 'utf-8');
    return merged;
  }
}

export const db = new ProductDatabase();
