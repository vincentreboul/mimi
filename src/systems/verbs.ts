// SCUMM-style verb system. Player selects a verb, then a hotspot.
// Tapping a hotspot first sets it as the "target" and shows its name.
// Then tapping a verb applies that verb to the target.

import type { ItemId } from '../data/items';

export type Verb = 'look' | 'use' | 'pick' | 'talk';

export const VERBS: Verb[] = ['look', 'pick', 'use', 'talk'];

export const VERB_LABELS: Record<Verb, string> = {
  look: 'Regarder',
  pick: 'Prendre',
  use: 'Utiliser',
  talk: 'Parler à',
};

export interface VerbTarget {
  kind: 'hotspot' | 'item';
  id: string; // hotspot label OR item id
  display: string; // human label
}

let _activeVerb: Verb = 'look'; // default verb
let _target: VerbTarget | null = null;
let _selectedItem: ItemId | null = null; // when "Use X with Y" is in progress

const listeners: Set<() => void> = new Set();

export function getActiveVerb(): Verb {
  return _activeVerb;
}

export function setActiveVerb(v: Verb): void {
  _activeVerb = v;
  notify();
}

export function getTarget(): VerbTarget | null {
  return _target;
}

export function setTarget(t: VerbTarget | null): void {
  _target = t;
  notify();
}

export function clearTarget(): void {
  _target = null;
  _selectedItem = null;
  notify();
}

export function getSelectedItem(): ItemId | null {
  return _selectedItem;
}

export function setSelectedItem(id: ItemId | null): void {
  _selectedItem = id;
  notify();
}

export function onChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

/** Build a sentence like "Regarder le pod cryo" or "Utiliser badge avec terminal" */
export function buildSentence(): string {
  const verb = VERB_LABELS[_activeVerb];
  if (!_target) return verb + '...';
  if (_activeVerb === 'use' && _selectedItem) {
    return `Utiliser ${_selectedItem} avec ${_target.display}`;
  }
  return `${verb} ${_target.display}`;
}
