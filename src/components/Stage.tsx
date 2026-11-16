import { useState, type ReactNode } from 'react';
import { ZoomIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Screen } from '../data/types';
import { openHotspot } from '../lib/openHotspot';

interface Props {
  screen: Screen;
  onZoom: () => void;
  /** Extra interactive layer placed over the image (same % coordinate space). */
  overlay?: ReactNode;
  /** Layer shown in every layout (e.g. photo covers), above the hotspots. */
  cover?: ReactNode;
}

/**
 * The 16:9 screen image. On wide screens (tablet/desktop/landscape phone) the original
 * button positions are live hotspots. On portrait phones the image is a tap-to-zoom preview
 * and navigation moves to the touch-friendly ActionPanel below.
 */
export default function Stage({ screen, onZoom, overlay, cover }: Props) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="stage relative mx-auto select-none overflow-hidden bg-black/40 shadow-2xl shadow-black/60">
      <img
        key={screen.image}
        src={screen.image}
        alt={screen.title}
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover ${loaded ? 'animate-fade' : 'opacity-0'}`}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
        </div>
      )}

      {/* Portrait phones: the whole image opens the zoom viewer. */}
      <button
        type="button"
        onClick={onZoom}
        aria-label="放大圖片"
        className="absolute inset-0 wide:hidden"
      >
        <span className="absolute bottom-2 right-2 z-20 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs text-parchment">
          <ZoomIn size={14} /> 點圖放大
        </span>
      </button>

      {/* Wide screens: live hotspots in their original positions. */}
      <div className="absolute inset-0 hidden wide:block">
        {screen.hotspots.map((h, i) => (
          <button
            key={i}
            type="button"
            title={h.label}
            aria-label={h.label}
            onClick={() => openHotspot(h, navigate)}
            style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%`, width: `${h.w * 100}%`, height: `${h.h * 100}%` }}
            className="absolute rounded-[10px] transition duration-150 hover:bg-white/10 hover:shadow-[0_0_0_2px_rgba(201,164,92,0.85),0_0_18px_rgba(201,164,92,0.45)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass"
          />
        ))}
        {overlay}
        <button
          type="button"
          onClick={onZoom}
          aria-label="放大圖片"
          title="放大圖片"
          className="absolute bottom-[1.5%] right-[1%] flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-parchment/90 opacity-70 transition hover:opacity-100"
        >
          <ZoomIn size={18} />
        </button>
      </div>
      {cover}
    </div>
  );
}
