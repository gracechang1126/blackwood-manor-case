import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

const LEVELS = [1, 1.6, 2.4, 3.5];

/** Full-screen image viewer with zoom levels, scroll/drag panning and native pinch-zoom. */
export default function Lightbox({ src, alt, onClose }: Props) {
  const [level, setLevel] = useState(() => (window.matchMedia('(min-width: 1024px), (orientation: landscape)').matches ? 0 : 2));
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; l: number; t: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setLevel((l) => Math.min(l + 1, LEVELS.length - 1));
      if (e.key === '-') setLevel((l) => Math.max(l - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Keep the view centred when the zoom level changes.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
  }, [level]);

  const scale = LEVELS[level];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 animate-fade" role="dialog" aria-modal="true" aria-label={alt}>
      <div className="flex items-center justify-between gap-2 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <span className="truncate text-sm text-parchment/80">{alt}</span>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="縮小" disabled={level === 0} onClick={() => setLevel((l) => l - 1)} className="flex h-11 w-11 items-center justify-center rounded-full text-parchment disabled:opacity-30 hover:bg-white/10">
            <ZoomOut size={22} />
          </button>
          <span className="w-12 text-center text-sm tabular-nums text-parchment/70">{Math.round(scale * 100)}%</span>
          <button type="button" aria-label="放大" disabled={level === LEVELS.length - 1} onClick={() => setLevel((l) => l + 1)} className="flex h-11 w-11 items-center justify-center rounded-full text-parchment disabled:opacity-30 hover:bg-white/10">
            <ZoomIn size={22} />
          </button>
          <button type="button" aria-label="關閉" onClick={onClose} className="ml-1 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-parchment hover:bg-white/20">
            <X size={22} />
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="flex-1 cursor-grab overflow-auto active:cursor-grabbing"
        style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse') return;
          const el = scroller.current!;
          drag.current = { x: e.clientX, y: e.clientY, l: el.scrollLeft, t: el.scrollTop };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const el = scroller.current!;
          el.scrollLeft = drag.current.l - (e.clientX - drag.current.x);
          el.scrollTop = drag.current.t - (e.clientY - drag.current.y);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        <div className="flex min-h-full min-w-full items-center justify-center p-2">
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{ width: `min(${scale * 100}vw, ${scale * 1.778 * 85}vh)`, maxWidth: 'none' }}
            className="h-auto select-none"
          />
        </div>
      </div>
      <p className="pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center text-xs text-parchment/50">雙指縮放或拖曳查看細節 · 按 Esc 關閉</p>
    </div>
  );
}
