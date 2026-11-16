/**
 * Black tap-to-reveal covers over evidence photos, per screen id.
 * Positions are in pixels on the 1366×768 screen and converted to fractions below.
 */
export interface Cover {
  x: number;
  y: number;
  w: number;
  h: number;
}

const W = 1366;
const H = 768;

/** Builds covers for a photo grid: column [left, right] and row [top, bottom] edges in px. */
function grid(cols: [number, number][], rows: [number, number][]): Cover[] {
  return rows.flatMap(([t, b]) => cols.map(([l, r]) => ({ x: l / W, y: t / H, w: (r - l) / W, h: (b - t) / H })));
}

export const coversByScreen: Record<string, Cover[]> = {
  // A 書房 Study Room — 12 photos, numbered left-to-right, top-to-bottom.
  '13': grid(
    [[70, 368], [374, 673], [678, 976], [982, 1281]],
    [[100, 267], [306, 469], [508, 671]],
  ),
};
