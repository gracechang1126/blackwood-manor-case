import { ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Hotspot } from '../data/types';
import { HOME_ID, MAP_ID, MENU_ID } from '../data/screens';
import { openHotspot } from '../lib/openHotspot';

interface Props {
  hotspots: Hotspot[];
}

const GLOBAL = new Set([HOME_ID, MAP_ID, MENU_ID]);
const SEP = ' · ';

interface Group {
  name: string;
  items: { h: Hotspot; text: string }[];
}

/** Labels like "Ben · 人物檔案 Profile" are grouped under "Ben". */
function groupItems(items: Hotspot[]): Group[] {
  const groups: Group[] = [];
  for (const h of items) {
    const i = h.label.indexOf(SEP);
    const name = i > 0 ? h.label.slice(0, i) : '';
    const text = i > 0 ? h.label.slice(i + SEP.length) : h.label;
    let g = groups.find((x) => x.name === name);
    if (!g) groups.push((g = { name, items: [] }));
    g.items.push({ h, text });
  }
  // Within a named group, follow the on-screen order (top-to-bottom, then left-to-right).
  for (const g of groups) if (g.name) g.items.sort((a, b) => Math.round(a.h.y * 50) - Math.round(b.h.y * 50) || a.h.x - b.h.x);
  // Ungrouped items first; a "group" of one is clearer with its full label.
  groups.sort((a, b) => Number(a.name !== '') - Number(b.name !== ''));
  return groups.flatMap((g) => (g.name && g.items.length < 2 ? [{ name: '', items: g.items.map(({ h }) => ({ h, text: h.label })) }] : [g]));
}

/** Portrait phone/tablet navigation: every hotspot on the screen as a large, touch-friendly button. */
export default function ActionPanel({ hotspots }: Props) {
  const navigate = useNavigate();

  // De-duplicate (the original sometimes repeats a link), keep original order.
  const seen = new Set<string>();
  const items = hotspots.filter((h) => {
    const k = (h.to ?? h.href) + '|' + h.label;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  // Main Menu / Manor Map / Home are always in the top bar, so list them last.
  const primary = groupItems(items.filter((h) => !(h.to && GLOBAL.has(h.to))));
  const secondary = items.filter((h) => h.to && GLOBAL.has(h.to));

  if (items.length === 0) return null;

  return (
    <nav className="wide:hidden mx-auto w-full max-w-xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 md:max-w-3xl" aria-label="本頁選項">
      <div className="space-y-4">
        {primary.map((g, gi) => (
          <section key={gi}>
            {g.name && <h2 className="mb-2 border-b border-brass/30 pb-1 font-display text-sm tracking-[0.15em] text-brass">{g.name}</h2>}
            <ul className={`grid gap-2.5 md:grid-cols-3 ${g.name ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {g.items.map(({ h, text }, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => openHotspot(h, navigate)}
                    className="flex h-full min-h-[52px] w-full items-center justify-between gap-2 rounded-xl border border-brass/40 bg-gradient-to-r from-wine-dark to-[#7a3b2c] px-3.5 py-2.5 text-left font-tc text-[15px] font-bold leading-snug text-parchment shadow-md shadow-black/40 transition active:scale-[0.98]"
                  >
                    <span>{text}</span>
                    {h.href ? <ExternalLink size={18} className="shrink-0 text-brass" /> : <ChevronRight size={20} className="shrink-0 text-brass" />}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {secondary.length > 0 && (
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {secondary.map((h, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => openHotspot(h, navigate)}
                className="min-h-[44px] rounded-full border border-parchment/25 bg-black/50 px-4 font-display text-sm tracking-wider text-parchment/90 active:scale-[0.98]"
              >
                {h.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
