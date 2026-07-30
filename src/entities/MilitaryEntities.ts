import { Entity } from './Entity';
import { Direction, ItemId } from '../types';
import { soundManager } from '../audio/SoundManager';

export class StoneWallEntity extends Entity {
  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 1, 1, 0, 350);
  }

  public update(dt: number, game: any): void {}
}

export class GunTurretEntity extends Entity {
  public ammoCount: number = 0;
  public ammoType: ItemId = 'firearm-magazine';
  public fireCooldown: number = 0;
  public range: number = 18;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 2, 2, 0, 250);
  }

  public update(dt: number, game: any): void {
    if (this.fireCooldown > 0) this.fireCooldown -= dt;

    if (this.ammoCount > 0 && this.fireCooldown <= 0) {
      // Find nearest biter target
      const center = this.getCenter();
      const target = game.enemyManager.findNearestBiter(center.x, center.y, this.range);

      if (target) {
        this.fireCooldown = 0.2; // 5 rounds per sec
        this.ammoCount--;
        target.takeDamage(20);
        soundManager.playShoot();

        // Visual bullet tracer particle
        game.addParticle({
          startX: center.x,
          startY: center.y,
          endX: target.x,
          endY: target.y,
          life: 0.1,
          color: '#ffb74d'
        });
      }
    }
  }

  public addAmmo(item: ItemId): boolean {
    if (item === 'firearm-magazine' || item === 'piercing-rounds-magazine') {
      if (this.ammoCount < 200) {
        this.ammoType = item;
        this.ammoCount += 10;
        return true;
      }
    }
    return false;
  }
}

export class LaserTurretEntity extends Entity {
  public fireCooldown: number = 0;
  public range: number = 24;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 2, 2, 0, 300);
    this.requiresPower = true;
    this.powerConsumptionKW = 300;
  }

  public update(dt: number, game: any): void {
    if (this.powerSatisfied < 0.8) return;
    if (this.fireCooldown > 0) this.fireCooldown -= dt;

    if (this.fireCooldown <= 0) {
      const center = this.getCenter();
      const target = game.enemyManager.findNearestBiter(center.x, center.y, this.range);

      if (target) {
        this.fireCooldown = 0.25;
        target.takeDamage(35);
        soundManager.playLaser();

        game.addParticle({
          startX: center.x,
          startY: center.y,
          endX: target.x,
          endY: target.y,
          life: 0.15,
          color: '#e040fb'
        });
      }
    }
  }
}
