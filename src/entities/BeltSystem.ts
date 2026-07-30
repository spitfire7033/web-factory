import { Entity } from './Entity';
import { Direction, ItemId } from '../types';

export interface BeltItem {
  item: ItemId;
  progress: number; // 0.0 to 1.0 along the belt segment
  lane: 'left' | 'right';
}

export class TransportBeltEntity extends Entity {
  public speed: number; // belt speed multiplier (1 for yellow, 2 for red, 3 for blue)
  public leftLane: BeltItem[] = [];
  public rightLane: BeltItem[] = [];

  constructor(id: string, itemType: ItemId, x: number, y: number, direction: Direction = 0, speed: number = 1.0) {
    super(id, itemType, x, y, 1, 1, direction, 100);
    this.speed = speed;
  }

  public update(dt: number, game: any): void {
    const step = dt * 1.5 * this.speed;

    // Move left lane items
    this.updateLane(this.leftLane, step, 'left', game);
    // Move right lane items
    this.updateLane(this.rightLane, step, 'right', game);
  }

  private updateLane(lane: BeltItem[], step: number, laneName: 'left' | 'right', game: any) {
    for (let i = lane.length - 1; i >= 0; i--) {
      const beltItem = lane[i];
      // Target max progress before hitting item ahead
      const nextProgressLimit = i === 0 ? 1.0 : lane[i - 1].progress - 0.28;

      if (beltItem.progress < nextProgressLimit) {
        beltItem.progress = Math.min(nextProgressLimit, beltItem.progress + step);
      }

      // If reached end of belt, attempt transfer to target output entity
      if (beltItem.progress >= 1.0 && i === 0) {
        const outTile = this.getOutputTile();
        const targetEntity = game.getEntityAt(outTile.x, outTile.y);

        if (targetEntity) {
          if (targetEntity instanceof TransportBeltEntity) {
            if (targetEntity.addItem(beltItem.item, laneName, 0.0)) {
              lane.shift(); // Successfully transferred to next belt
            }
          } else if (targetEntity instanceof UndergroundBeltEntity && targetEntity.mode === 'entrance') {
            if (targetEntity.addItem(beltItem.item, laneName)) {
              lane.shift();
            }
          } else if (targetEntity instanceof SplitterEntity) {
            if (targetEntity.addItem(beltItem.item, laneName)) {
              lane.shift();
            }
          }
        }
      }
    }
  }

  public addItem(item: ItemId, lane: 'left' | 'right' = 'left', startProgress: number = 0.0): boolean {
    const targetLane = lane === 'left' ? this.leftLane : this.rightLane;
    // Check space at start of lane
    const lastItem = targetLane[targetLane.length - 1];
    if (lastItem && lastItem.progress < 0.28) {
      return false; // Lane blocked
    }
    targetLane.push({
      item,
      progress: startProgress,
      lane
    });
    return true;
  }

  public removeItem(lane?: 'left' | 'right'): BeltItem | null {
    if (lane === 'left' && this.leftLane.length > 0) return this.leftLane.shift() || null;
    if (lane === 'right' && this.rightLane.length > 0) return this.rightLane.shift() || null;

    // Pick closest item to exit if lane not specified
    const leftHead = this.leftLane[0];
    const rightHead = this.rightLane[0];
    if (leftHead && rightHead) {
      return leftHead.progress >= rightHead.progress ? this.leftLane.shift()! : this.rightLane.shift()!;
    }
    if (leftHead) return this.leftLane.shift()!;
    if (rightHead) return this.rightLane.shift()!;
    return null;
  }
}

export class UndergroundBeltEntity extends Entity {
  public mode: 'entrance' | 'exit';
  public items: { item: ItemId; timer: number; lane: 'left' | 'right' }[] = [];
  public speed: number;

  constructor(id: string, itemType: ItemId, x: number, y: number, direction: Direction = 0, mode: 'entrance' | 'exit' = 'entrance', speed: number = 1.0) {
    super(id, itemType, x, y, 1, 1, direction, 100);
    this.mode = mode;
    this.speed = speed;
  }

  public update(dt: number, game: any): void {
    if (this.mode === 'entrance') {
      // Find matching exit underground belt in direction line up to 5 tiles
      const vec = this.getDirectionVector();
      let exitBelt: UndergroundBeltEntity | null = null;

      for (let dist = 1; dist <= 6; dist++) {
        const checkX = this.x + vec.x * dist;
        const checkY = this.y + vec.y * dist;
        const ent = game.getEntityAt(checkX, checkY);
        if (ent instanceof UndergroundBeltEntity && ent.mode === 'exit' && ent.direction === this.direction) {
          exitBelt = ent;
          break;
        }
      }

      for (let i = this.items.length - 1; i >= 0; i--) {
        this.items[i].timer += dt * this.speed * 2.0;
        if (this.items[i].timer >= 1.0 && exitBelt) {
          if (exitBelt.addItemToExit(this.items[i].item, this.items[i].lane)) {
            this.items.splice(i, 1);
          }
        }
      }
    }
  }

  public addItem(item: ItemId, lane: 'left' | 'right'): boolean {
    if (this.items.length >= 8) return false;
    this.items.push({ item, timer: 0, lane });
    return true;
  }

  public addItemToExit(item: ItemId, lane: 'left' | 'right'): boolean {
    // Add to exit items
    if (this.items.length >= 8) return false;
    this.items.push({ item, timer: 1.0, lane });
    return true;
  }
}

export class SplitterEntity extends Entity {
  public toggleOutput: boolean = false;
  public leftLaneItems: ItemId[] = [];
  public rightLaneItems: ItemId[] = [];

  constructor(id: string, itemType: ItemId, x: number, y: number, direction: Direction = 0) {
    // Splitter occupies 2x1 tiles depending on direction
    const isHoriz = direction === 0 || direction === 2;
    super(id, itemType, x, y, isHoriz ? 2 : 1, isHoriz ? 1 : 2, direction, 150);
  }

  public update(dt: number, game: any): void {
    // Split incoming items evenly across two output tiles
    const vec = this.getDirectionVector();

    // Outputs tile 1 and tile 2
    let outX1 = this.x + vec.x;
    let outY1 = this.y + vec.y;
    let outX2 = this.x + (this.width > 1 ? 1 : 0) + vec.x;
    let outY2 = this.y + (this.height > 1 ? 1 : 0) + vec.y;

    if (this.leftLaneItems.length > 0) {
      const item = this.leftLaneItems[0];
      const targetX = this.toggleOutput ? outX1 : outX2;
      const targetY = this.toggleOutput ? outY1 : outY2;
      const targetEnt = game.getEntityAt(targetX, targetY);

      if (targetEnt instanceof TransportBeltEntity) {
        if (targetEnt.addItem(item, 'left')) {
          this.leftLaneItems.shift();
          this.toggleOutput = !this.toggleOutput;
        }
      }
    }
  }

  public addItem(item: ItemId, lane: 'left' | 'right'): boolean {
    if (lane === 'left') {
      if (this.leftLaneItems.length < 4) {
        this.leftLaneItems.push(item);
        return true;
      }
    } else {
      if (this.rightLaneItems.length < 4) {
        this.rightLaneItems.push(item);
        return true;
      }
    }
    return false;
  }
}
