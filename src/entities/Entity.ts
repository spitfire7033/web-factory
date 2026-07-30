import { Direction, ItemId } from '../types';

export abstract class Entity {
  public id: string;
  public itemType: ItemId;
  public x: number; // tile coordinates (top-left)
  public y: number;
  public width: number; // in tiles
  public height: number; // in tiles
  public direction: Direction;
  public health: number;
  public maxHealth: number;

  // Status & Power
  public requiresPower: boolean = false;
  public powerSatisfied: number = 1.0; // 0..1 ratio from PowerGrid
  public powerConsumptionKW: number = 0;
  public powerProductionKW: number = 0;

  constructor(id: string, itemType: ItemId, x: number, y: number, width: number = 1, height: number = 1, direction: Direction = 0, health: number = 100) {
    this.id = id;
    this.itemType = itemType;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = direction;
    this.health = health;
    this.maxHealth = health;
  }

  public abstract update(dt: number, game: any): void;

  public occupiesTile(tx: number, ty: number): boolean {
    return tx >= this.x && tx < this.x + this.width && ty >= this.y && ty < this.y + this.height;
  }

  public getCenter(): { x: number; y: number } {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  // Get input/output tile vectors according to direction
  public getDirectionVector(): { x: number; y: number } {
    switch (this.direction) {
      case 0: return { x: 0, y: -1 }; // North
      case 1: return { x: 1, y: 0 };  // East
      case 2: return { x: 0, y: 1 };  // South
      case 3: return { x: -1, y: 0 }; // West
    }
  }

  public getOutputTile(): { x: number; y: number } {
    const vec = this.getDirectionVector();
    const center = this.getCenter();
    return {
      x: Math.floor(center.x + vec.x * (this.width / 2 + 0.1)),
      y: Math.floor(center.y + vec.y * (this.height / 2 + 0.1))
    };
  }

  public getInputTile(): { x: number; y: number } {
    const vec = this.getDirectionVector();
    const center = this.getCenter();
    return {
      x: Math.floor(center.x - vec.x * (this.width / 2 + 0.1)),
      y: Math.floor(center.y - vec.y * (this.height / 2 + 0.1))
    };
  }
}
