export type StockStatus = 'In Stock' | 'Out of Stock' | 'Pre-order' | 'Low Stock';

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  stockStatus: StockStatus;
  brand: string;
  series: string;
  category: string;
  subcategory?: string;
  tags: string[];
  description: string;
  originalScreenshotUrl: string;
  croppedImageUrl: string;
  boundingBox?: BoundingBox;
  tiktokVideoUrl?: string;
  tiktokPostId?: string;
  contactTelegram?: string;
  contactFacebook?: string;
  angleMatched?: boolean;
  confidence?: number;
  createdAt: string;
  updatedAt?: string;
  featured?: boolean;
}

export interface BotStatus {
  isRunning: boolean;
  status: 'idle' | 'running' | 'completed' | 'error';
  totalFound: number;
  processedCount: number;
  savedCount: number;
  skippedCount: number;
  currentVideoUrl?: string;
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'success' | 'error';
    message: string;
  }>;
}
