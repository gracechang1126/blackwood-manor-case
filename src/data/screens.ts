import raw from './screens.json';
import type { Screen } from './types';

/**
 * Screen images are cached by browsers for a year (see vercel.json).
 * Bump this whenever any image in public/screens/ is replaced, so visitors get the new file.
 */
const IMAGE_VERSION = '2';

export const screens = (raw as Screen[]).map((s) => ({ ...s, image: `${s.image}?v=${IMAGE_VERSION}` }));

const byId = new Map(screens.map((s) => [s.id, s]));

export const HOME_ID = '0';
export const MAP_ID = '5';
export const MENU_ID = '8';
export const LOCATIONS_ID = 'j';

export function getScreen(id: string | undefined): Screen | undefined {
  return id ? byId.get(id) : undefined;
}

export function screenPath(id: string): string {
  return id === HOME_ID ? '/' : `/s/${id}`;
}
