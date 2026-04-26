// Save system v3 — 3 slots, active slot routing, JSON export/import, v2 migration.
// Backward-compat: all v2-era exports (setProgress, getPlayer, etc.) route to the active slot.

const KEY_V3 = 'kora.save.v3';
const KEY_V2_LEGACY = 'kora.save.v2';

// ---------- Types ----------

export type Profile = 'ELISE-ROMIE' | 'IOLAS';
export type Difficulty = 'EXPLORATEUR' | 'AVENTURIER' | 'ARCHIVISTE';
export type VisualHints = 'vif' | 'subtil' | 'aucun';
export type Ending = 'evasion' | 'rester' | 'ascension' | 'archive';
export type ChapterId = 1 | 2 | 3 | 4 | 5;

// Legacy types preserved for compat with PlayerSetupScene & v2 migration.
export type AgeBracket = 'kid' | 'teen' | 'young' | 'adult' | 'senior';
export type Gender = 'f' | 'm' | 'nb';
export type HintLevel = 'normal' | 'plus' | 'minus';
export type FontChoice = 'inter' | 'atkinson';

export interface SaveSlot {
  schemaVersion: 3;
  scene: string;
  chapter: ChapterId;
  progress: Record<string, boolean>;
  inventory: string[];
  flags: Record<string, number>;
  startedAt: number;
  updatedAt: number;
  player: { name: string; profile: Profile; createdAt: number };
  fragments: Record<number, string[]>;          // chapterId → fragment ids
  assertions: Record<string, { tiles: string[]; locked: boolean; revised?: boolean }>;
  secrets: string[];                             // secret ids found
  endings: Ending[];                             // endings achieved (deduped)
  achievements: string[];                        // achievement ids
  timeSpent: number;                             // ms played in this slot
  ngPlus: { unlocked: boolean; currentChapter: ChapterId };
  settings: {
    musicVol: number;
    sfxVol: number;
    voiceVol: number;
    reducedMotion: boolean;
    difficulty: Difficulty;
    visualHints: VisualHints;
    // KEEP for compat (legacy code may still read):
    hintLevel: HintLevel;
    font: FontChoice;
  };
}

export interface RootSave {
  schemaVersion: 3;
  slots: [SaveSlot | null, SaveSlot | null, SaveSlot | null];
  activeSlot: 0 | 1 | 2;
}

// ---------- Defaults ----------

export function defaultSlot(profile: Profile = 'ELISE-ROMIE'): SaveSlot {
  const now = Date.now();
  return {
    schemaVersion: 3,
    scene: 'MenuScene',
    chapter: 1,
    progress: {},
    inventory: [],
    flags: {
      veraTrust: 0,
      hintsUsed: 0,
      itemsExamined: 0,
    },
    startedAt: now,
    updatedAt: now,
    player: { name: '', profile, createdAt: now },
    fragments: {},
    assertions: {},
    secrets: [],
    endings: [],
    achievements: [],
    timeSpent: 0,
    ngPlus: { unlocked: false, currentChapter: 1 },
    settings: {
      musicVol: 0.6,
      sfxVol: 0.8,
      voiceVol: 1.0,
      reducedMotion: false,
      difficulty: 'AVENTURIER',
      visualHints: 'subtil',
      hintLevel: 'normal',
      font: 'inter',
    },
  };
}

// ---------- v2 → v3 migration ----------

interface LegacyV2 {
  v: 2;
  scene: string;
  chapter: number;
  progress: Record<string, boolean>;
  inventory: string[];
  flags: Record<string, number>;
  startedAt: number;
  updatedAt: number;
  player: { name: string; ageBracket?: AgeBracket; gender?: Gender };
  settings: {
    musicVol: number;
    sfxVol: number;
    voiceVol: number;
    hintLevel: HintLevel;
    font: FontChoice;
    reducedMotion: boolean;
  };
}

function migrateV2ToSlot(v2: LegacyV2): SaveSlot {
  const fresh = defaultSlot(v2.player?.gender === 'f' ? 'ELISE-ROMIE' : 'IOLAS');
  // Preserve all carry-over data
  fresh.scene = v2.scene ?? fresh.scene;
  fresh.chapter = (Math.min(Math.max(v2.chapter ?? 1, 1), 5) as ChapterId);
  fresh.progress = { ...(v2.progress ?? {}) };
  fresh.inventory = [...(v2.inventory ?? [])];
  fresh.flags = { ...fresh.flags, ...(v2.flags ?? {}) };
  fresh.startedAt = v2.startedAt ?? fresh.startedAt;
  fresh.updatedAt = v2.updatedAt ?? fresh.updatedAt;
  fresh.player.name = v2.player?.name ?? '';
  fresh.player.profile = v2.player?.gender === 'f' ? 'ELISE-ROMIE' : 'IOLAS';
  fresh.settings = {
    ...fresh.settings,
    musicVol: v2.settings?.musicVol ?? fresh.settings.musicVol,
    sfxVol: v2.settings?.sfxVol ?? fresh.settings.sfxVol,
    voiceVol: v2.settings?.voiceVol ?? fresh.settings.voiceVol,
    reducedMotion: v2.settings?.reducedMotion ?? fresh.settings.reducedMotion,
    hintLevel: v2.settings?.hintLevel ?? fresh.settings.hintLevel,
    font: v2.settings?.font ?? fresh.settings.font,
  };
  return fresh;
}

// ---------- Persistence ----------

let _root: RootSave | null = null;

function loadRoot(): RootSave {
  if (_root) return _root;

  // v3 priority
  const v3raw = (() => { try { return localStorage.getItem(KEY_V3); } catch { return null; } })();
  if (v3raw) {
    try {
      const v3 = JSON.parse(v3raw);
      if (v3?.schemaVersion === 3 && Array.isArray(v3.slots) && v3.slots.length === 3) {
        _root = v3 as RootSave;
        return _root;
      }
    } catch {}
  }

  // v2 fallback → migrate
  const v2raw = (() => { try { return localStorage.getItem(KEY_V2_LEGACY); } catch { return null; } })();
  if (v2raw) {
    try {
      const v2 = JSON.parse(v2raw) as LegacyV2;
      if (v2?.v === 2) {
        const slot = migrateV2ToSlot(v2);
        const root: RootSave = { schemaVersion: 3, slots: [slot, null, null], activeSlot: 0 };
        _root = root;
        // Synchronous write — must succeed BEFORE removing v2 key, else risk data loss
        try {
          localStorage.setItem(KEY_V3, JSON.stringify(root));
          localStorage.removeItem(KEY_V2_LEGACY);
        } catch {
          // If write failed (quota/unavailable), keep v2 key intact for next attempt.
        }
        return _root;
      }
    } catch {}
  }

  // Empty
  _root = { schemaVersion: 3, slots: [null, null, null], activeSlot: 0 };
  return _root;
}

let _saveTimer: ReturnType<typeof setTimeout> | null = null;
function persist(root: RootSave): void {
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY_V3, JSON.stringify(root));
    } catch {
      // localStorage full / unavailable — silent
    }
  }, 300);
}

function persistNow(): void {
  if (!_root) return;
  if (_saveTimer) { clearTimeout(_saveTimer); _saveTimer = null; }
  try { localStorage.setItem(KEY_V3, JSON.stringify(_root)); } catch {}
}

function touchSlot(slot: SaveSlot): void {
  slot.updatedAt = Date.now();
}

// ---------- Slot management ----------

export function getActiveSlot(): SaveSlot {
  const root = loadRoot();
  let slot = root.slots[root.activeSlot];
  if (!slot) {
    slot = defaultSlot();
    root.slots[root.activeSlot] = slot;
    persist(root);
  }
  return slot;
}

export function setActiveSlot(i: 0 | 1 | 2): void {
  const root = loadRoot();
  root.activeSlot = i;
  persist(root);
}

export function getAllSlots(): (SaveSlot | null)[] {
  return [...loadRoot().slots];
}

export function createSlot(i: 0 | 1 | 2, profile: Profile, name: string): SaveSlot {
  const root = loadRoot();
  const slot = defaultSlot(profile);
  slot.player.name = name;
  root.slots[i] = slot;
  root.activeSlot = i;
  persist(root);
  return slot;
}

export function deleteSlot(i: 0 | 1 | 2): void {
  const root = loadRoot();
  root.slots[i] = null;
  // If we just deleted the active slot, fall back to the first non-null one (or 0).
  if (root.activeSlot === i) {
    const next = root.slots.findIndex((s) => s !== null);
    root.activeSlot = (next >= 0 ? next : 0) as 0 | 1 | 2;
  }
  persist(root);
}

export function exportToJSON(): string {
  return JSON.stringify(loadRoot(), null, 2);
}

export function importFromJSON(json: string): { ok: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (parsed?.schemaVersion !== 3 || !Array.isArray(parsed.slots) || parsed.slots.length !== 3) {
      return { ok: false, error: 'Format invalide (v3 attendu).' };
    }
    _root = parsed as RootSave;
    persistNow();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'parse error' };
  }
}

// ---------- v3 specific accessors ----------

export function addFragment(chapterId: ChapterId, fragmentId: string): void {
  const slot = getActiveSlot();
  const arr = slot.fragments[chapterId] ?? [];
  if (!arr.includes(fragmentId)) {
    arr.push(fragmentId);
    slot.fragments[chapterId] = arr;
    touchSlot(slot);
    persist(loadRoot());
  }
}

export function hasFragment(chapterId: ChapterId, fragmentId: string): boolean {
  return (getActiveSlot().fragments[chapterId] ?? []).includes(fragmentId);
}

export function setAssertion(id: string, tiles: string[], locked: boolean, revised?: boolean): void {
  const slot = getActiveSlot();
  slot.assertions[id] = { tiles: [...tiles], locked, revised };
  touchSlot(slot);
  persist(loadRoot());
}

export function getAssertion(id: string): { tiles: string[]; locked: boolean; revised?: boolean } | null {
  return getActiveSlot().assertions[id] ?? null;
}

export function addSecret(id: string): void {
  const slot = getActiveSlot();
  if (!slot.secrets.includes(id)) {
    slot.secrets.push(id);
    touchSlot(slot);
    persist(loadRoot());
  }
}

export function hasSecret(id: string): boolean {
  return getActiveSlot().secrets.includes(id);
}

export function addEnding(e: Ending): void {
  const slot = getActiveSlot();
  if (!slot.endings.includes(e)) {
    slot.endings.push(e);
    touchSlot(slot);
    persist(loadRoot());
  }
}

/** Mark NG+ as unlocked on the active slot (so MenuScene can show the NG+ entry). */
export function unlockNGPlus(): void {
  const slot = getActiveSlot();
  if (!slot.ngPlus.unlocked) {
    slot.ngPlus.unlocked = true;
    touchSlot(slot);
    persist(loadRoot());
  }
}

export function addAchievement(id: string): void {
  const slot = getActiveSlot();
  if (!slot.achievements.includes(id)) {
    slot.achievements.push(id);
    touchSlot(slot);
    persist(loadRoot());
  }
}

export function hasAchievement(id: string): boolean {
  return getActiveSlot().achievements.includes(id);
}

// ---------- Backward-compat wrappers (route to active slot) ----------

// Legacy SaveState shape (v2). Some objects (e.g. inventory.ts) reach into `state.inventory`
// directly via getState(); we expose a v2-shaped facade pointing at the active slot.
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

/**
 * Returns the active slot. Cast to `SaveState` for any legacy reader expecting v2 shape —
 * the underlying object IS the active slot, so mutations go straight through.
 */
export function loadSave(): SaveSlot {
  return getActiveSlot();
}

export function saveSave(): void {
  if (!_root) return;
  const slot = _root.slots[_root.activeSlot];
  if (slot) touchSlot(slot);
  persist(_root);
}

/**
 * v2 compatibility shim. Returns the active slot. Most legacy callers used this
 * to read `.inventory`, `.scene`, `.chapter`, etc. — those keys exist on SaveSlot too.
 */
export function getState(): SaveSlot {
  return getActiveSlot();
}

export function defaultSave(): SaveSlot {
  return defaultSlot();
}

export function setProgress(key: string, value: boolean = true): void {
  const slot = getActiveSlot();
  slot.progress[key] = value;
  touchSlot(slot);
  persist(loadRoot());
}

export function hasProgress(key: string): boolean {
  return getActiveSlot().progress[key] === true;
}

export function setFlag(key: string, value: number): void {
  const slot = getActiveSlot();
  slot.flags[key] = value;
  touchSlot(slot);
  persist(loadRoot());
}

export function getFlag(key: string, defaultValue = 0): number {
  return getActiveSlot().flags[key] ?? defaultValue;
}

export function incFlag(key: string, by: number = 1): number {
  const v = getFlag(key) + by;
  setFlag(key, v);
  return v;
}

export function setScene(scene: string, chapter?: ChapterId): void {
  const slot = getActiveSlot();
  slot.scene = scene;
  if (chapter) slot.chapter = chapter;
  touchSlot(slot);
  persist(loadRoot());
}

export function resetSave(): void {
  // Reset only the ACTIVE slot — other slots are preserved.
  const root = loadRoot();
  root.slots[root.activeSlot] = defaultSlot();
  persistNow();
}

export function getSettings() {
  return getActiveSlot().settings;
}

export function setSetting<K extends keyof SaveSlot['settings']>(key: K, value: SaveSlot['settings'][K]): void {
  const slot = getActiveSlot();
  slot.settings[key] = value;
  touchSlot(slot);
  persist(loadRoot());
}

export function getPlayer() {
  // Returns a v2-shaped player view (name, ageBracket, gender) for legacy callers,
  // augmented with `profile` / `createdAt` for new code.
  const slot = getActiveSlot();
  const p = slot.player;
  // Synthesise a "gender" from the profile (best-effort — v3 dropped explicit gender).
  const gender: Gender = p.profile === 'ELISE-ROMIE' ? 'f' : 'm';
  return {
    name: p.name,
    profile: p.profile,
    createdAt: p.createdAt,
    ageBracket: 'young' as AgeBracket,
    gender,
  };
}

/** Legacy signature kept working — used by PlayerSetupScene. */
export function setPlayer(name: string, _ageBracket: AgeBracket, gender: Gender): void {
  const slot = getActiveSlot();
  slot.player.name = name;
  slot.player.profile = gender === 'f' ? 'ELISE-ROMIE' : 'IOLAS';
  if (!slot.player.createdAt) slot.player.createdAt = Date.now();
  touchSlot(slot);
  persist(loadRoot());
}

/** New v3-friendly setter. */
export function setPlayerProfile(profile: Profile, name: string): void {
  const slot = getActiveSlot();
  slot.player.name = name;
  slot.player.profile = profile;
  if (!slot.player.createdAt) slot.player.createdAt = Date.now();
  touchSlot(slot);
  persist(loadRoot());
}

export function hasPlayer(): boolean {
  return getActiveSlot().player.name.length > 0;
}
