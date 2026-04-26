// Asset registry — keys → public file paths.
// All sprites are CC0 (Ganamoda, OpenGameArt). See public/assets/CREDITS.md.
//
// Splits in v2: PreloadScene loads SHARED + MENU_SPRITES only. Each chapter
// scene loads its own slice in init() to keep first paint snappy.

// ---------- Shared (loaded by PreloadScene) ----------
// Anything used by Menu OR by ≥2 chapters lives here.
export const SHARED_SPRITES = {
  // Floors / walls used widely
  floor1: 'Floor 1.png',
  wall1: 'Wall 1.png',
  // Lighting (used by every chapter)
  lamp1: 'Lamp 1.png',
  // Locker / books shared between Ch1 and Ch2
  locker: 'Locker.png',
  lockerOpen: 'Locker open.png',
  books: 'books.png',
  // Computer station 1 used by Ch1 and Ch4
  computerStation1: 'Computer station 1.png',
  // Wall+window porthole used by Ch1 and Ch2
  wallWindow: 'Wall and window.png',
  // Cryo pod off used by Ch1 and as scenery in Menu
  cryoPodOff: 'CryoBoxOFF.png',
  // Baril1 used by Ch2/Ch3/Ch4
  baril1: 'Baril 1.png',
} as const;

// ---------- Menu only ----------
export const MENU_SPRITES = {
  // (none chapter-exclusive — menu uses shared assets only)
} as const;

// ---------- Chapter 1 (cryo) ----------
export const CH1_SPRITES = {
  cryoPod: 'CryoBox.png',
  doorClosed: 'Doors 1.png',
  doorClosed2: 'Doors 2.png',
  doorOpen: 'Open Door.png',
  doorSmall: 'door.png',
  wallPipes: 'Wall pipes.png',
  phone: 'Phone 1.png',
  sticker1: 'Sticker 1.png',
  // Misc tweakable scene props (kept for safety even if not directly named in code)
  bed: 'Bed.png',
  pillars: 'Pillars.png',
  pillarDestroyed: 'Pillar destroyed.png',
} as const;

// ---------- Chapter 2 (greenhouse) ----------
export const CH2_SPRITES = {
  floor2: 'Floor 2.png',
  wall4Light: 'Wall 4 Light.png',
  books2: 'Books 2.png',
  baril2: 'Baril 2.png',
  baril3: 'Baril 3.png',
  greenBarrel: 'Green Barrel.png',
  // Plants (greenhouse-only)
  green00: 'plants/GREEN_00.png',
  green05: 'plants/GREEN_05.png',
  green09: 'plants/GREEN_09.png',
  green18: 'plants/GREEN_18.png',
  bush1: 'plants/BUSH_01.png',
  bush2: 'plants/BUSH_02.png',
  orange1: 'plants/ORANGE_01.png',
} as const;

// ---------- Chapter 3 (workshop) ----------
export const CH3_SPRITES = {
  floor3: 'Floor 3.png',
  wall5: 'Wall 5.png',
  pipe: 'Pipe.png',
  pipe2: 'Pipe2.png',
  pipe3: 'Pipe3.png',
  board: 'Board 1.png',
  machine1: 'Machine 1.png',
  machine2: 'Machine 2.png',
  machine3: 'Machine 3.png',
  smallMachine1: 'Small Machine 1.png',
  smallMachine2: 'Small Machine 2.png',
  smallMachine3: 'Small Machine 3.png',
  randomDevice: 'Random device.png',
  randomDevice2: 'Random Device 2.png',
  randomDevice3: 'Random Device 3.png',
  computerStation2: 'Computer station 2.png',
  // Misc workshop bits (referenced loosely by other code)
  computer1: 'Computer 1.png',
  computer2: 'Computer 2.png',
  bioComputer: 'BioComputer.png',
  handScanner: 'Hand scanner.png',
  laboratoryDevice: 'Laboratory device.png',
  medicalDevice: 'Medical Device.png',
  electricPanel: 'Wall electric pannel 1.png',
  wallbox: 'Wallbox 1.png',
  wallCover: 'Wall cover.png',
  wallCover2: 'Wall cover 2.png',
} as const;

// ---------- Chapter 4 (cupola) ----------
export const CH4_SPRITES = {
  chair: 'Chair.png',
  wallDevice: 'Wall device.png',
  // Various window/screen props that might decorate the cupola
  window1: 'Window 1.png',
  window2: 'Window 2.png',
  window5: 'Window 5.png',
  screenInfo1: 'Screen info 1.png',
  screenInfo2: 'Screen info 2.png',
  screenInfo3: 'Screen info 3.png',
  neutralScreen: 'Neutral screen.png',
  surprisedScreen: 'Surprised screen.png',
  smallDevice: 'Small Device.png',
  screenDevice: 'Screen device.png',
  mark1: 'Mark 1.png',
  neon: 'Neon.png',
  wall7: 'Wall 7.png',
  wall7Light: 'Wall 7 Light.png',
  postIt: 'post it.png',
  sticker2: 'Sticker 2.png',
  socle: 'Socle 1.png',
  healthPack: 'Health Pack 1.png',
} as const;

// ---------- Aggregate (back-compat for any code that imports SPRITES / PLANTS) ----------
export const SPRITES = {
  ...SHARED_SPRITES,
  ...MENU_SPRITES,
  ...CH1_SPRITES,
  ...CH2_SPRITES,
  ...CH3_SPRITES,
  ...CH4_SPRITES,
} as const;

// Plants kept for backward-compat with PreloadScene code that referenced them.
// They live in CH2_SPRITES now; this re-export filters to plant entries.
export const PLANTS = {
  green00: CH2_SPRITES.green00,
  green05: CH2_SPRITES.green05,
  green09: CH2_SPRITES.green09,
  green18: CH2_SPRITES.green18,
  bush1: CH2_SPRITES.bush1,
  bush2: CH2_SPRITES.bush2,
  orange1: CH2_SPRITES.orange1,
} as const;

export type SpriteKey = keyof typeof SPRITES;
export type PlantKey = keyof typeof PLANTS;

export const ASSETS_BASE = './assets/sprites/';
