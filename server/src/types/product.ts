export type StockStatus = 'In Stock' | 'Out of Stock' | 'Pre-order' | 'Low Stock';

export interface BoundingBox {
  ymin: number; // 0.0 - 1.0 or pixel coordinate
  xmin: number; // 0.0 - 1.0
  ymax: number; // 0.0 - 1.0
  xmax: number; // 0.0 - 1.0
}

export interface ScrapedProduct {
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
  
  // Image paths
  originalScreenshotUrl: string;
  croppedImageUrl: string;
  boundingBox?: BoundingBox;
  
  // Source info
  tiktokVideoUrl?: string;
  tiktokPostId?: string;
  contactTelegram: string;
  contactFacebook: string;
  
  // Quality & Filter checks
  angleMatched: boolean; // True if it matches the product showcase format (hand holding box + price overlay)
  skippedReason?: string;
  confidence: number;
  
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

export interface ScrapingJobStatus {
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
