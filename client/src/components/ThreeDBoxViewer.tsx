import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Volume2, RotateCcw, ShieldCheck, Flame, Compass, Maximize2 } from 'lucide-react';

interface PopBoxItem {
  id: string;
  name: string;
  series: string;
  brand: string;
  price: number;
  image: string;
  secretRate: string;
  description: string;
}

interface ThreeDBoxViewerProps {
  box: PopBoxItem;
}

export const ThreeDBoxViewer: React.FC<ThreeDBoxViewerProps> = ({ box }) => {
  // Interactive 3D Tilt Angles (in degrees)
  const [tiltX, setTiltX] = useState(-5);
  const [tiltY, setTiltY] = useState(12);
  const [glarePos, setGlarePos] = useState({ x: 45, y: 35, opacity: 0.35 });
  const [isDragging, setIsDragging] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [shakeMessage, setShakeMessage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startDragRef = useRef<{ x: number; y: number; startTiltX: number; startTiltY: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const autoSwayRef = useRef<number>(0);

  // Smooth Idle 3D Sway / Float effect when not dragging
  useEffect(() => {
    if (isDragging || isShaking) return;

    let startTime = performance.now();
    const sway = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      autoSwayRef.current = elapsed;

      // Gentle continuous ambient breathing float
      const swayY = Math.sin(elapsed * 0.8) * 12 + 6;
      const swayX = Math.cos(elapsed * 0.6) * 6 - 4;

      setTiltY(swayY);
      setTiltX(swayX);

      // Light glare follows sway
      const glareX = 50 + Math.sin(elapsed * 0.8) * 30;
      const glareY = 40 + Math.cos(elapsed * 0.6) * 25;
      setGlarePos({ x: glareX, y: glareY, opacity: 0.3 + Math.abs(Math.sin(elapsed * 0.8)) * 0.2 });

      animFrameRef.current = requestAnimationFrame(sway);
    };

    animFrameRef.current = requestAnimationFrame(sway);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging, isShaking]);

  // Pointer move calculation for 3D tilt & glare tracking
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    startDragRef.current = {
      x: e.clientX,
      y: e.clientY,
      startTiltX: tiltX,
      startTiltY: tiltY
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pointerX = ((e.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((e.clientY - rect.top) / rect.height) * 100;

    // Update dynamic holographic glare position
    setGlarePos({
      x: Math.max(0, Math.min(100, pointerX)),
      y: Math.max(0, Math.min(100, pointerY)),
      opacity: 0.55
    });

    if (isDragging && startDragRef.current) {
      const deltaX = e.clientX - startDragRef.current.x;
      const deltaY = e.clientY - startDragRef.current.y;

      const newTiltY = Math.max(-32, Math.min(32, startDragRef.current.startTiltY + deltaX * 0.35));
      const newTiltX = Math.max(-28, Math.min(28, startDragRef.current.startTiltX - deltaY * 0.35));

      setTiltY(newTiltY);
      setTiltX(newTiltX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDragging(false);
    startDragRef.current = null;
  };

  // Viral Shake Box physics & haptics
  const handleShakeBox = () => {
    if (isShaking) return;
    setIsShaking(true);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([40, 50, 40, 50, 70]);
      } catch {
        // ignore
      }
    }

    const hints = [
      '⚖️ Weight Check: Heavy & solid weight detected inside!',
      '🔊 Rattle Sound: Soft vinyl texture movement detected!',
      '✨ Secret Aura: Rare foil series vibration detected!',
      '🎁 Mystery Pack: 100% genuine factory sealed!'
    ];
    setShakeMessage(hints[Math.floor(Math.random() * hints.length)]);

    setTimeout(() => {
      setIsShaking(false);
    }, 1100);

    setTimeout(() => {
      setShakeMessage(null);
    }, 4000);
  };

  const handleReset = () => {
    setTiltX(-5);
    setTiltY(12);
    setIsZoomed(false);
  };

  return (
    <div className="flex flex-col items-center w-full select-none">
      
      {/* 3D Holographic Stage Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[280px] sm:h-[360px] rounded-3xl overflow-hidden border border-stone-200/80 dark:border-zinc-800 bg-[#F5F2EC] dark:bg-[#121216] shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-colors"
        style={{ perspective: '1100px' }}
      >
        
        {/* Ambient Stage Lighting (Warm studio glow seamlessly matching the product photo) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.8),transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(229,0,18,0.06),transparent_60%)] pointer-events-none" />

        {/* Top Info Badges Overlay */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-30 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 dark:bg-black/75 backdrop-blur-md border border-stone-300/70 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            <Compass className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '8s' }} />
            <span>3D Studio Stage</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-black/60 backdrop-blur-md border border-stone-200 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-zinc-300">
              Tilt: {Math.round(tiltY)}°
            </span>
          </div>
        </div>

        {/* 3D Parallax Card with Dynamic Holographic Lighting */}
        <div
          className="relative flex items-center justify-center transition-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${isZoomed ? 1.25 : 1}, ${isZoomed ? 1.25 : 1}, 1) ${
              isShaking ? 'rotateZ(6deg) scale(1.08)' : ''
            }`,
            transition: isShaking
              ? 'transform 0.09s ease-in-out'
              : isDragging
              ? 'none'
              : 'transform 0.25s ease-out'
          }}
        >
          
          {/* Main 3D Box & Studio Pedestal Image */}
          <div className="relative max-h-[220px] sm:max-h-[280px] w-auto aspect-square flex items-center justify-center p-2 rounded-2xl">
            <img
              src={box.image}
              alt={box.name}
              className="max-h-[210px] sm:max-h-[270px] w-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_25px_30px_rgba(0,0,0,0.7)] transition-all"
              draggable={false}
            />

            {/* Dynamic Real Holographic Foil Glare Sheen that reacts to pointer/tilt angle */}
            <div
              className="absolute inset-2 rounded-2xl pointer-events-none mix-blend-overlay transition-opacity duration-150"
              style={{
                opacity: glarePos.opacity,
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.95) 0%, rgba(255,230,120,0.4) 25%, rgba(130,220,255,0.2) 45%, transparent 70%)`
              }}
            />

            {/* Floating 3D Sparkle Highlight */}
            <div
              className="absolute top-4 right-6 pointer-events-none transition-transform duration-300"
              style={{
                transform: `translateZ(35px) translate(${tiltY * 0.4}px, ${-tiltX * 0.4}px)`
              }}
            >
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300 drop-shadow-md animate-pulse" />
            </div>

            {/* Floating 3D Authentic Tag */}
            <div
              className="absolute bottom-4 left-4 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 pointer-events-none transition-transform duration-300"
              style={{
                transform: `translateZ(45px) translate(${-tiltY * 0.3}px, ${tiltX * 0.3}px)`
              }}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Original 3D Drop</span>
            </div>

          </div>

        </div>

        {/* Dynamic Pedestal Ground Shadow (Scales & tilts with box orientation) */}
        <div
          className="absolute bottom-5 w-48 sm:w-60 h-10 rounded-[100%] bg-black/25 dark:bg-black/65 blur-lg pointer-events-none transition-all duration-200"
          style={{
            transform: `translate(${tiltY * 0.8}px, 0px) scale(${1 + Math.abs(tiltX) * 0.01})`,
            opacity: 0.6 + Math.abs(tiltX) * 0.01
          }}
        />

        {/* Shake Toast Message */}
        {shakeMessage && (
          <div className="absolute bottom-3.5 inset-x-4 z-40 bg-slate-900/95 dark:bg-black/95 text-amber-300 text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-amber-400/40 shadow-2xl backdrop-blur-md text-center animate-fade-in flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>{shakeMessage}</span>
          </div>
        )}

        {/* Touch/Drag Guide for Users */}
        <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-500 dark:text-zinc-400 pointer-events-none hidden sm:flex items-center gap-1 bg-white/70 dark:bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200 dark:border-white/10">
          <span>✋ Touch & drag to inspect 3D angles</span>
        </div>

      </div>

      {/* 3D Interactive Control Toolbar */}
      <div className="flex items-center justify-between w-full pt-3 px-1 gap-2">
        
        {/* Left: Shake Box Action */}
        <button
          onClick={handleShakeBox}
          disabled={isShaking}
          title="Shake the box to test weight and mystery contents!"
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-rose-500/15 hover:from-amber-500/25 hover:to-rose-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-50 min-h-[38px]"
        >
          <Volume2 className={`w-4 h-4 text-amber-500 ${isShaking ? 'animate-bounce' : ''}`} />
          <span>Shake Box</span>
        </button>

        {/* Right: Controls (Zoom, Reset View) */}
        <div className="flex items-center gap-1.5">
          {/* Zoom Toggle */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            className={`p-2 rounded-xl border text-xs font-bold transition-all active:scale-95 min-h-[38px] min-w-[38px] flex items-center justify-center ${
              isZoomed
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                : 'bg-white dark:bg-zinc-800 border-stone-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Reset Angle Button */}
          <button
            onClick={handleReset}
            title="Reset 3D View"
            className="p-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 border border-stone-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-bold transition-all active:scale-95 min-h-[38px] min-w-[38px] flex items-center justify-center shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
