import { ItemId, ItemStack } from '../types';
import { soundManager } from '../audio/SoundManager';

export class Player {
  public x: number = 150; // spawn at center map (150, 150)
  public y: number = 150;
  public health: number = 100;
  public maxHealth: number = 100;
  public speed: number = 7.0; // tiles per second
  public invincibilityTimer: number = 0; // Grace period timer upon respawn

  // Inventory & Equipment
  public inventory: (ItemStack | null)[] = new Array(40).fill(null);
  public quickbar: (ItemId | null)[] = new Array(10).fill(null);
  public selectedQuickbarIndex: number = 0;

  public equippedWeapon: ItemId | null = 'pistol';
  public equippedAmmo: ItemId | null = 'firearm-magazine';
  public ammoCount: number = 100;

  // Hand mining action state
  public isMining: boolean = false;
  public miningProgress: number = 0;
  public miningTarget: { x: number; y: number } | null = null;

  constructor() {
    this.giveStartingItems();
  }

  private giveStartingItems() {
    this.addItem('stone-furnace', 5);
    this.addItem('burner-mining-drill', 4);
    this.addItem('transport-belt', 50);
    this.addItem('burner-inserter', 10);
    this.addItem('wooden-chest', 5);
    this.addItem('coal', 50);
    this.addItem('iron-plate', 20);
    this.addItem('firearm-magazine', 50);

    this.quickbar[0] = 'transport-belt';
    this.quickbar[1] = 'burner-inserter';
    this.quickbar[2] = 'burner-mining-drill';
    this.quickbar[3] = 'stone-furnace';
    this.quickbar[4] = 'wooden-chest';
    this.quickbar[5] = 'small-electric-pole';
    this.quickbar[6] = 'boiler';
    this.quickbar[7] = 'steam-engine';
    this.quickbar[8] = 'electric-mining-drill';
    this.quickbar[9] = 'assembling-machine-1';
  }

  public takeDamage(amount: number, game: any) {
    if (game.difficulty === 'sandbox' || this.invincibilityTimer > 0) return;

    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      game.onPlayerDeath();
    }
  }

  public respawn() {
    this.health = this.maxHealth;
    this.x = 150;
    this.y = 150;
    this.invincibilityTimer = 4.0; // 4 seconds invincibility shield upon respawning
  }

  public addItem(item: ItemId, count: number = 1): boolean {
    for (let i = 0; i < this.inventory.length; i++) {
      const slot = this.inventory[i];
      if (slot && slot.item === item && slot.count < 100) {
        const add = Math.min(100 - slot.count, count);
        slot.count += add;
        count -= add;
        if (count <= 0) return true;
      }
    }
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i] === null) {
        this.inventory[i] = { item, count };
        return true;
      }
    }
    return false;
  }

  public hasItem(item: ItemId, count: number = 1): boolean {
    let found = 0;
    for (const slot of this.inventory) {
      if (slot && slot.item === item) {
        found += slot.count;
        if (found >= count) return true;
      }
    }
    return false;
  }

  public removeItem(item: ItemId, count: number = 1): boolean {
    if (!this.hasItem(item, count)) return false;

    let needed = count;
    for (let i = 0; i < this.inventory.length; i++) {
      const slot = this.inventory[i];
      if (slot && slot.item === item) {
        const take = Math.min(slot.count, needed);
        slot.count -= take;
        needed -= take;
        if (slot.count <= 0) {
          this.inventory[i] = null;
        }
        if (needed <= 0) return true;
      }
    }
    return true;
  }

  public update(dt: number, game: any, keys: Record<string, boolean>) {
    if (this.invincibilityTimer > 0) {
      this.invincibilityTimer = Math.max(0, this.invincibilityTimer - dt);
    }

    let dx = 0;
    let dy = 0;
    if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    const nextX = this.x + dx * this.speed * dt;
    const nextY = this.y + dy * this.speed * dt;

    const checkTile = game.world.getTile(Math.floor(nextX), Math.floor(nextY));
    if (checkTile && checkTile.type !== 'water') {
      this.x = Math.max(1, Math.min(game.world.width - 2, nextX));
      this.y = Math.max(1, Math.min(game.world.height - 2, nextY));
    }

    game.world.revealRadius(this.x, this.y, 25);

    if (keys['KeyF']) {
      this.pickupNearbyItems(game);
    }
  }

  private pickupNearbyItems(game: any) {
    const px = Math.floor(this.x);
    const py = Math.floor(this.y);
    const ent = game.getEntityAt(px, py);

    if (ent && 'removeItem' in ent && typeof ent.removeItem === 'function') {
      const item = ent.removeItem();
      if (item) {
        this.addItem(item.item || item);
        soundManager.playMine();
      }
    }
  }
}
