import type { Hotspot } from '../data/types';
import { screenPath } from '../data/screens';

/** Follow a hotspot: internal screens via the router, external links in a new tab. */
export function openHotspot(h: Hotspot, navigate: (to: string) => void) {
  if (h.href) window.open(h.href, '_blank', 'noopener,noreferrer');
  else if (h.to) navigate(screenPath(h.to));
}
