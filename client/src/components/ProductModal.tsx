import React, { useState } from 'react';
import { Product } from '../types';
import { 
  XLg, 
  Send, 
  Heart, 
  HeartFill,
  Share, 
  CheckLg,
  ShieldCheck,
  BoxArrowUpRight,
  ChevronDown,
  ChevronUp
} from 'react-bootstrap-icons';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onUpdate?: (id: string, updates: Partial<Product>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(true);

  if (!product) return null;

  const mainImage = product.croppedImageUrl || product.originalScreenshotUrl;
  
  // Gallery images array
  const galleryImages = [
    mainImage,
    product.originalScreenshotUrl,
  ].filter(Boolean);

  const currentImage = galleryImages[selectedImageIndex] || mainImage;
  const unitPrice = product.price;

  const telegramOrderUrl = `https://t.me/+85592917831?text=${encodeURIComponent(
    `Hello Classy Bling! I would like to inquire about:\nProduct: ${product.name}\nPrice: $${unitPrice.toFixed(2)} USD\nSeries: ${product.series || product.brand}\n\nPlease confirm availability and payment options. Thank you!`
  )}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-[#FBFBFA] dark:bg-[#18181B] rounded-2xl shadow-xl border border-[#EAE7E1] dark:border-[#2C2C30] transition-all no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-lg text-[#71717A] hover:text-[#1A1A1A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#202024] transition-colors"
          aria-label="Close modal"
        >
          <XLg className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left: Product Image Showcase */}
          <div className="md:col-span-6 bg-[#F5F3EF] dark:bg-[#202024] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EAE7E1] dark:border-[#2C2C30]">
            
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] flex items-center justify-center p-4">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 justify-center pt-4">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-[#18181B] p-1 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-2 border-[#C25E3E]'
                        : 'border border-[#EAE7E1] dark:border-[#2C2C30] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right: Ordered Details (Image → Name → Collection → Price/status → Description → Details) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5 overflow-y-auto">
            
            <div className="space-y-4 text-left">
              
              {/* Collection / Series Breadcrumb */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#8C7E72] dark:text-[#A1A1AA] uppercase tracking-wider">
                  {product.brand} · {product.series || 'Designer Series'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-1.5 rounded-md hover:bg-[#F5F3EF] dark:hover:bg-[#202024] text-[#71717A] hover:text-[#C25E3E] transition-colors"
                    aria-label="Wishlist"
                  >
                    {isFavorite ? (
                      <HeartFill className="w-3.5 h-3.5 text-[#C25E3E]" />
                    ) : (
                      <Heart className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-md hover:bg-[#F5F3EF] dark:hover:bg-[#202024] text-[#71717A] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] transition-colors"
                    aria-label="Share"
                  >
                    {copied ? <CheckLg className="w-3.5 h-3.5 text-emerald-600" /> : <Share className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 1. Name */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5] leading-snug">
                {product.name}
              </h2>

              {/* 2. Price & Status */}
              <div className="flex items-center justify-between py-2 border-y border-[#EAE7E1] dark:border-[#2C2C30]">
                <div>
                  <div className="text-2xl font-extrabold text-[#1A1A1A] dark:text-[#F4F4F5]">
                    ${unitPrice.toFixed(2)} <span className="text-xs font-medium text-[#71717A]">USD</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F5F3EF] dark:bg-[#202024] text-xs font-semibold text-[#1A1A1A] dark:text-[#F4F4F5]">
                  <span className={`w-2 h-2 rounded-full ${product.stockStatus === 'In Stock' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{product.stockStatus || 'In Stock'}</span>
                </div>
              </div>

              {/* 3. Description */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F4F4F5] block">
                  Description
                </span>
                <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  {product.description || `${product.name} authentic designer collectible toy.`}
                </p>
              </div>

              {/* 4. Collector Specifications & Details */}
              <div className="border border-[#EAE7E1] dark:border-[#2C2C30] rounded-xl overflow-hidden bg-white dark:bg-[#202024]">
                <button
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-[#1A1A1A] dark:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#2A2A2E] transition-colors cursor-pointer"
                >
                  <span>Collector Specifications</span>
                  {specsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {specsOpen && (
                  <div className="px-4 pb-3 pt-1 border-t border-[#EAE7E1] dark:border-[#2C2C30] text-xs space-y-2">
                    <div className="flex justify-between py-1 border-b border-[#F5F3EF] dark:border-[#2C2C30]">
                      <span className="text-[#71717A] dark:text-[#A1A1AA]">Brand</span>
                      <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F4F5]">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F5F3EF] dark:border-[#2C2C30]">
                      <span className="text-[#71717A] dark:text-[#A1A1AA]">Category</span>
                      <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F4F5]">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F5F3EF] dark:border-[#2C2C30]">
                      <span className="text-[#71717A] dark:text-[#A1A1AA]">Authenticity</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        100% Sealed Factory Guarantee
                      </span>
                    </div>
                    {product.tiktokVideoUrl && (
                      <div className="flex justify-between py-1">
                        <span className="text-[#71717A] dark:text-[#A1A1AA]">TikTok Live Source</span>
                        <a
                          href={product.tiktokVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#C25E3E] hover:underline flex items-center gap-1"
                        >
                          <span>Watch Unboxing</span>
                          <BoxArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Direct Order Button */}
            <div className="pt-2">
              <a
                href={telegramOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-lg bg-[#C25E3E] hover:bg-[#A94F32] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Order via Telegram (@classy.bling)</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
