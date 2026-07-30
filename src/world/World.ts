import { Tile, TileType } from '../types';

// Fast noise implementation for procedural terrain generation
class SimplexNoise {
  private p: number[] = [];
  constructor(seed: number = 42) {
    const permutation = [];
    for (let i = 0; i < 256; i++) permutation[i] = i;
    // Shuffle with seed
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = Math.floor((s / 2147483647) * (i + 1));
      const temp: number = permutation[i];
      permutation[i] = permutation[j];
      permutation[j] = temp;
    }
    this.p = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.p[i] = permutation[i & 255];
    }
  }

  public noise2D(xin: number, yin: number): number {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

    let s = (xin + yin) * F2;
    let i = Math.floor(xin + s);
    let j = Math.floor(yin + s);
    let t = (i + j) * G2;
    let X0 = i - t;
    let Y0 = j - t;
    let x0 = xin - X0;
    let y0 = yin - Y0;

    let i1, j1;
    if (x0 > y0) {
      i1 = 1; j1 = 0;
    } else {
      i1 = 0; j1 = 1;
    }

    let x1 = x0 - i1 + G2;
    let y1 = y0 - j1 + G2;
    let x2 = x0 - 1.0 + 2.0 * G2;
    let y2 = y0 - 1.0 + 2.0 * G2;

    let ii = i & 255;
    let jj = j & 255;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    let n0 = 0;
    if (t0 > 0) {
      t0 *= t0;
      let gi0 = this.p[ii + this.p[jj]] % 8;
      n0 = t0 * t0 * this.grad(gi0, x0, y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    let n1 = 0;
    if (t1 > 0) {
      t1 *= t1;
      let gi1 = this.p[ii + i1 + this.p[jj + j1]] % 8;
      n1 = t1 * t1 * this.grad(gi1, x1, y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    let n2 = 0;
    if (t2 > 0) {
      t2 *= t2;
      let gi2 = this.p[ii + 1 + this.p[jj + 1]] % 8;
      n2 = t2 * t2 * this.grad(gi2, x2, y2);
    }

    return 70.0 * (n0 + n1 + n2);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
}

export class World {
  public width: number;
  public height: number;
  public tiles: Tile[][];
  public revealed: boolean[][]; // Fog of war
  public pollution: number[][]; // Pollution grid
  private noise: SimplexNoise;
  private oreNoise1: SimplexNoise;
  private oreNoise2: SimplexNoise;

  // Day/Night cycle: 300 seconds full cycle
  public dayTime: number = 0; // 0 to 1

  constructor(width: number = 300, height: number = 300, seed: number = 12345) {
    this.width = width;
    this.height = height;
    this.noise = new SimplexNoise(seed);
    this.oreNoise1 = new SimplexNoise(seed + 100);
    this.oreNoise2 = new SimplexNoise(seed + 200);

    this.tiles = [];
    this.revealed = [];
    this.pollution = [];

    this.generateWorld();
  }

  public generateWorld() {
    for (let x = 0; x < this.width; x++) {
      this.tiles[x] = [];
      this.revealed[x] = [];
      this.pollution[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.pollution[x][y] = 0;

        // Reveal starting area (30 tile radius around spawn x=150, y=150)
        const distFromSpawn = Math.hypot(x - 150, y - 150);
        this.revealed[x][y] = distFromSpawn < 35;

        // Procedural elevation & biome
        const nEle = this.noise.noise2D(x * 0.02, y * 0.02);
        const nTree = this.noise.noise2D(x * 0.1, y * 0.1);

        const nCoal = this.oreNoise1.noise2D(x * 0.05 + 10, y * 0.05 + 10);
        const nIron = this.oreNoise1.noise2D(x * 0.05 - 50, y * 0.05 - 50);
        const nCopper = this.oreNoise2.noise2D(x * 0.05 + 80, y * 0.05 + 80);
        const nStone = this.oreNoise2.noise2D(x * 0.05 - 100, y * 0.05 - 100);

        let type: TileType = 'grass';
        let resourceAmount = 0;
        let treeVariant = Math.floor(Math.abs(nTree * 10)) % 3;

        // Keep spawn clear of water & guaranteed rich resource patches near spawn!
        if (distFromSpawn < 10) {
          type = 'grass';
        } else if (nEle < -0.45) {
          type = 'water';
        } else if (nEle < -0.3) {
          type = 'sand';
        } else {
          // Resource Patches
          if (nIron > 0.45) {
            type = 'iron-ore';
            resourceAmount = Math.floor((nIron - 0.4) * 2500) + 1500;
          } else if (nCopper > 0.45) {
            type = 'copper-ore';
            resourceAmount = Math.floor((nCopper - 0.4) * 2500) + 1500;
          } else if (nCoal > 0.45) {
            type = 'coal-ore';
            resourceAmount = Math.floor((nCoal - 0.4) * 2500) + 1500;
          } else if (nStone > 0.48) {
            type = 'stone-ore';
            resourceAmount = Math.floor((nStone - 0.4) * 2000) + 1000;
          } else if (nTree > 0.35 && distFromSpawn > 12) {
            type = 'tree';
            resourceAmount = Math.floor(Math.random() * 20) + 30;
          } else if (nEle > 0.2) {
            type = 'dirt';
          }
        }

        // Guaranteed initial patches around spawn (150, 150)
        if (x >= 142 && x <= 147 && y >= 142 && y <= 147) {
          type = 'iron-ore';
          resourceAmount = 4000;
        } else if (x >= 153 && x <= 158 && y >= 142 && y <= 147) {
          type = 'copper-ore';
          resourceAmount = 4000;
        } else if (x >= 142 && x <= 147 && y >= 153 && y <= 158) {
          type = 'coal-ore';
          resourceAmount = 4000;
        } else if (x >= 153 && x <= 158 && y >= 153 && y <= 158) {
          type = 'stone-ore';
          resourceAmount = 3000;
        } else if (x >= 135 && x <= 140 && y >= 148 && y <= 152) {
          type = 'tree';
          resourceAmount = 50;
        }

        this.tiles[x][y] = {
          type,
          resourceAmount,
          treeVariant
        };
      }
    }
  }

  public getTile(x: number, y: number): Tile | null {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.tiles[x][y];
  }

  public isRevealed(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
    return this.revealed[x][y];
  }

  public revealRadius(centerX: number, centerY: number, radius: number) {
    const minX = Math.max(0, Math.floor(centerX - radius));
    const maxX = Math.min(this.width - 1, Math.ceil(centerX + radius));
    const minY = Math.max(0, Math.floor(centerY - radius));
    const maxY = Math.min(this.height - 1, Math.ceil(centerY + radius));

    const r2 = radius * radius;
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if ((x - centerX) ** 2 + (y - centerY) ** 2 <= r2) {
          this.revealed[x][y] = true;
        }
      }
    }
  }

  public addPollution(x: number, y: number, amount: number) {
    const tx = Math.floor(x);
    const ty = Math.floor(y);
    if (tx >= 0 && ty >= 0 && tx < this.width && ty < this.height) {
      this.pollution[tx][ty] = Math.min(1000, this.pollution[tx][ty] + amount);
    }
  }

  public update(dt: number) {
    // Day night cycle progression (300 sec full cycle)
    this.dayTime = (this.dayTime + dt / 300) % 1.0;

    // Slow pollution diffusion & decay
    if (Math.random() < 0.2) {
      const rx = Math.floor(Math.random() * (this.width - 2)) + 1;
      const ry = Math.floor(Math.random() * (this.height - 2)) + 1;
      const pol = this.pollution[rx][ry];
      if (pol > 1) {
        this.pollution[rx][ry] *= 0.98; // decay
        // diffuse to neighbors
        const spread = pol * 0.005;
        this.pollution[rx + 1][ry] += spread;
        this.pollution[rx - 1][ry] += spread;
        this.pollution[rx][ry + 1] += spread;
        this.pollution[rx][ry - 1] += spread;
      }
    }
  }

  public getLightLevel(): number {
    // 0: full day (light=1), 0.5: night (light=0.25)
    const t = this.dayTime;
    if (t < 0.4) return 1.0; // Day
    if (t < 0.5) return 1.0 - (t - 0.4) * 7.5; // Dusk transition to 0.25
    if (t < 0.8) return 0.25; // Night
    if (t < 0.9) return 0.25 + (t - 0.8) * 7.5; // Dawn transition to 1.0
    return 1.0;
  }
}
