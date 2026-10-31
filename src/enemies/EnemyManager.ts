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
  private waveTimer: number = 90; // Attack wave every 90s
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
        health: 300,
        maxHealth: 300,
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
    const waveInterval = difficulty === 'deathworld' ? 45 : 90;

    if (this.waveTimer <= 0) {
      this.waveTimer = waveInterval;
      this.triggerAttackWave(game);
    }

    // Update Nests - periodic spawns only in Normal & Deathworld
    const nestInterval = difficulty === 'deathworld' ? 15 : 35;
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

    const mult = difficulty === 'deathworld' ? 1.5 : 0.8;
    const waveSize = Math.min(25, Math.floor((3 + totalPollution / 150) * mult));

    for (let i = 0; i < waveSize; i++) {
      const randomNest = this.nests[Math.floor(Math.random() * this.nests.length)];
      if (randomNest) {
        const biterType = Math.random() < (difficulty === 'deathworld' ? 0.3 : 0.1) ? 'medium' : 'small';
        this.spawnBiter(randomNest.x + (Math.random() - 0.5) * 3, randomNest.y + (Math.random() - 0.5) * 3, biterType, difficulty);
      }
    }
  }

  public spawnBiter(x: number, y: number, type: 'small' | 'medium' | 'behemoth', difficulty: DifficultyMode = 'normal') {
    if (difficulty === 'peaceful' || difficulty === 'sandbox') return;

    const hpMult = difficulty === 'deathworld' ? 1.3 : 1.0;
    const hp = (type === 'behemoth' ? 250 : type === 'medium' ? 60 : 25) * hpMult;
    const speed = type === 'small' ? 2.4 : type === 'medium' ? 2.0 : 1.6;
    const damage = (type === 'behemoth' ? 20 : type === 'medium' ? 8 : 4) * (difficulty === 'deathworld' ? 1.3 : 1.0);

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

  public damageBiter(biter: Biter, amount: number, game: any): boolean {
    biter.health -= amount;
    if (biter.health <= 0) {
      const idx = this.biters.indexOf(biter);
      if (idx !== -1) {
        this.biters.splice(idx, 1);
        soundManager.playExplosion();

        // Spawn blood splash particles
        for (let k = 0; k < 6; k++) {
          game.particles.push({
            x: biter.x + (Math.random() - 0.5) * 0.4,
            y: biter.y + (Math.random() - 0.5) * 0.4,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 0.5,
            maxLife: 0.5,
            color: '#d32f2f',
            size: 3 + Math.random() * 3,
            type: 'blood'
          });
        }
      }
      return true;
    }
    return false;
  }

  public damageNest(nest: BiterNest, amount: number, game: any): boolean {
    nest.health -= amount;
    if (nest.health <= 0) {
      const idx = this.nests.indexOf(nest);
      if (idx !== -1) {
        this.nests.splice(idx, 1);
        soundManager.playExplosion();

        for (let k = 0; k < 12; k++) {
          game.particles.push({
            x: nest.x + (Math.random() - 0.5) * 1.5,
            y: nest.y + (Math.random() - 0.5) * 1.5,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 0.8,
            maxLife: 0.8,
            color: '#880e4f',
            size: 4 + Math.random() * 4,
            type: 'blood'
          });
        }
      }
      return true;
    }
    return false;
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
