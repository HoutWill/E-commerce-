import React, { useState, useEffect, useRef } from 'react';
import { BotStatus } from '../types';
import { api } from '../services/api';
import {
  X,
  Bot,
  Play,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Terminal,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Image as ImageIcon,
  Check,
  XCircle,
  FastForward,
  Loader2
} from 'lucide-react';

interface BotStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshProducts: () => void;
}

export const BotStudioModal: React.FC<BotStudioModalProps> = ({
  isOpen,
  onClose,
  onRefreshProducts
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'single' | 'upload'>('profile');
  const [handle, setHandle] = useState('classy.bling');
  const [maxVideos, setMaxVideos] = useState(20);
  const [singleUrl, setSingleUrl] = useState('');
  const [isProcessingSingle, setIsProcessingSingle] = useState(false);
  const [singleResult, setSingleResult] = useState<{ status: 'success' | 'skip' | 'error'; message: string } | null>(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ status: 'success' | 'skip' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bot scraper status state
  const [status, setStatus] = useState<BotStatus>({
    isRunning: false,
    status: 'idle',
    totalFound: 0,
    processedCount: 0,
    savedCount: 0,
    skippedCount: 0,
    logs: []
  });

  // Polling loop for active scraper status
  useEffect(() => {
    let interval: any;
    const fetchStatus = async () => {
      try {
        const res = await api.getScrapeStatus();
        setStatus(res);
        if (res.status === 'completed' || res.status === 'error') {
          onRefreshProducts();
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
    interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStartScrape = async () => {
    try {
      await api.startScraping(handle, maxVideos);
      const updated = await api.getScrapeStatus();
      setStatus(updated);
    } catch (err: any) {
      alert(err.message || 'Could not start scraper');
    }
  };

  const handleProcessSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleUrl.trim()) return;
    setIsProcessingSingle(true);
    setSingleResult(null);
    try {
      const res = await api.processSingleVideo(singleUrl);
      if (res.success && res.product) {
        setSingleResult({
          status: 'success',
          message: `Successfully extracted "${res.product.name}" ($${res.product.price}) and rendered clean packaging!`
        });
        onRefreshProducts();
      } else {
        setSingleResult({
          status: 'skip',
          message: `Skipped: ${res.message || 'Video does not match product showcase angle.'}`
        });
      }
    } catch (err: any) {
      setSingleResult({
        status: 'error',
        message: `Error: ${err.message}`
      });
    } finally {
      setIsProcessingSingle(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadFile(file);
    setIsUploading(true);
    setUploadResult(null);
    try {
      const res = await api.uploadFrame(file);
      if (res.success && res.product) {
        setUploadResult({
          status: 'success',
          message: `Processed "${res.product.name}" ($${res.product.price}) with AI bounding box crop!`
        });
        onRefreshProducts();
      } else {
        setUploadResult({
          status: 'skip',
          message: `Skipped: ${res.message || 'Image did not match product showcase angle.'}`
        });
      }
    } catch (err: any) {
      setUploadResult({
        status: 'error',
        message: `Error: ${err.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  const progressPercent = status.totalFound > 0
    ? Math.round((status.processedCount / status.totalFound) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      
      <div className="relative w-full max-w-5xl rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] transition-colors">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
              <Bot className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  TikTok Scraper & AI Vision Bot Studio
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Automated profile crawling, angle verification, OCR extraction, and auto-cropping
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Angle Filter Policy Banner */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>
            <strong>Angle Guard Active:</strong> The bot inspects each video frame and automatically skips clips that do not match the product showcase angle.
          </span>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-2 bg-slate-50 dark:bg-zinc-950">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Profile Scraper (@classy.bling)</span>
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'single'
                ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Process Single Video</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upload'
                ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Screenshot Frame</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: Profile Scraper */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                
                <div className="md:col-span-6">
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-1.5">
                    Target TikTok Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-600 dark:text-rose-400 font-bold text-sm">@</span>
                    <input
                      type="text"
                      value={handle.replace('@', '')}
                      onChange={e => setHandle(e.target.value)}
                      placeholder="classy.bling"
                      disabled={status.isRunning}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-1.5">
                    Max Videos: <span className="text-rose-600 dark:text-rose-400 font-bold">{maxVideos}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={maxVideos}
                    onChange={e => setMaxVideos(Number(e.target.value))}
                    disabled={status.isRunning}
                    className="w-full accent-rose-600 mt-2 cursor-pointer"
                  />
                </div>

                <div className="md:col-span-3 flex items-end">
                  <button
                    onClick={handleStartScrape}
                    disabled={status.isRunning}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                      status.isRunning
                        ? 'bg-slate-300 dark:bg-zinc-800 text-slate-500 cursor-not-allowed'
                        : 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white'
                    }`}
                  >
                    {status.isRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scraping Live...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Start Scrape Bot</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Status & Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase">Status</p>
                  <p className="text-sm font-extrabold capitalize text-slate-900 dark:text-zinc-100 mt-0.5">{status.status}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase">Videos Found</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-zinc-100 mt-0.5">{status.totalFound}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Products Saved</p>
                  <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{status.savedCount}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
                  <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">Angle Skipped</p>
                  <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{status.skippedCount}</p>
                </div>
              </div>

              {/* Progress Bar */}
              {status.isRunning && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-zinc-400">
                    <span>Processing video frames ({status.processedCount}/{status.totalFound})</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-rose-600 dark:bg-rose-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Live Terminal Logs */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400">
                  <Terminal className="w-4 h-4" />
                  <span>Real-time Bot Logs</span>
                </div>
                <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 p-3 overflow-y-auto font-mono text-xs text-slate-300 space-y-1">
                  {status.logs.length === 0 ? (
                    <p className="text-slate-600">Bot idle. Click "Start Scrape Bot" to begin automated processing...</p>
                  ) : (
                    status.logs.map((log, idx) => (
                      <p key={idx} className="leading-relaxed">
                        <span className="text-slate-500">[{log.timestamp || new Date().toLocaleTimeString()}]</span>{' '}
                        <span className={log.level === 'error' ? 'text-rose-400' : log.level === 'success' ? 'text-emerald-400' : log.level === 'warn' ? 'text-amber-400' : 'text-slate-300'}>
                          {log.message}
                        </span>
                      </p>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Process Single Video */}
          {activeTab === 'single' && (
            <form onSubmit={handleProcessSingle} className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                Paste any specific TikTok video URL. The bot will download the clip, sample keyframes, check standard angles with Vision AI, extract the product name & price, and render a clean packaging photo.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 block mb-1.5">
                  TikTok Video URL
                </label>
                <input
                  type="url"
                  value={singleUrl}
                  onChange={e => setSingleUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@classy.bling/video/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-sm focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProcessingSingle}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                {isProcessingSingle ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with Vision AI...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Process Video Link</span>
                  </>
                )}
              </button>

              {singleResult && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 border ${
                  singleResult.status === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : singleResult.status === 'skip'
                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                }`}>
                  {singleResult.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {singleResult.status === 'skip' && <FastForward className="w-4 h-4 text-amber-600" />}
                  {singleResult.status === 'error' && <XCircle className="w-4 h-4 text-rose-600" />}
                  <span>{singleResult.message}</span>
                </div>
              )}
            </form>
          )}

          {/* TAB 3: Upload Screenshot Frame */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                Upload a video screenshot or photo directly. The AI will inspect the packaging, perform OCR name and price extraction, and render a clean packaging box.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <Upload className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                  {uploadFile ? uploadFile.name : 'Click to select screenshot image (PNG, JPG, WebP)'}
                </p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                  Supports up to 20MB files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {isUploading && (
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing screenshot frame with Multimodal Vision AI...</span>
                </div>
              )}

              {uploadResult && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 border ${
                  uploadResult.status === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : uploadResult.status === 'skip'
                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                }`}>
                  {uploadResult.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {uploadResult.status === 'skip' && <FastForward className="w-4 h-4 text-amber-600" />}
                  {uploadResult.status === 'error' && <XCircle className="w-4 h-4 text-rose-600" />}
                  <span>{uploadResult.message}</span>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
