// Save state persistence — single localStorage key, JSON blob
const KEY = 'kora.save.v2';

export type ChapterId = 1 | 2 | 3 | 4;
export type HintLevel = 'normal' | 'plus' | 'minus';
export type FontChoice = 'inter' | 'atkinson';
export type AgeBracket = 'kid' | 'teen' | 'young' | 'adult' | 'senior'; // 8-12 / 13-17 / 18-29 / 30-49 / 50+
export type Gender = 'f' | 'm' | 'nb';

export interface SaveState {
  v: 2;
  scene: string;
  chapter: ChapterId;
  progress: Record<string, boolean>;
  inventory: string[];
  flags: Record<string, number>;
  startedAt: number;
  updatedAt: number;
  player: {
    name: string;
    ageBracket: AgeBracket;
    gender: Gender;
  };
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
    v: 2,
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
    player: {
      name: '',
      ageBracket: 'teen',
      gender: 'nb',
    },
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
      if (parsed?.v === 2) {
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

export function getPlayer() {
  return getState().player;
}

export function setPlayer(name: string, ageBracket: AgeBracket, gender: Gender): void {
  const s = getState();
  s.player.name = name;
  s.player.ageBracket = ageBracket;
  s.player.gender = gender;
  saveSave();
}

export function hasPlayer(): boolean {
  return getState().player.name.length > 0;
}
