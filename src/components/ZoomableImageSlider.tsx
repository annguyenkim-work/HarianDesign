import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export interface SliderMediaItem {
  src: string;
  alt: string;
  fallbackTitle: string;
  caption: string;
  meta: string;
}

interface ZoomableImageSliderProps {
  slides: SliderMediaItem[];
  ariaLabel: string;
  zoomInLabel: string;
  zoomOutLabel: string;
  resetZoomLabel: string;
  expandLabel: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  zoomHintText: string;
  frameClassName?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3.5;
const ZOOM_STEP = 0.5;

export function ZoomableImageSlider({
  slides,
  ariaLabel,
  zoomInLabel,
  zoomOutLabel,
  resetZoomLabel,
  expandLabel,
  closeLabel,
  prevLabel,
  nextLabel,
  zoomHintText,
  frameClassName = 'min-h-[290px] lg:min-h-[360px]',
}: ZoomableImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Lightbox independent zoom/pan state
  const [lbZoom, setLbZoom] = useState(1);
  const [lbPan, setLbPan] = useState({ x: 0, y: 0 });
  const [lbDragging, setLbDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const lbStageRef = useRef<HTMLDivElement>(null);
  const lbDragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const safeIndex = activeIndex < slides.length ? activeIndex : 0;
  const currentSlide = slides[safeIndex];

  const clampPan = useCallback(
    (nextX: number, nextY: number, scale: number, el: HTMLDivElement | null) => {
      if (scale <= 1 || !el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const maxX = ((scale - 1) * rect.width) / 2;
      const maxY = ((scale - 1) * rect.height) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, nextX)),
        y: Math.max(-maxY, Math.min(maxY, nextY)),
      };
    },
    []
  );

  const resetInlineZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const resetLbZoom = useCallback(() => {
    setLbZoom(1);
    setLbPan({ x: 0, y: 0 });
  }, []);

  const goToSlide = useCallback(
    (nextIndex: number) => {
      const wrapped = (nextIndex + slides.length) % slides.length;
      setActiveIndex(wrapped);
      resetInlineZoom();
      resetLbZoom();
    },
    [slides.length, resetInlineZoom, resetLbZoom]
  );

  const handlePrev = useCallback(() => {
    goToSlide(safeIndex - 1);
  }, [goToSlide, safeIndex]);

  const handleNext = useCallback(() => {
    goToSlide(safeIndex + 1);
  }, [goToSlide, safeIndex]);

  const updateInlineZoom = useCallback(
    (nextScale: number) => {
      const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(nextScale.toFixed(2))));
      setZoom(clamped);
      setPan((prev) => clampPan(prev.x, prev.y, clamped, stageRef.current));
    },
    [clampPan]
  );

  const updateLbZoom = useCallback(
    (nextScale: number) => {
      const clamped = Math.max(MIN_ZOOM, Math.min(4, Number(nextScale.toFixed(2))));
      setLbZoom(clamped);
      setLbPan((prev) => clampPan(prev.x, prev.y, clamped, lbStageRef.current));
    },
    [clampPan]
  );

  // Gentle auto-advance when user is not interacting or zoomed in
  useEffect(() => {
    if (slides.length <= 1 || isHovered || zoom > 1 || lightboxOpen) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length, isHovered, zoom, lightboxOpen]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        updateLbZoom(lbZoom + ZOOM_STEP);
      } else if (e.key === '-') {
        updateLbZoom(lbZoom - ZOOM_STEP);
      } else if (e.key === '0') {
        resetLbZoom();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, handlePrev, handleNext, lbZoom, updateLbZoom, resetLbZoom]);

  // Inline drag handlers
  function onStagePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (zoom <= 1) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }

  function onStagePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan(
      clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy, zoom, stageRef.current)
    );
  }

  function onStagePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    dragStartRef.current = null;
  }

  // Lightbox drag handlers
  function onLbPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (lbZoom <= 1) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setLbDragging(true);
    lbDragStartRef.current = { x: e.clientX, y: e.clientY, panX: lbPan.x, panY: lbPan.y };
  }

  function onLbPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!lbDragging || !lbDragStartRef.current) return;
    const dx = e.clientX - lbDragStartRef.current.x;
    const dy = e.clientY - lbDragStartRef.current.y;
    setLbPan(
      clampPan(
        lbDragStartRef.current.panX + dx,
        lbDragStartRef.current.panY + dy,
        lbZoom,
        lbStageRef.current
      )
    );
  }

  function onLbPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!lbDragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setLbDragging(false);
    lbDragStartRef.current = null;
  }

  if (!currentSlide) return null;

  return (
    <div
      className="flex flex-col flex-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      {/* Main Slide Viewport */}
      <div
        ref={stageRef}
        onPointerDown={onStagePointerDown}
        onPointerMove={onStagePointerMove}
        onPointerUp={onStagePointerUp}
        onPointerCancel={onStagePointerUp}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.25 : -0.25;
            updateInlineZoom(zoom + delta);
          }
        }}
        onDoubleClick={() => {
          if (zoom > 1) {
            resetInlineZoom();
          } else {
            updateInlineZoom(2);
          }
        }}
        className={`relative w-full aspect-[4/3] lg:aspect-auto lg:flex-1 ${frameClassName} rounded-xl overflow-hidden border border-slate-200 bg-slate-100 select-none ${
          zoom > 1
            ? isDragging
              ? 'cursor-grabbing touch-none'
              : 'cursor-grab touch-none'
            : 'cursor-zoom-in'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide.src + safeIndex}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.35 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="absolute inset-0"
          >
            <div
              className={`w-full h-full will-change-transform ${
                isDragging ? '' : 'transition-transform duration-200 ease-out'
              }`}
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
              <ImageWithFallback
                src={currentSlide.src}
                alt={currentSlide.alt}
                fallbackTitle={currentSlide.fallbackTitle}
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Top-left Slide Index */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-slate-900/70 backdrop-blur-sm text-white font-mono text-xs tabular-nums pointer-events-none">
          {String(safeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>

        {/* Top-right Zoom & Expand Controls */}
        <div
          className="absolute top-3 right-3 z-10 inline-flex items-center gap-0.5 p-1 rounded-lg bg-slate-900/75 backdrop-blur-sm text-white border border-white/15"
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => updateInlineZoom(zoom - ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            aria-label={zoomOutLabel}
            title={zoomOutLabel}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-white/15 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={resetInlineZoom}
            disabled={zoom === 1}
            title={resetZoomLabel}
            aria-label={resetZoomLabel}
            className="px-2 h-8 inline-flex items-center justify-center rounded-md font-mono text-xs font-medium tabular-nums hover:bg-white/15 disabled:opacity-90 disabled:cursor-default transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={() => updateInlineZoom(zoom + ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            aria-label={zoomInLabel}
            title={zoomInLabel}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-white/15 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-white/20 mx-0.5" aria-hidden="true" />

          <button
            type="button"
            onClick={() => {
              resetLbZoom();
              setLightboxOpen(true);
            }}
            aria-label={expandLabel}
            title={expandLabel}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-white/15 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Left / Right Slide Navigation Buttons */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              onDoubleClick={(e) => e.stopPropagation()}
              aria-label={prevLabel}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-lg bg-white/90 hover:bg-white text-slate-900 border border-slate-200/80 shadow-sm inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C64AF]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              onDoubleClick={(e) => e.stopPropagation()}
              aria-label={nextLabel}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-lg bg-white/90 hover:bg-white text-slate-900 border border-slate-200/80 shadow-sm inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C64AF]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Subtle Pan Hint when Zoomed */}
        {zoom > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-md bg-slate-900/75 backdrop-blur-sm text-white text-[11px] pointer-events-none whitespace-nowrap">
            {zoomHintText}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {slides.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {slides.map((slide, idx) => {
            const isActive = idx === safeIndex;
            return (
              <button
                key={slide.src + idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`${slide.caption} (${idx + 1}/${slides.length})`}
                aria-current={isActive ? 'true' : undefined}
                className={`relative aspect-[16/10] rounded-lg overflow-hidden border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C64AF] ${
                  isActive
                    ? 'border-[#2C64AF] ring-2 ring-[#2C64AF]/20 opacity-100'
                    : 'border-slate-200 opacity-65 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                <ImageWithFallback
                  src={slide.src}
                  alt={slide.alt}
                  fallbackTitle={slide.fallbackTitle}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Clean Unboxed Caption Row */}
      <div className="mt-2.5 flex items-center justify-between gap-4 text-xs text-slate-500">
        <span className="truncate">{currentSlide.caption}</span>
        <span className="font-mono tabular-nums shrink-0">{currentSlide.meta}</span>
      </div>

      {/* Fullscreen Zoomable Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-sm flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={currentSlide.caption}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 border-b border-white/10 text-white">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-slate-300 tabular-nums shrink-0">
                  {String(safeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
                <span className="text-slate-500" aria-hidden="true">
                  ·
                </span>
                <span className="text-sm font-medium truncate">{currentSlide.caption}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => updateLbZoom(lbZoom - ZOOM_STEP)}
                  disabled={lbZoom <= MIN_ZOOM}
                  aria-label={zoomOutLabel}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2.5 font-mono text-xs tabular-nums min-w-[54px] text-center">
                  {Math.round(lbZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => updateLbZoom(lbZoom + ZOOM_STEP)}
                  disabled={lbZoom >= 4}
                  aria-label={zoomInLabel}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={resetLbZoom}
                  disabled={lbZoom === 1}
                  aria-label={resetZoomLabel}
                  title={resetZoomLabel}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-white/15 mx-1" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  aria-label={closeLabel}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Interactive Lightbox Canvas */}
            <div
              ref={lbStageRef}
              onPointerDown={onLbPointerDown}
              onPointerMove={onLbPointerMove}
              onPointerUp={onLbPointerUp}
              onPointerCancel={onLbPointerUp}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.25 : -0.25;
                updateLbZoom(lbZoom + delta);
              }}
              onDoubleClick={() => {
                if (lbZoom > 1) resetLbZoom();
                else updateLbZoom(2.2);
              }}
              className={`relative flex-1 flex items-center justify-center overflow-hidden p-4 sm:p-8 select-none ${
                lbZoom > 1
                  ? lbDragging
                    ? 'cursor-grabbing touch-none'
                    : 'cursor-grab touch-none'
                  : 'cursor-zoom-in'
              }`}
            >
              <div
                className={`max-w-5xl max-h-full will-change-transform ${
                  lbDragging ? '' : 'transition-transform duration-200 ease-out'
                }`}
                style={{
                  transform: `translate3d(${lbPan.x}px, ${lbPan.y}px, 0) scale(${lbZoom})`,
                  transformOrigin: 'center center',
                }}
              >
                <ImageWithFallback
                  src={currentSlide.src}
                  alt={currentSlide.alt}
                  fallbackTitle={currentSlide.fallbackTitle}
                  className="max-h-[72vh] w-auto rounded-lg object-contain pointer-events-none select-none shadow-2xl"
                />
              </div>

              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    onDoubleClick={(e) => e.stopPropagation()}
                    aria-label={prevLabel}
                    className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/15 inline-flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    onDoubleClick={(e) => e.stopPropagation()}
                    aria-label={nextLabel}
                    className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/15 inline-flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnail Strip */}
            <div className="px-4 sm:px-6 py-3.5 border-t border-white/10 flex items-center justify-center gap-2.5 overflow-x-auto">
              {slides.map((slide, idx) => {
                const active = idx === safeIndex;
                return (
                  <button
                    key={slide.src + idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={slide.caption}
                    className={`w-20 aspect-[16/10] rounded-md overflow-hidden border transition-all cursor-pointer shrink-0 ${
                      active
                        ? 'border-[#60A5FA] ring-2 ring-[#60A5FA]/40 opacity-100'
                        : 'border-white/20 opacity-55 hover:opacity-95'
                    }`}
                  >
                    <ImageWithFallback
                      src={slide.src}
                      alt={slide.alt}
                      fallbackTitle={slide.fallbackTitle}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
