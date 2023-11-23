
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

interface FallingState{
  isFalling(): boolean;
  isReseting(): boolean;

  moveHorizontal(tile: Tile, dx: number): void;
}

interface Tile {
  isFlux(): boolean;
  isUnbreakable(): boolean;
  isPlayer(): boolean;
  isStone(): boolean;
  isFallingStone(): boolean;
  isBox(): boolean;
  isFallingBox(): boolean;
  isKey1(): boolean;
  isLock1(): boolean;
  isKey2(): boolean;
  isLock2(): boolean;
  isAir(): boolean;

  draw(g: CanvasRenderingContext2D, x: number, y: number): void;

  isEdible(): boolean;
  isPushable(): boolean;

  moveHorizontal(dx : number): void;
  moveVertical(dy : number): void;

  isStony(): boolean;
  isBoxy(): boolean;

  drop(): void;
  rest(): void;

  update(X : number, y : number): void;
}

interface RemoveStrategy {
  check(tile : Tile) : boolean;
}

class RemoveLock1 implements RemoveStrategy{
  check(tile : Tile) {
    return tile.isLock1();
  }
}

class RemoveLock2 implements RemoveStrategy{
  check(tile : Tile) {
    return tile.isLock2();
  }
}

class FallStrategy {
  constructor(private falling: FallingState)
  {

  }
  getFalling() { return this.falling;}
  isFalling() { return this.falling; }
  update(tile : Tile, x : number, y : number) {
    this.falling = map[y + 1][x].isAir() ? new Falling() : new Resting();
  this.drop(tile, x, y);
  }
  private drop(tile : Tile, x : number, y : number)
  {
    if(this.falling.isFalling()) {
      map[y + 1][x] = tile;
      map[y][x] = new Air();
    }
  }
}

class Falling implements FallingState {
  isFalling() {return true;}
  isReseting() {return false;}

  moveHorizontal(tile: Tile, dx: number) {
    
  }
}

class Resting implements FallingState {
  isFalling() {return false;}
  isReseting() {return true;}
  moveHorizontal(tile: Tile, dx: number) {
      if(map[playery][playerx + dx + dx].isAir()
    && !map[playery + 1][playerx + dx].isAir()) {
    map[playery][playerx + dx + dx] = map[playery][playerx + dx];
    moveToTile(playerx + dx, playery);
      }
  }
}

class Flux implements Tile {
  private falling: boolean;
  constructor() {
    this.falling = false;
  }
  isFlux() {
    return true;
  }
  isUnbreakable() {
    return false;
  }
  isPlayer() {
    return false;
  }
  isStone() {
    return false;
  }
  isFallingStone() {
    return this.falling;
  }
  isBox() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isKey1() {
    return false;
  }
  isLock1() {
    return false;
  }
  isKey2() {
    return false;
  }
  isLock2() {
    return false;
  }
  isAir() {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible() { return true; }
  isPushable() { return false; }

  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  drop() {}
  rest() {}

  update(x : number, y : number) {}
  
}

class Unbreakable implements Tile {
  private falling: boolean;
  constructor() {
    this.falling = false;
  }
  isFlux() {
    return false;
  }
  isUnbreakable() {
    return true;
  }
  isPlayer() {
    return false;
  }
  isStone() {
    return false;
  }
  isFallingStone() {
    return this.falling;
  }
  isBox() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isKey1() {
    return false;
  }
  isLock1() {
    return false;
  }
  isKey2() {
    return false;
  }
  isLock2() {
    return false;
  }
  isAir() {
    return false;
  }
  
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible() { return false; }
  isPushable() { return false; }

  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  drop() {}
  rest() {}

  update(x : number, y : number) {}
}

class Player implements Tile {
  private falling: boolean;
  constructor() {
    this.falling = false;
  }
  isFlux() {
    return false;
  }
  isUnbreakable() {
    return false;
  }
  isPlayer() {
    return true;
  }
  isStone() {
    return false;
  }
  isFallingStone() {
    return this.falling;
  }
  isBox() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isKey1() {
    return false;
  }
  isLock1() {
    return false;
  }
  isKey2() {
    return false;
  }
  isLock2() {
    return false;
  }
  isAir() {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {

  }

    isEdible() { return false; }
  isPushable() { return false; }

  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  drop() {}
  rest() {}

  update(x : number, y : number) {}
}

class Stone implements Tile {
  private falling: FallingState;
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.falling = falling;
    this.fallStrategy = new FallStrategy(falling);
  }
  isFlux() {
    return false;
  }
  isUnbreakable() {
    return false;
  }
  isPlayer() {
    return false;
  }
  isStone() {
    return true;
  }
  isFallingStone() {
    return this.falling.isFalling();
  }
  isBox() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isKey1() {
    return false;
  }
  isLock1() {
    return false;
  }
  isKey2() {
    return false;
  }
  isLock2() {
    return false;
  }
  isAir() {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible() { return false; }
  isPushable() { return true; }

  moveHorizontal(dx: number) {
    this.fallStrategy.getFalling().moveHorizontal(this, dx);
  }
  moveVertical(dy: number) {}
  isStony() {
    return true;
  }
  isBoxy() {
    return false;
  }
  drop() { this.falling = new Falling();}
  rest() { this.falling = new Resting();}

  update(x : number, y : number) {
   this.fallStrategy.update(this, x, y);
  }
}

class Box implements Tile {
  private falling: FallingState;
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.falling = falling;
    this.fallStrategy = new FallStrategy(falling);
  }
  isFlux() {
    return false;
  }
  isUnbreakable() {
    return false;
  }
  isPlayer() {
    return false;
  }
  isStone() {
    return false;
  }
  isFallingStone() {
    return false;
  }
  isBox() {
    return true;
  }
  isFallingBox() {
    return this.falling.isFalling();
  }
  isKey1() {
    return false;
  }
  isLock1() {
    return false;
  }
  isKey2() {
    return false;
  }
  isLock2() {
    return false;
  }
  isAir() {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible() { return false; }
  isPushable() { return true; }

  moveHorizontal(dx: number) {
    this.fallStrategy.getFalling().moveHorizontal(this, dx);
  }
  moveVertical(dy: number) {}
  isStony() {
    return false;
  }
  isBoxy() {
    return true;
  }
  drop() {}
  rest() {}

  update(x : number, y : number) {
    this.fallStrategy.update(this, x, y);
   }
}

class Key implements Tile {
  private falling: boolean;
  constructor(private keyConf : KeyConfiguration) {
    this.falling = false;
  }
  isFlux() {
    return false;
  }
  isUnbreakable() {
    return false;
  }
  isPlayer() {
    return false;
  }
  isStone() {
    return false;
  }
  isFallingStone() {
    return this.falling;
  }
  isBox() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isKey1() {
    return true;
  }
  isLock1() {
    return false;
  }
  isKey2() {
    return false;
  }
  isLock2() {
    return false;
  }
  isAir() {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.keyConf.getColor();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible() { return false; }
  isPushable() { return false; }

  moveHorizontal(dx: number) {
    remove(this.keyConf.getRemoveStrategy());
    moveToTile(playerx + dx, playery);
  }

  moveVertical(dy: number) {
    remove(this.keyConf.getRemoveStrategy());
    moveToTile(playerx, playery + dy);
  }
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  drop() {}
  rest() {}

  update(x : number, y : number) {}
}

class Lock1 implements Tile {
  private falling: boolean;
  constructor(private keyConf : KeyConfiguration) {
    this.falling = false;
  }
  isFlux() {
    return false;
  }
  isUnbreakable() {
    return false;
  }
  isPlayer() {
    return false;
  }
  isStone() {
    return false;
  }
  isFallingStone() {
    return this.falling;
  }
  isBox() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isKey1() {
    return false;
  }
  isLock1() {
    return this.keyConf.is1();
  }
  isKey2() {
    return false;
  }
  isLock2() {
    return !this.keyConf.is1();
  }
  isAir() {
    return false;
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = this.keyConf.getColor();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible() { return false; }
  isPushable() { return false; }

  moveHorizontal(dx: number) {}
  moveVertical(dy: number) {}
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  drop() {}
  rest() {}

  update(x : number, y : number) {}
}

class Air implements Tile {
  private falling: boolean;
  constructor() {
    this.falling = false;
  }
  isFlux() {
    return false;
  }
  isUnbreakable() {
    return false;
  }
  isPlayer() {
    return false;
  }
  isStone() {
    return false;
  }
  isFallingStone() {
    return this.falling;
  }
  isBox() {
    return false;
  }
  isFallingBox() {
    return false;
  }
  isKey1() {
    return false;
  }
  isLock1() {
    return false;
  }
  isKey2() {
    return false;
  }
  isLock2() {
    return false;
  }
  isAir() {
    return true;
  }
  
  draw(g: CanvasRenderingContext2D, x: number, y: number) {

  }

  isEdible() { return true; }
  isPushable() { return false; }

  moveHorizontal(dx: number) {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }
  isStony() {
    return false;
  }
  isBoxy() {
    return false;
  }
  drop() {}
  rest() {}

  update(x : number, y : number) {}
}

enum RawInput {
  UP, DOWN, LEFT, RIGHT
}

interface Input {
  handle(): void;
}

class Right implements Input {
  handle() {
    moveHorizontal(1);
  }
}

class Left implements Input {
  handle() {
    moveHorizontal(-1);
  }
}

class Up implements Input {
  handle() {
    moveVertical(-1);
  }
}

class Down implements Input {
  handle() {
    moveVertical(1);
  }
}

let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map: Tile[][];
function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}

class KeyConfiguration {
  constructor(private color : string, private _1 : boolean, private removeStrategy : RemoveStrategy)
  {

  }
  getColor() {return this.color;}
  is1() {return this._1;}
  getRemoveStrategy() {return this.removeStrategy;}
}

const YELLOW_KEY = new KeyConfiguration("#ffcc00", true, new RemoveLock1());


function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR: return new Air();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.PLAYER: return new Player();
    case RawTile.BOX: return new Box(new Resting());
    case RawTile.FALLING_BOX: new Box(new Falling());
    case RawTile.STONE: return new Stone(new Resting());
    case RawTile.FALLING_STONE: return new Stone(new Falling());
    case RawTile.KEY1: return new Key(YELLOW_KEY);
    case RawTile.LOCK1: return new Lock1(YELLOW_KEY);
    case RawTile.KEY2: return new Key(YELLOW_KEY);
    case RawTile.LOCK2: return new Lock1(YELLOW_KEY);
    case RawTile.FLUX: return new Flux();
    default: return assertExhausted(tile);
  }
}

function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}


let inputs: Input[] = [];

function remove(shouldRemove : RemoveStrategy) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (shouldRemove.check(map[y][x])) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  map[playery][playerx + dx].moveHorizontal(dx);
}

function moveVertical(dy: number) {
  if (map[playery + dy][playerx].isEdible()) {
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey1()) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey2()) {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
}

function update() {
  handleInputs();

  updateMap();
}

function handleInputs() {
  while (inputs.length > 0) {
    let current = inputs.pop();
    current.handle();
  }
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(x, y);
    }
  }
}

function updateTile(x: number, y: number) {
  map[y][x].update(x,y);
}

function draw() {
  let g = createGraphics();

  // Draw map
  drawMap(g);

  // Draw player
  drawPlayer(g);
}
function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}
function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  transformMap();
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});