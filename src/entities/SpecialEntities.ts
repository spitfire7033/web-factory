import { Entity } from './Entity';
import { Direction, ItemId } from '../types';
import { soundManager } from '../audio/SoundManager';

export class RocketSiloEntity extends Entity {
  public rocketPartsCount: number = 0; // 0 to 100 parts
  public isRocketReady: boolean = false;
  public isLaunching: boolean = false;
  public launchProgress: number = 0; // 0 to 1.0 animation

  public ingredients: Record<ItemId, number> = {
    'low-density-structure': 0,
    'rocket-fuel': 0,
    'rocket-control-unit': 0
  } as any;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 9, 9, 0, 5000);
    this.requiresPower = true;
    this.powerConsumptionKW = 500;
  }

  public addInputItem(item: ItemId): boolean {
    if (this.isRocketReady || this.isLaunching) return false;
    if (item === 'low-density-structure' || item === 'rocket-fuel' || item === 'rocket-control-unit') {
      const current = this.ingredients[item] || 0;
      if (current < 100) {
        this.ingredients[item] = current + 1;
        this.checkBuildPart();
        return true;
      }
    }
    return false;
  }

  private checkBuildPart() {
    const lds = this.ingredients['low-density-structure'] || 0;
    const rf = this.ingredients['rocket-fuel'] || 0;
    const rcu = this.ingredients['rocket-control-unit'] || 0;

    if (lds >= 1 && rf >= 1 && rcu >= 1) {
      this.ingredients['low-density-structure']--;
      this.ingredients['rocket-fuel']--;
      this.ingredients['rocket-control-unit']--;

      this.rocketPartsCount++;
      soundManager.playBuild();

      if (this.rocketPartsCount >= 100) {
        this.isRocketReady = true;
      }
    }
  }

  public launchRocket(game: any) {
    if (!this.isRocketReady || this.isLaunching) return;
    this.isLaunching = true;
    soundManager.playResearchComplete();
    game.triggerVictory();
  }

  public update(dt: number, game: any): void {
    if (this.isLaunching) {
      this.launchProgress += dt * 0.2;

      // Spawn rocket launch flame particles
      const center = this.getCenter();
      for (let i = 0; i < 4; i++) {
        game.addParticle({
          x: center.x + (Math.random() - 0.5) * 2,
          y: center.y + 2,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 4 + Math.random() * 3,
          life: 0.8,
          color: Math.random() < 0.5 ? '#ff3d00' : '#ffea00',
          size: 6 + Math.random() * 6,
          type: 'smoke'
        });
      }
    }
  }
}

export class RailEntity extends Entity {
  constructor(id: string, itemType: ItemId, x: number, y: number, direction: Direction = 0) {
    super(id, itemType, x, y, 2, 2, direction, 200);
  }

  public update(dt: number, game: any): void {}
}

export class LocomotiveEntity extends Entity {
  public speed: number = 6.0;

  constructor(id: string, itemType: ItemId, x: number, y: number, direction: Direction = 0) {
    super(id, itemType, x, y, 2, 4, direction, 600);
  }

  public update(dt: number, game: any): void {
    const vec = this.getDirectionVector();
    const nextX = this.x + vec.x * this.speed * dt * 0.1;
    const nextY = this.y + vec.y * this.speed * dt * 0.1;

    // Rail check: Train only moves if a RailEntity is underneath or ahead
    const checkEnt = game.getEntityAt(Math.floor(nextX), Math.floor(nextY));
    const currentRail = game.getEntityAt(Math.floor(this.x), Math.floor(this.y));

    if ((checkEnt && checkEnt instanceof RailEntity) || (currentRail && currentRail instanceof RailEntity)) {
      this.x = nextX;
      this.y = nextY;
    }
  }
}

export class RoboportEntity extends Entity {
  public activeBots: number = 10;
  public coverageRadius: number = 25;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 4, 4, 0, 500);
    this.requiresPower = true;
    this.powerConsumptionKW = 200;
  }

  public update(dt: number, game: any): void {
    if (this.powerSatisfied < 0.5) return;

    // Search for building ghosts in coverage area to build!
    if (game.buildingGhosts && game.buildingGhosts.length > 0) {
      const ghost = game.buildingGhosts[0];
      const center = this.getCenter();
      const dist = Math.hypot(ghost.x - center.x, ghost.y - center.y);

      if (dist <= this.coverageRadius) {
        // Spawn Construction Drone flying particle!
        game.addParticle({
          startX: center.x,
          startY: center.y,
          endX: ghost.x,
          endY: ghost.y,
          life: 1.0,
          color: '#00e5ff'
        });

        // Complete ghost building
        game.placeEntity(ghost.itemType, ghost.x, ghost.y, ghost.direction);
        game.buildingGhosts.shift();
        soundManager.playBuild();
      }
    }
  }
}
