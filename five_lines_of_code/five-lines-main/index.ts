
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

interface RawTileValue {
  transform() : Tile;
}
class AirValue implements RawTileValue {
  transform() {
    return new Air();
  }
}
class FluxValue implements RawTileValue {
  transform() {
    return new Flux();
  }
}
class UnbreakableValue implements RawTileValue {
  transform() {
    return new Unbreakable();
  }
}
class PlayerValue implements RawTileValue {
  transform() {
    return new Player();
  }
}
class StoneValue implements RawTileValue {
  transform() {
    return new Stone(new Resting());
  }
}
class FallingStoneValue implements RawTileValue {
  transform() {
    return new Stone(new Falling());
  }
}
class BoxValue implements RawTileValue {
  transform() {
    return new Box(new Resting());
  }
}
class FallingBoxValue implements RawTileValue {
  transform() {
    return new Box(new Faaling());
  }
}
class Key1Value implements RawTileValue {
  transform() {
    return new Key(YELLOW_KEY);
  }
}
class Lock1Value implements RawTileValue {
  transform() {
    return new Lock1(YELLOW_KEY);
  }
}
class Key2Value implements RawTileValue {
  transform() {
    return new Key(YELLOW_KEY);
  }
}
class Lock2Value implements RawTileValue {
  transform() {
    return new Lock1(YELLOW_KEY);
  }
}

class RawTile2 {
  static readonly AIR = new RawTile2(new AirValue());
  static readonly FLUX = new RawTile2(new FluxValue());
  static readonly UNBREAKABLE = new RawTile2(new UnbreakableValue());
  static readonly PLAYER = new RawTile2(new PlayerValue());
  static readonly STONE = new RawTile2(new StoneValue());
  static readonly FALLING_STONE = new RawTile2(new FallingStoneValue());
  static readonly BOX = new RawTile2(new BoxValue());
  static readonly FALLING_BOX = new RawTile2(new FallingBoxValue());
  static readonly KEY1 = new RawTile2(new Key1Value());
  static readonly LOCK1 = new RawTile2(new Lock1Value());
  static readonly KEY2 = new RawTile2(new Key2Value());
  static readonly LOCK2 = new RawTile2(new Lock2Value());
  transform() {
    return this.value.transform();
  }
  //
  //
  //
  private constructor(private value : RawTileValue) {}
}
enum RAW_TILES {
  RawTile2.AIR,
  RawTile2.FLUX,
  RawTile2.UNBREAKABLE,
  RawTile2.PLAYER,
  RawTile2.STONE, RawTile2.FALLING_STONE,
  RawTile2.BOX, RawTile2.FALLING_BOX,
  RawTile2.KEY1, RawTile2.LOCK1,
  RawTile2.KEY2, RawTile2.LOCK2
}

interface FallingState{
  isFalling(): boolean;
  isReseting(): boolean;

  moveHorizontal(tile: Tile, dx: number): void;

  drop(map : Map, tile : Tile, x : number, y : number) : void;
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

  moveHorizontal(map : Map, player : Player, dx : number): void;
  moveVertical(map : Map, player : Player, dy : number): void;

  isStony(): boolean;
  isBoxy(): boolean;

  drop(): void;
  rest(): void;

  update(map : Map, X : number, y : number): void;

  getBlockOnTopState() : FallingState;
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
  moveHorizontal(tile : Tile, dx : number) {
    this.falling.moveHorizontal(tile, dx);
  }
  isFalling() { return this.falling; }
  update(tile : Tile, x : number, y : number) {
    this.falling = map.getBlockOnTopState(x, y + 1);
    this.falling.drop(tile, x, y);
  }
}

class Falling implements FallingState {
  isFalling() {return true;}
  isReseting() {return false;}

  moveHorizontal(tile: Tile, dx: number) {
  
  }
  drop(map : Map, tile : Tile, x : number, y : number) {
    map.drop(tile, x, y);
  }
}

class Resting implements FallingState {
  isFalling() {return false;}
  isReseting() {return true;}
  moveHorizontal(player : Player, tile: Tile, dx: number) {
      player.pushHorizontal(tile, dx);
  }

  drop(tile : Tile, x : number, y : number) {}
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

class PlayerTile implements Tile {
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
    this.fallStrategy.moveHorizontal(this, dx);
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

  getBlockOnTopState() {return new Resting();}
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
    this.fallStrategy.moveHorizontal(this, dx);
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
    this.keyConf.setColor(g);
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  isEdible() { return false; }
  isPushable() { return false; }

  moveHorizontal(dx: number) {
    this.keyConf.removeLock();
    moveToTile(playerx + dx, playery);
  }

  moveVertical(dy: number) {
    this.keyConf.removeLock();
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
    this.keyConf.setColor(g);
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

  getBlockOnTopState() {
    return new Falling();
  }
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

class Player {
  private x = 1;
  private y = 1;

  draw(g : CanvasRenderingContext2D) {
    g.fillStyle = "#ff0000";
    g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map : Map, dx : number) {
    map.moveHorizontal(this, this.x, this.y, dx);
  }
  moveVertical(map : Map, dy : number) {
    map.moveVertical(this, this.x, this.y, dy);
  }
  move(dx : number, dy : number) {
    this.moveToTile(this.x + dx, this.y + dy);
  }
  pushHorizontal(map : Map, tile : Tile, dx : number) {
    map.pushHorizontal(this, tile, this.x, this.y, dx);
  }
  moveToTile(map : Map, newx : number, newy : number) {
    map.movePlayer(this.x, this.y, newx, newy);
    this.x = newx;
    this.y = newy;
  }
}
let map = new Map();

let player = new Player();

let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

class Map {
  private map : Tile[][];
  pushHorizontal(player : Player, tile : Tile, x : number, y : number, dx : number) {
    if ( this.map.isAir() && !this.map.isAir()) {
      this.map[y][x + dx + dx] = tile;
      player.moveToTile(this.x+dx, this.y);
    }
  }

  remove(shouldRemove : RemoveStrategy) {
    for (let y = 0; y < this.map.length; y++) {
    for (let x = 0; x < this.map[y].length; x++) {
      if (shouldRemove.check(this.map[y][x])) {
        this.map[y][x] = new Air();
      }
    }
  }for (let y = 0; y < map.getMap().length; y++) {
    for (let x = 0; x < map.getMap()[y].length; x++) {
      if (shouldRemove.check(map.getMap()[y][x])) {
        map.getMap()[y][x] = new Air();
      }
    }
  }
  }
  isAir(x : number, y : number) {
    return this.map[y][x].isAir();
  }

  setTile(x : number, y : number, tile : Tile) {
    this.map[y][x] = tile;
  }

  movePlayer(x : number, y : number, newx : number, newy : number) {
    this.map[y][x] = new Air();
    this.map[newx][newy] = new PlayerTile();
  }
  constructor() {
    this.map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
      this.map[y] = new Array(rawMap[y].length);
      for (let x = 0; x < rawMap[y].length; x++) {
        this.map[y][x] = transformTile(RawTile2[rawMap[y][x]]);
      }
    }
  }

  moveHorizontal(player : Player, x : number, y : number, dx : number) {
    this.map[y][x + dx].moveHorizontal(this, player, dx);
  }

  moveVertical(player : Player, x : number, y : number, dy : number) {
    this.map[y + dy][x].moveVertical(this, player, dy);
  }

  update() {
    for (let y = this.map.length - 1; y >= 0; y--) {
      for (let x = 0; x <this. map[y].length; x++) {
        updateTile(x, y);
      }
    }
  }

  draw(g : CanvasRenderingContext2D) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].draw(g, x, y);
      }
    }
  }

  drop(tile : Tile, x : number, y : number) {
    this.map[y + 1][x] = tile;
    this.map[y][x] = new Air();
  }

  getBlockOnTopState(x : number, y : number) {
    return this.map[y][x].getBlockOnTopState();
  }
}

function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}

class KeyConfiguration {
  constructor(private color : string, private _1 : boolean, private removeStrategy : RemoveStrategy)
  {

  }
  setColor(g : CanvasRenderingContext2D) {g.fillStyle = this.color;}
  is1() {return this._1;}
  removeLock() {
    remove(this.removeStrategy);
  }
}

const YELLOW_KEY = new KeyConfiguration("#ffcc00", true, new RemoveLock1());


function transformTile(tile: RawTile2) {
    return tile.transform();

}


let inputs: Input[] = [];

function moveToTile(player : Player, newx: number, newy: number) {
  map[player.getY()][player.getX()] = new Air();
  map[newy][newx] = new PlayerTile();
  player.setX(newx);
  player.setY(newy);
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

function drawPlayer(player : Player, g: CanvasRenderingContext2D) {
  player.draw(g);
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