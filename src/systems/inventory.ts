import { getState, saveSave } from './save';
import { ITEMS, type ItemId } from '../data/items';

export const MAX_SLOTS = 6;

export function getInventory(): ItemId[] {
  return getState().inventory as ItemId[];
}

export function hasItem(id: ItemId): boolean {
  return getInventory().includes(id);
}

export function addItem(id: ItemId): boolean {
  const inv = getState().inventory;
  if (inv.includes(id)) return false;
  if (inv.length >= MAX_SLOTS) return false;
  inv.push(id);
  saveSave();
  return true;
}

export function removeItem(id: ItemId): boolean {
  const inv = getState().inventory;
  const idx = inv.indexOf(id);
  if (idx === -1) return false;
  inv.splice(idx, 1);
  saveSave();
  return true;
}

export function getItemMeta(id: ItemId) {
  return ITEMS[id];
}

// Combine recipe lookup
export function tryCombine(a: ItemId, b: ItemId): ItemId | null {
  const recipes = Object.entries(ITEMS).filter(([, meta]) => meta.recipe);
  for (const [resultId, meta] of recipes) {
    const r = meta.recipe!;
    if ((r[0] === a && r[1] === b) || (r[0] === b && r[1] === a)) {
      return resultId as ItemId;
    }
  }
  return null;
}

export function combine(a: ItemId, b: ItemId): ItemId | null {
  const result = tryCombine(a, b);
  if (!result) return null;
  removeItem(a);
  removeItem(b);
  addItem(result);
  return result;
}

// Event subject for HUD to subscribe
type Listener = () => void;
const listeners: Set<Listener> = new Set();
export function onInventoryChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export function notifyInventoryChange(): void {
  listeners.forEach((fn) => fn());
}
