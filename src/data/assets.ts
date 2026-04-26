// Asset registry — keys → public file paths.
// All sprites are CC0 (Ganamoda, OpenGameArt). See public/assets/CREDITS.md.

export const SPRITES = {
  // Cryo / sci-fi structure
  cryoPod: 'CryoBox.png',
  cryoPodOff: 'CryoBoxOFF.png',
  computerStation1: 'Computer station 1.png',
  computerStation2: 'Computer station 2.png',
  computer1: 'Computer 1.png',
  computer2: 'Computer 2.png',
  bioComputer: 'BioComputer.png',
  doorClosed: 'Doors 1.png',
  doorClosed2: 'Doors 2.png',
  doorOpen: 'Open Door.png',
  doorSmall: 'door.png',
  // Walls & floors
  wall1: 'Wall 1.png',
  wall4Light: 'Wall 4 Light.png',
  wall5: 'Wall 5.png',
  wall7: 'Wall 7.png',
  wall7Light: 'Wall 7 Light.png',
  wallWindow: 'Wall and window.png',
  window1: 'Window 1.png',
  window2: 'Window 2.png',
  window5: 'Window 5.png',
  floor1: 'Floor 1.png',
  floor2: 'Floor 2.png',
  floor3: 'Floor 3.png',
  // Lighting
  lamp1: 'Lamp 1.png',
  neon: 'Neon.png',
  // Furniture
  bed: 'Bed.png',
  chair: 'Chair.png',
  locker: 'Locker.png',
  lockerOpen: 'Locker open.png',
  pillars: 'Pillars.png',
  pillarDestroyed: 'Pillar destroyed.png',
  // Pipes
  pipe: 'Pipe.png',
  pipe2: 'Pipe2.png',
  pipe3: 'Pipe3.png',
  wallPipes: 'Wall pipes.png',
  // Lab devices
  handScanner: 'Hand scanner.png',
  laboratoryDevice: 'Laboratory device.png',
  medicalDevice: 'Medical Device.png',
  machine1: 'Machine 1.png',
  machine2: 'Machine 2.png',
  machine3: 'Machine 3.png',
  smallMachine1: 'Small Machine 1.png',
  smallMachine2: 'Small Machine 2.png',
  smallMachine3: 'Small Machine 3.png',
  randomDevice: 'Random device.png',
  randomDevice2: 'Random Device 2.png',
  randomDevice3: 'Random Device 3.png',
  smallDevice: 'Small Device.png',
  wallDevice: 'Wall device.png',
  screenDevice: 'Screen device.png',
  // Screens
  screenInfo1: 'Screen info 1.png',
  screenInfo2: 'Screen info 2.png',
  screenInfo3: 'Screen info 3.png',
  neutralScreen: 'Neutral screen.png',
  surprisedScreen: 'Surprised screen.png',
  mark1: 'Mark 1.png',
  // Wall props
  electricPanel: 'Wall electric pannel 1.png',
  wallbox: 'Wallbox 1.png',
  wallCover: 'Wall cover.png',
  wallCover2: 'Wall cover 2.png',
  // Books / notes
  books: 'books.png',
  books2: 'Books 2.png',
  board: 'Board 1.png',
  postIt: 'post it.png',
  sticker1: 'Sticker 1.png',
  sticker2: 'Sticker 2.png',
  // Barrels
  baril1: 'Baril 1.png',
  baril2: 'Baril 2.png',
  baril3: 'Baril 3.png',
  greenBarrel: 'Green Barrel.png',
  // Misc
  phone: 'Phone 1.png',
  healthPack: 'Health Pack 1.png',
  socle: 'Socle 1.png',
} as const;

export const PLANTS = {
  green00: 'plants/GREEN_00.png',
  green05: 'plants/GREEN_05.png',
  green09: 'plants/GREEN_09.png',
  green18: 'plants/GREEN_18.png',
  bush1: 'plants/BUSH_01.png',
  bush2: 'plants/BUSH_02.png',
  orange1: 'plants/ORANGE_01.png',
} as const;

export type SpriteKey = keyof typeof SPRITES;
export type PlantKey = keyof typeof PLANTS;

export const ASSETS_BASE = './assets/sprites/';
