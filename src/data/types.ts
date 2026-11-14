/** A clickable area on a screen, positioned in fractions (0–1) of the screen size. */
export interface Hotspot {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Target screen id (internal navigation). */
  to?: string;
  /** External URL (opens in a new tab). */
  href?: string;
  /** Visible label (from the original button text, or the target screen title). */
  label: string;
}

export type SpecialScreen = 'questions' | 'budget';

export interface Screen {
  /** Stable id. Matches the original Canva anchor (#page-<id>) where one exists. */
  id: string;
  /** Short bilingual title shown in the top bar and on mobile buttons. */
  title: string;
  /** Section group, e.g. "首頁", "主選單", "CCTV 01 停車場". */
  group: string;
  /** Image path under /public. */
  image: string;
  hotspots: Hotspot[];
  /** Not linked from anywhere in the original site; kept in data but not navigable. */
  hidden?: boolean;
  special?: SpecialScreen;
}
