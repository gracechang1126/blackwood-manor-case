import raw from './screens.json';
import type { Screen } from './types';

export const screens = raw as Screen[];

const byId = new Map(screens.map((s) => [s.id, s]));

export const HOME_ID = '0';
export const MAP_ID = '5';
export const MENU_ID = '8';

export function getScreen(id: string | undefined): Screen | undefined {
  return id ? byId.get(id) : undefined;
}

export function screenPath(id: string): string {
  return id === HOME_ID ? '/' : `/s/${id}`;
}
