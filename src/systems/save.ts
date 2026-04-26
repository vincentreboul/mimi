// Save state persistence — single localStorage key, JSON blob
const KEY = 'mimi.save.v1';

export type ChapterId = 1 | 2 | 3 | 4;
export type HintLevel = 'normal' | 'plus' | 'minus';
export type FontChoice = 'inter' | 'atkinson';

export interface SaveState {
  v: 1;
  scene: string;
  chapter: ChapterId;
  progress: Record<string, boolean>;
  inventory: string[];
  flags: Record<string, number>;
  startedAt: number;
  updatedAt: number;
  settings: {
    musicVol: number;
    sfxVol: number;
    voiceVol: number;
    hintLevel: HintLevel;
    font: FontChoice;
    reducedMotion: boolean;
  };
}

export function defaultSave(): SaveState {
  return {
    v: 1,
    scene: 'MenuScene',
    chapter: 1,
    progress: {},
    inventory: [],
    flags: {
      veraTrust: 0, // -3..+3
      hintsUsed: 0,
      itemsExamined: 0,
    },
    startedAt: Date.now(),
    updatedAt: Date.now(),
    settings: {
      musicVol: 0.6,
      sfxVol: 0.8,
      voiceVol: 1.0,
      hintLevel: 'normal',
      font: 'inter',
      reducedMotion: false,
    },
  };
}

let _state: SaveState | null = null;

export function loadSave(): SaveState {
  if (_state) return _state;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SaveState;
      if (parsed?.v === 1) {
        _state = parsed;
        return parsed;
      }
    }
  } catch {
    // fall through to default
  }
  _state = defaultSave();
  return _state;
}

export function saveSave(): void {
  if (!_state) return;
  _state.updatedAt = Date.now();
  try {
    localStorage.setItem(KEY, JSON.stringify(_state));
  } catch {
    // localStorage may be full or unavailable — silent
  }
}

export function getState(): SaveState {
  return loadSave();
}

export function setProgress(key: string, value: boolean = true): void {
  const s = getState();
  s.progress[key] = value;
  saveSave();
}

export function hasProgress(key: string): boolean {
  return getState().progress[key] === true;
}

export function setFlag(key: string, value: number): void {
  const s = getState();
  s.flags[key] = value;
  saveSave();
}

export function getFlag(key: string, defaultValue = 0): number {
  return getState().flags[key] ?? defaultValue;
}

export function incFlag(key: string, by: number = 1): number {
  const v = getFlag(key) + by;
  setFlag(key, v);
  return v;
}

export function setScene(scene: string, chapter?: ChapterId): void {
  const s = getState();
  s.scene = scene;
  if (chapter) s.chapter = chapter;
  saveSave();
}

export function resetSave(): void {
  _state = defaultSave();
  saveSave();
}

export function getSettings() {
  return getState().settings;
}

export function setSetting<K extends keyof SaveState['settings']>(key: K, value: SaveState['settings'][K]): void {
  const s = getState();
  s.settings[key] = value;
  saveSave();
}
