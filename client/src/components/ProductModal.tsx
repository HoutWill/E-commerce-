import React, { useState } from 'react';
import { Product } from '../types';
import { 
  X, 
  Send, 
  ChevronUp, 
  ChevronDown, 
  Truck, 
  Heart, 
  Share2, 
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

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
  const [quantity, setQuantity] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const mainImage = product.croppedImageUrl || product.originalScreenshotUrl;
  
  // Gallery images array (Main Box, Detail Angle, Original Box)
  const galleryImages = [
    mainImage,
    product.originalScreenshotUrl,
    mainImage,
  ];

  const currentImage = galleryImages[selectedImageIndex] || mainImage;
  const unitPrice = product.price;
  const totalPriceUSD = (unitPrice * quantity).toFixed(2);
  const totalPriceKHR = Math.round(Number(totalPriceUSD) * 4100).toLocaleString();

  const telegramOrderUrl = `https://t.me/+85592917831?text=${encodeURIComponent(
    `Hello Classy Bling! I would like to order on Telegram:\n\n📦 Product: ${product.name}\n🏷️ Brand: ${product.brand}\n🔢 Quantity: ${quantity} ${quantity > 1 ? 'Boxes' : 'Box'}\n💵 Total: $${totalPriceUSD} USD (${totalPriceKHR} ៛)\n\nPlease confirm stock availability and payment details. Thank you!`
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 transition-all no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white border border-slate-200 dark:border-zinc-700 shadow-md transition-all hover:scale-105 active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Image Showcase (7 cols on desktop) */}
          <div className="lg:col-span-7 bg-[#FAF7F2] dark:bg-zinc-900/50 p-4 sm:p-6 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-zinc-800">
            
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center lg:items-start">
              
              {/* Desktop Vertical Thumbnail Strip */}
              <div className="hidden lg:flex flex-col gap-2 shrink-0 select-none">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase text-center leading-tight">
                  Angles
                </span>
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-2 border-[#229ED9] shadow-md scale-105'
                        : 'border border-slate-200 dark:border-zinc-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Style ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Large Image Display */}
              <div className="relative w-full aspect-square max-h-[260px] sm:max-h-[380px] lg:max-h-none rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex items-center justify-center group shadow-sm">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Counter Badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                  {selectedImageIndex + 1} / {galleryImages.length}
                </div>
              </div>

              {/* Mobile Horizontal Thumbnail Strip */}
              <div className="flex lg:hidden gap-2 items-center justify-center pt-1 overflow-x-auto w-full no-scrollbar">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-2 border-[#229ED9] shadow-md scale-105'
                        : 'border border-slate-200 dark:border-zinc-700 opacity-70'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

            </div>

          </div>

          {/* Right Column: Clean Telegram Order & Product Details (5 cols on desktop) */}
          <div className="lg:col-span-5 p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-4 sm:space-y-6 overflow-y-auto no-scrollbar">
            
            {/* Header: Brand + Title + Action Icons */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-wider">
                  {product.brand || 'Classy Bling'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-rose-500 transition-colors"
                    aria-label="Save to favorites"
                  >
                    <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                    aria-label="Share product"
                  >
                    {copied ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Share2 className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-display leading-tight">
                {product.name}
              </h2>

              {/* Price Display */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#229ED9] dark:text-[#38bdf8]">
                    ${unitPrice.toFixed(2)} USD
                  </div>
                  <div className="text-xs font-black text-slate-600 dark:text-zinc-300">
                    {Math.round(unitPrice * 4100).toLocaleString()} ៛ KHR
                  </div>
                </div>
                <div className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Genuine</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Quantity (Boxes):
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="w-10 h-9 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 font-black text-base active:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-10 h-9 flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 font-black text-base active:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Telegram Order Button */}
            <div className="space-y-1.5 sm:space-y-2">
              <a
                href={telegramOrderUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#229ED9] hover:bg-[#1d8cc2] text-white font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all min-h-[48px]"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                <span>CHAT & ORDER ON TELEGRAM (${totalPriceUSD})</span>
              </a>
              <p className="text-[10px] sm:text-[11px] text-center text-slate-500 dark:text-zinc-400 font-medium">
                Telegram: 092917831 • Instant stock verification & express dispatch
              </p>
            </div>

            {/* Collapsible Accordion 1: Product Details */}
            <div className="border-t border-slate-200 dark:border-zinc-800 pt-3">
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full flex items-center justify-between text-xs font-black uppercase text-slate-900 dark:text-white py-1"
              >
                <span>Product Details</span>
                {isDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isDetailsOpen && (
                <div className="pt-2 text-xs text-slate-600 dark:text-zinc-400 space-y-1.5 leading-relaxed">
                  <p><strong>Brand:</strong> {product.brand || 'Classy Bling'}</p>
                  <p><strong>Series:</strong> {product.name}</p>
                  <p><strong>Category:</strong> {product.category || 'Blind Box'}</p>
                  <p><strong>Material:</strong> Premium PVC / Vinyl / Plush / ABS</p>
                  <p><strong>Foil Sealed:</strong> 100% Genuine Certified Factory Sealed</p>
                </div>
              )}
            </div>

            {/* Collapsible Accordion 2: Shipping & Policy */}
            <div className="border-t border-slate-200 dark:border-zinc-800 pt-3">
              <button
                onClick={() => setIsShippingOpen(!isShippingOpen)}
                className="w-full flex items-center justify-between text-xs font-black uppercase text-slate-900 dark:text-white py-1"
              >
                <span>Shipping & Authenticity Policy</span>
                {isShippingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isShippingOpen && (
                <div className="pt-2 text-xs text-slate-600 dark:text-zinc-400 space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Truck className="w-3.5 h-3.5 shrink-0" />
                    <span>Fast Express Dispatch with Protective Box Packaging</span>
                  </div>
                  <p>Every blind box is guaranteed 100% factory original, sealed in official foil bag, and inspected before courier dispatch.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
