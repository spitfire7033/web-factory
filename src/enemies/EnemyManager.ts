import { soundManager } from '../audio/SoundManager';
import { DifficultyMode } from '../types';

export interface Biter {
  id: string;
  x: number;
  y: number;
  type: 'small' | 'medium' | 'behemoth';
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  targetX: number;
  targetY: number;
}

export interface BiterNest {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  spawnTimer: number;
}

export class EnemyManager {
  public biters: Biter[] = [];
  public nests: BiterNest[] = [];
  private waveTimer: number = 60; // Attack wave every 60s
  private idCounter: number = 0;

  constructor() {
    this.spawnInitialNests();
  }

  private spawnInitialNests() {
    const angles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];
    angles.forEach((angle, idx) => {
      const dist = 75 + Math.random() * 40;
      const nx = 150 + Math.cos(angle) * dist;
      const ny = 150 + Math.sin(angle) * dist;
      this.nests.push({
        id: `nest-${idx}`,
        x: nx,
        y: ny,
        health: 500,
        maxHealth: 500,
        spawnTimer: 0
      });
    });
  }

  public update(dt: number, game: any) {
    const difficulty: DifficultyMode = game.difficulty || 'normal';

    if (difficulty === 'sandbox' || difficulty === 'peaceful') {
      this.biters = []; // No biters active or spawning in Peaceful or Sandbox mode
      return;
    }

    this.waveTimer -= dt;
    const waveInterval = difficulty === 'deathworld' ? 25 : 60;

    if (this.waveTimer <= 0) {
      this.waveTimer = waveInterval;
      this.triggerAttackWave(game);
    }

    // Update Nests - periodic spawns only in Normal & Deathworld
    const nestInterval = difficulty === 'deathworld' ? 10 : 20;
    for (const nest of this.nests) {
      nest.spawnTimer += dt;
      if (nest.spawnTimer >= nestInterval) {
        nest.spawnTimer = 0;
        this.spawnBiter(nest.x, nest.y, 'small', difficulty);
      }
    }

    // Update Biters AI & Movement (WITH WATER COLLISION PREVENTION)
    for (let i = this.biters.length - 1; i >= 0; i--) {
      const biter = this.biters[i];

      let targetX = game.player.x;
      let targetY = game.player.y;

      const nearestEnt = game.findNearestEntity(biter.x, biter.y, 25);
      if (nearestEnt) {
        targetX = nearestEnt.x + nearestEnt.width / 2;
        targetY = nearestEnt.y + nearestEnt.height / 2;
      }

      const dx = targetX - biter.x;
      const dy = targetY - biter.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.8) {
        const nextX = biter.x + (dx / dist) * biter.speed * dt;
        const nextY = biter.y + (dy / dist) * biter.speed * dt;

        // WATER COLLISION CHECK: Biters CANNOT walk on water!
        const checkTile = game.world.getTile(Math.floor(nextX), Math.floor(nextY));
        if (checkTile && checkTile.type !== 'water') {
          biter.x = nextX;
          biter.y = nextY;
        } else {
          // Slide along free axis if diagonal hits water
          const checkXOnly = game.world.getTile(Math.floor(nextX), Math.floor(biter.y));
          const checkYOnly = game.world.getTile(Math.floor(biter.x), Math.floor(nextY));

          if (checkXOnly && checkXOnly.type !== 'water') {
            biter.x = nextX;
          } else if (checkYOnly && checkYOnly.type !== 'water') {
            biter.y = nextY;
          }
        }
      } else {
        if (nearestEnt && nearestEnt.occupiesTile(Math.floor(targetX), Math.floor(targetY))) {
          nearestEnt.health -= biter.damage * dt;
          if (nearestEnt.health <= 0) {
            game.destroyEntity(nearestEnt);
            soundManager.playExplosion();
          }
        } else if (Math.hypot(game.player.x - biter.x, game.player.y - biter.y) < 1.0) {
          game.player.takeDamage(biter.damage * dt, game);
        }
      }
    }
  }

  public triggerAttackWave(game: any) {
    const difficulty: DifficultyMode = game.difficulty || 'normal';
    if (difficulty === 'peaceful' || difficulty === 'sandbox') return;

    let totalPollution = 0;
    for (let x = 130; x <= 170; x++) {
      for (let y = 130; y <= 170; y++) {
        if (game.world.pollution[x]) totalPollution += game.world.pollution[x][y] || 0;
      }
    }

    const mult = difficulty === 'deathworld' ? 2.0 : 1.0;
    const waveSize = Math.min(40, Math.floor((4 + totalPollution / 100) * mult));

    for (let i = 0; i < waveSize; i++) {
      const randomNest = this.nests[Math.floor(Math.random() * this.nests.length)];
      if (randomNest) {
        const biterType = Math.random() < (difficulty === 'deathworld' ? 0.4 : 0.2) ? 'medium' : 'small';
        this.spawnBiter(randomNest.x + (Math.random() - 0.5) * 3, randomNest.y + (Math.random() - 0.5) * 3, biterType, difficulty);
      }
    }
  }

  public spawnBiter(x: number, y: number, type: 'small' | 'medium' | 'behemoth', difficulty: DifficultyMode = 'normal') {
    if (difficulty === 'peaceful' || difficulty === 'sandbox') return;

    const hpMult = difficulty === 'deathworld' ? 1.5 : 1.0;
    const hp = (type === 'behemoth' ? 400 : type === 'medium' ? 150 : 60) * hpMult;
    const speed = type === 'small' ? 3.5 : type === 'medium' ? 2.8 : 2.0;
    const damage = (type === 'behemoth' ? 40 : type === 'medium' ? 20 : 10) * (difficulty === 'deathworld' ? 1.5 : 1.0);

    this.biters.push({
      id: `biter-${this.idCounter++}`,
      x,
      y,
      type,
      health: hp,
      maxHealth: hp,
      speed,
      damage,
      targetX: 150,
      targetY: 150
    });
  }

  public findNearestBiter(x: number, y: number, maxRange: number): Biter | null {
    let closest: Biter | null = null;
    let minDistance = maxRange;

    for (const biter of this.biters) {
      const dist = Math.hypot(biter.x - x, biter.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = biter;
      }
    }
    return closest;
  }
}
