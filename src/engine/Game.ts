import { World } from '../world/World';
import { Player } from '../player/Player';
import { Camera } from './Camera';
import { InputManager } from './InputManager';
import { UIManager } from '../ui/UIManager';
import { Entity } from '../entities/Entity';
import { TransportBeltEntity, UndergroundBeltEntity, SplitterEntity } from '../entities/BeltSystem';
import { InserterEntity } from '../entities/InserterEntity';
import { ChestEntity, MiningDrillEntity, FurnaceEntity, AssemblerEntity, BoilerEntity, LabEntity, OilRefineryEntity, ChemicalPlantEntity, FluidTankEntity } from '../entities/ProductionEntities';
import { ElectricPoleEntity, SteamEngineEntity, SolarPanelEntity, AccumulatorEntity, PowerGridManager } from '../entities/PowerEntities';
import { StoneWallEntity, GunTurretEntity, LaserTurretEntity } from '../entities/MilitaryEntities';
import { RocketSiloEntity, RoboportEntity, RailEntity, LocomotiveEntity } from '../entities/SpecialEntities';
import { EnemyManager } from '../enemies/EnemyManager';
import { Direction, DifficultyMode, ItemId, Recipe, Technology } from '../types';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';
import { TECHNOLOGIES } from '../data/technologies';
import { soundManager } from '../audio/SoundManager';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type?: 'smoke' | 'spark' | 'blood' | 'laser' | 'bullet';
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
}

export class Game {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public minimapCanvas: HTMLCanvasElement | null = null;
  public minimapCtx: CanvasRenderingContext2D | null = null;
  public showPollutionOnMinimap: boolean = false;

  public world: World;
  public player: Player;
  public camera: Camera;
  public inputManager: InputManager;
  public uiManager: UIManager;
  public powerManager: PowerGridManager;
  public enemyManager: EnemyManager;

  public entities: Entity[] = [];
  public particles: Particle[] = [];
  public buildingGhosts: { itemType: ItemId; x: number; y: number; direction: Direction }[] = [];

  // Game Settings & Difficulty
  public isGameStarted: boolean = false;
  public isDead: boolean = false;
  public difficulty: DifficultyMode = 'normal';
  public gameSpeed: number = 1.0;
  public animTime: number = 0;

  // Technology & Research state
  public unlockedTechs: Set<string> = new Set(['automation']);
  public currentResearch: Technology | null = null;
  public researchProgress: number = 0;

  // Hand Crafting Queue
  public handCraftingQueue: { recipe: Recipe; progress: number }[] = [];

  // Statistics
  public productionStats: Record<ItemId, number> = {} as any;
  private statResetTimer: number = 60;

  private lastTime: number = 0;
  private idCounter: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.minimapCanvas = document.getElementById('minimap-canvas') as HTMLCanvasElement;
    if (this.minimapCanvas) {
      this.minimapCtx = this.minimapCanvas.getContext('2d');
    }

    this.world = new World();
    this.player = new Player();
    this.camera = new Camera();
    this.inputManager = new InputManager(canvas, this);
    this.uiManager = new UIManager(this);
    this.powerManager = new PowerGridManager();
    this.enemyManager = new EnemyManager();

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupStartingFactory();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  public startGame() {
    this.isGameStarted = true;
    const menu = document.getElementById('main-menu-overlay');
    if (menu) menu.classList.remove('visible');

    const topHud = document.getElementById('top-hud');
    const bottomHud = document.getElementById('bottom-hud');
    const minimap = document.getElementById('minimap-widget');
    if (topHud) topHud.classList.remove('hud-hidden');
    if (bottomHud) bottomHud.classList.remove('hud-hidden');
    if (minimap) minimap.classList.remove('hud-hidden');

    this.updateDifficultyHUD();
  }

  public setDifficulty(diff: DifficultyMode) {
    this.difficulty = diff;
    this.updateDifficultyHUD();
  }

  private updateDifficultyHUD() {
    const el = document.getElementById('diff-hud-text');
    if (el) {
      el.textContent = this.difficulty.toUpperCase();
      el.style.color = this.difficulty === 'deathworld' ? '#f44336' : this.difficulty === 'peaceful' ? '#4caf50' : this.difficulty === 'sandbox' ? '#00b4d8' : '#ff9f1c';
    }
  }

  public openMainMenu() {
    this.isGameStarted = false;
    const menu = document.getElementById('main-menu-overlay');
    if (menu) menu.classList.add('visible');

    const topHud = document.getElementById('top-hud');
    const bottomHud = document.getElementById('bottom-hud');
    const minimap = document.getElementById('minimap-widget');
    if (topHud) topHud.classList.add('hud-hidden');
    if (bottomHud) bottomHud.classList.add('hud-hidden');
    if (minimap) minimap.classList.add('hud-hidden');
  }

  public onPlayerDeath() {
    if (this.isDead) return;
    this.isDead = true;
    soundManager.playExplosion();

    const respawnModal = document.getElementById('respawn-modal');
    if (respawnModal) respawnModal.classList.add('visible');
  }

  public triggerVictory() {
    soundManager.playResearchComplete();
    const victoryModal = document.getElementById('victory-modal');
    if (victoryModal) victoryModal.classList.add('visible');
  }

  public respawnPlayer() {
    this.player.respawn();
    this.isDead = false;

    // Clear biters within 25 tiles of spawn point so player is safe on respawn
    this.enemyManager.biters = this.enemyManager.biters.filter(b => Math.hypot(b.x - 150, b.y - 150) > 25);

    const respawnModal = document.getElementById('respawn-modal');
    if (respawnModal) respawnModal.classList.remove('visible');
  }

  public generateNewWorld(seed: number = Math.floor(Math.random() * 100000), difficulty: DifficultyMode = 'normal') {
    this.difficulty = difficulty;
    this.world = new World(300, 300, seed);
    this.entities = [];
    this.particles = [];
    this.player = new Player();
    this.isDead = false;
    this.setupStartingFactory();
    this.updateDifficultyHUD();
  }

  private setupStartingFactory() {
    // Aligned 2x2 Burner Mining Drill facing East (direction 1) outputs directly to (146, 144)
    const drill = this.placeEntity('burner-mining-drill', 144, 144, 1) as MiningDrillEntity;
    // 2x2 Stone Furnace placed at (146, 144)
    const furnace = this.placeEntity('stone-furnace', 146, 144, 0) as FurnaceEntity;

    if (drill) drill.fuelCount = 25; // Pre-feed starter coal so drill works immediately out-of-the-box!
    if (furnace) furnace.fuelCount = 25; // Pre-feed starter furnace fuel!
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.viewportWidth = window.innerWidth;
    this.camera.viewportHeight = window.innerHeight;
  }

  private gameLoop(timestamp: number) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    const scaledDt = dt * this.gameSpeed;
    this.animTime += scaledDt;

    if (this.isGameStarted && !this.isDead) {
      this.update(scaledDt);
    }
    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  public update(dt: number) {
    this.world.update(dt);
    this.player.update(dt, this, this.inputManager.keys);
    this.camera.follow(this.player.x, this.player.y, dt);

    if (this.handCraftingQueue.length > 0) {
      const current = this.handCraftingQueue[0];
      const craftSpeedMult = this.difficulty === 'sandbox' ? 10.0 : 1.0;
      current.progress += dt * craftSpeedMult;
      if (current.progress >= current.recipe.craftTime) {
        const res = current.recipe.results[0];
        this.player.addItem(res.item, res.amount);
        this.handCraftingQueue.shift();
        soundManager.playBuild();
        this.uiManager.updateInventoryUI();
      }
    }

    this.powerManager.update(dt, this);

    for (const entity of this.entities) {
      entity.update(dt, this);

      if ((entity instanceof BoilerEntity && entity.fuelTimer > 0) || (entity instanceof FurnaceEntity && entity.craftProgress > 0)) {
        if (Math.random() < 0.3) {
          const center = entity.getCenter();
          this.particles.push({
            x: center.x + (Math.random() - 0.5) * 0.5,
            y: center.y - 0.5,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -0.8 - Math.random() * 0.4,
            life: 1.2,
            maxLife: 1.2,
            color: 'rgba(180, 190, 200, 0.4)',
            size: 3 + Math.random() * 4,
            type: 'smoke'
          });
        }
      }
    }

    this.enemyManager.update(dt, this);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += (p.vx || 0) * dt;
      p.y += (p.vy || 0) * dt;
    }

    this.uiManager.updateHUD();
    this.renderMinimap();

    this.statResetTimer -= dt;
    if (this.statResetTimer <= 0) {
      this.statResetTimer = 60;
      this.productionStats = {} as any;
    }
  }

  public render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderTerrain();
    this.renderPowerWires();
    this.renderEntities();
    this.renderBuildingGhosts();
    this.renderEnemies();
    this.renderPlayer();
    this.renderParticles();
    this.renderLighting();
    this.renderGhostPreview();
    this.renderHoverOutlines();
  }

  private renderBuildingGhosts() {
    const ts = this.camera.tileSize;
    for (const ghost of this.buildingGhosts) {
      const screen = this.camera.worldToScreen(ghost.x, ghost.y);
      const itemDef = ITEMS[ghost.itemType];

      this.ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
      this.ctx.fillRect(screen.x + 1, screen.y + 1, ts - 2, ts - 2);

      this.ctx.strokeStyle = '#00e5ff';
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 4]);
      this.ctx.strokeRect(screen.x + 1, screen.y + 1, ts - 2, ts - 2);
      this.ctx.setLineDash([]);

      if (itemDef) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = `${Math.floor(ts * 0.45)}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(itemDef.symbol, screen.x + ts / 2, screen.y + ts / 2);
      }
    }
  }

  private renderHoverOutlines() {
    const ts = this.camera.tileSize;
    const hTile = this.inputManager.hoveredTile;
    const worldPos = this.camera.screenToWorld(this.inputManager.mouseX, this.inputManager.mouseY);

    // 1. Hovered Entity Outline
    const ent = this.getEntityAt(hTile.x, hTile.y);
    if (ent) {
      const screen = this.camera.worldToScreen(ent.x, ent.y);
      this.ctx.strokeStyle = '#ffee58'; // Glowing yellow selection box
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(screen.x - 2, screen.y - 2, ent.width * ts + 4, ent.height * ts + 4);

      // Draw output arrow indicator
      const outTile = ent.getOutputTile();
      const outScreen = this.camera.worldToScreen(outTile.x + 0.5, outTile.y + 0.5);
      const centerScreen = this.camera.worldToScreen(ent.x + ent.width / 2, ent.y + ent.height / 2);
      this.ctx.strokeStyle = '#ff9f1c';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(centerScreen.x, centerScreen.y);
      this.ctx.lineTo(outScreen.x, outScreen.y);
      this.ctx.stroke();

      // Output arrow tip
      this.ctx.fillStyle = '#ff9f1c';
      this.ctx.beginPath();
      this.ctx.arc(outScreen.x, outScreen.y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Hovered Biter Outline
    const biter = this.enemyManager.findNearestBiter(worldPos.x, worldPos.y, 1.2);
    if (biter) {
      const screen = this.camera.worldToScreen(biter.x, biter.y);
      const rad = biter.type === 'behemoth' ? ts * 0.55 : biter.type === 'medium' ? ts * 0.45 : ts * 0.35;
      this.ctx.strokeStyle = '#f44336'; // Bright red enemy outline
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, rad, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // 3. Hovered Biter Nest Outline
    for (const nest of this.enemyManager.nests) {
      if (Math.hypot(nest.x - worldPos.x, nest.y - worldPos.y) < 1.5) {
        const screen = this.camera.worldToScreen(nest.x, nest.y);
        this.ctx.strokeStyle = '#f44336';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, ts * 0.95, 0, Math.PI * 2);
        this.ctx.stroke();
        break;
      }
    }

    // 4. Hovered Resource Tile Outline
    if (!ent && !biter) {
      const tile = this.world.getTile(hTile.x, hTile.y);
      if (tile && (tile.resourceAmount > 0 || tile.type === 'water')) {
        const screen = this.camera.worldToScreen(hTile.x, hTile.y);
        this.ctx.strokeStyle = 'rgba(0, 180, 216, 0.8)'; // Cyan highlight tile
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screen.x, screen.y, ts, ts);
      }
    }
  }

  private renderTerrain() {
    const startTileX = Math.max(0, Math.floor(this.camera.x - this.canvas.width / (2 * this.camera.tileSize) - 2));
    const endTileX = Math.min(this.world.width - 1, Math.ceil(this.camera.x + this.canvas.width / (2 * this.camera.tileSize) + 2));
    const startTileY = Math.max(0, Math.floor(this.camera.y - this.canvas.height / (2 * this.camera.tileSize) - 2));
    const endTileY = Math.min(this.world.height - 1, Math.ceil(this.camera.y + this.canvas.height / (2 * this.camera.tileSize) + 2));

    const ts = this.camera.tileSize;

    for (let x = startTileX; x <= endTileX; x++) {
      for (let y = startTileY; y <= endTileY; y++) {
        if (!this.world.isRevealed(x, y)) {
          const screen = this.camera.worldToScreen(x, y);
          this.ctx.fillStyle = '#0a0b0d';
          this.ctx.fillRect(screen.x, screen.y, ts + 0.5, ts + 0.5);
          continue;
        }

        const tile = this.world.tiles[x][y];
        const screen = this.camera.worldToScreen(x, y);

        let color = '#2e7d32';
        if (tile.type === 'dirt') color = '#5d4037';
        else if (tile.type === 'sand') color = '#d7ccc8';
        else if (tile.type === 'water') color = '#0288d1';
        else if (tile.type.includes('ore')) color = '#37474f';

        this.ctx.fillStyle = color;
        this.ctx.fillRect(screen.x, screen.y, ts + 0.5, ts + 0.5);

        if (tile.type === 'water') {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          const waveOffset = Math.sin(this.animTime * 3 + x + y) * (ts * 0.2);
          this.ctx.fillRect(screen.x + ts * 0.2, screen.y + ts * 0.4 + waveOffset, ts * 0.6, 2);
        }

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        this.ctx.strokeRect(screen.x, screen.y, ts, ts);

        if (tile.type.includes('ore')) {
          let oreColor = '#8a9ea7';
          if (tile.type === 'copper-ore') oreColor = '#c87d55';
          else if (tile.type === 'coal-ore') oreColor = '#1a1a1a';
          else if (tile.type === 'stone-ore') oreColor = '#969696';

          this.ctx.fillStyle = oreColor;
          this.ctx.beginPath();
          this.ctx.arc(screen.x + ts / 2, screen.y + ts / 2, ts * 0.35, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (tile.type === 'tree') {
          this.ctx.fillStyle = '#1b5e20';
          this.ctx.beginPath();
          this.ctx.arc(screen.x + ts / 2, screen.y + ts / 2, ts * 0.45, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.fillStyle = '#4e342e';
          this.ctx.fillRect(screen.x + ts * 0.4, screen.y + ts * 0.4, ts * 0.2, ts * 0.2);
        }
      }
    }
  }

  private renderPowerWires() {
    const poles = this.entities.filter(e => e instanceof ElectricPoleEntity) as ElectricPoleEntity[];
    this.ctx.strokeStyle = '#ffee58';
    this.ctx.lineWidth = 1.5;

    for (let i = 0; i < poles.length; i++) {
      for (let j = i + 1; j < poles.length; j++) {
        const p1 = poles[i];
        const p2 = poles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist <= Math.min(p1.wireRange, p2.wireRange)) {
          const s1 = this.camera.worldToScreen(p1.x + p1.width / 2, p1.y + p1.height / 2);
          const s2 = this.camera.worldToScreen(p2.x + p2.width / 2, p2.y + p2.height / 2);

          this.ctx.beginPath();
          this.ctx.moveTo(s1.x, s1.y);
          const midX = (s1.x + s2.x) / 2;
          const midY = (s1.y + s2.y) / 2 + 8;
          this.ctx.quadraticCurveTo(midX, midY, s2.x, s2.y);
          this.ctx.stroke();
        }
      }
    }
  }

  private renderEntities() {
    const ts = this.camera.tileSize;

    for (const ent of this.entities) {
      const screen = this.camera.worldToScreen(ent.x, ent.y);
      const itemDef = ITEMS[ent.itemType];

      this.ctx.fillStyle = itemDef ? itemDef.iconColor : '#ff9f1c';
      this.ctx.fillRect(screen.x + 1, screen.y + 1, ent.width * ts - 2, ent.height * ts - 2);

      this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(screen.x + 1, screen.y + 1, ent.width * ts - 2, ent.height * ts - 2);

      if (itemDef) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `${Math.floor(ts * 0.45 * Math.min(ent.width, ent.height))}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(itemDef.symbol, screen.x + (ent.width * ts) / 2, screen.y + (ent.height * ts) / 2);
      }

      const dirVec = ent.getDirectionVector();
      const cx = screen.x + (ent.width * ts) / 2;
      const cy = screen.y + (ent.height * ts) / 2;

      // Render directional arrow indicator for directional entities
      if (ent instanceof MiningDrillEntity || ent instanceof InserterEntity || ent instanceof TransportBeltEntity) {
        const arrowX = cx + dirVec.x * (ent.width * ts * 0.35);
        const arrowY = cy + dirVec.y * (ent.height * ts * 0.35);

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        this.ctx.beginPath();
        this.ctx.arc(arrowX, arrowY, 4, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Render Machine Progress Bar
      let progressRatio = -1;
      let barColor = '#4caf50';

      if (ent instanceof MiningDrillEntity) {
        progressRatio = ent.progress;
        if (ent.outputBuffer) { barColor = '#ff9800'; } // Buffer full indicator
        else if (ent.requiresPower && ent.powerSatisfied < 0.2) { barColor = '#f44336'; }
        else if (!ent.requiresPower && ent.fuelCount <= 0) { barColor = '#f44336'; }
      } else if (ent instanceof FurnaceEntity) {
        progressRatio = ent.craftProgress;
        if (ent.craftProgress <= 0 && (!ent.inputItem || ent.fuelCount <= 0)) { progressRatio = -1; }
      } else if (ent instanceof AssemblerEntity) {
        progressRatio = ent.craftProgress;
      } else if (ent instanceof LabEntity) {
        progressRatio = (ent.researchProgress / (this.currentResearch?.cost.timePerUnit || 1));
      } else if (ent instanceof RocketSiloEntity) {
        progressRatio = ent.rocketPartsCount / 100;
      }

      if (progressRatio >= 0 && progressRatio <= 1.0) {
        const barW = ent.width * ts - 6;
        const barH = 5;
        const barX = screen.x + 3;
        const barY = screen.y + ent.height * ts - 8;

        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(barX, barY, barW, barH);
        this.ctx.fillStyle = barColor;
        this.ctx.fillRect(barX, barY, barW * progressRatio, barH);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(barX, barY, barW, barH);
      }

      if (ent instanceof TransportBeltEntity) {
        const offset = (this.animTime * ent.speed * 20) % (ts * 0.4);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(cx + dirVec.x * offset, cy + dirVec.y * offset, 3, 0, Math.PI * 2);
        this.ctx.fill();

        ent.leftLane.concat(ent.rightLane).forEach(bItem => {
          const bDef = ITEMS[bItem.item];
          if (!bDef) return;
          const progressOffset = (bItem.progress - 0.5) * ts;
          const ix = cx + dirVec.x * progressOffset + (bItem.lane === 'left' ? -ts * 0.2 : ts * 0.2);
          const iy = cy + dirVec.y * progressOffset + (bItem.lane === 'left' ? -ts * 0.2 : ts * 0.2);

          this.ctx.fillStyle = bDef.iconColor;
          this.ctx.fillRect(ix - 5, iy - 5, 10, 10);
        });
      } else if (ent instanceof InserterEntity) {
        this.ctx.strokeStyle = '#ff9f1c';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        const armLen = ts * 0.8 * ent.reach;
        const baseAngle = (ent.direction * Math.PI) / 2 - Math.PI / 2;
        const targetAngle = baseAngle + ent.armAngle;
        const ax = cx + Math.cos(targetAngle) * armLen;
        const ay = cy + Math.sin(targetAngle) * armLen;
        this.ctx.lineTo(ax, ay);
        this.ctx.stroke();

        if (ent.heldItem && ITEMS[ent.heldItem]) {
          this.ctx.fillStyle = ITEMS[ent.heldItem].iconColor;
          this.ctx.beginPath();
          this.ctx.arc(ax, ay, 6, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  private renderEnemies() {
    const ts = this.camera.tileSize;
    for (const nest of this.enemyManager.nests) {
      const screen = this.camera.worldToScreen(nest.x, nest.y);
      this.ctx.fillStyle = '#880e4f';
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, ts * 0.8, 0, Math.PI * 2);
      this.ctx.fill();
    }

    for (const biter of this.enemyManager.biters) {
      const screen = this.camera.worldToScreen(biter.x, biter.y);
      this.ctx.fillStyle = biter.type === 'behemoth' ? '#4a148c' : biter.type === 'medium' ? '#b71c1c' : '#e65100';
      const rad = biter.type === 'behemoth' ? ts * 0.45 : biter.type === 'medium' ? ts * 0.35 : ts * 0.25;
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, rad, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private renderPlayer() {
    if (this.isDead) return;
    const ts = this.camera.tileSize;
    const screen = this.camera.worldToScreen(this.player.x, this.player.y);

    this.ctx.fillStyle = '#ff9f1c';
    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y, ts * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    if (this.player.invincibilityTimer > 0) {
      this.ctx.strokeStyle = '#00b4d8';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, ts * 0.65, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Engineer', screen.x, screen.y - ts * 0.5);
  }

  private renderParticles() {
    for (const p of this.particles) {
      if (p.type === 'smoke') {
        const screen = this.camera.worldToScreen(p.x, p.y);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.startX !== undefined && p.startY !== undefined) {
        const s1 = this.camera.worldToScreen(p.startX, p.startY);
        const s2 = this.camera.worldToScreen(p.endX!, p.endY!);

        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(s1.x, s1.y);
        this.ctx.lineTo(s2.x, s2.y);
        this.ctx.stroke();
      }
    }
  }

  private renderLighting() {
    const light = this.world.getLightLevel();
    if (light < 0.95) {
      this.ctx.fillStyle = `rgba(10, 15, 25, ${1.0 - light})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const pScreen = this.camera.worldToScreen(this.player.x, this.player.y);
      const rad = 130;
      const grad = this.ctx.createRadialGradient(pScreen.x, pScreen.y, 10, pScreen.x, pScreen.y, rad);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(pScreen.x, pScreen.y, rad, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalCompositeOperation = 'source-over';
    }
  }

  private renderGhostPreview() {
    const selItem = this.player.quickbar[this.player.selectedQuickbarIndex];
    if (!selItem) return;

    const itemDef = ITEMS[selItem];
    if (!itemDef || !itemDef.placeableEntity) return;

    const hTile = this.inputManager.hoveredTile;
    const isValid = this.canPlaceEntity(selItem, hTile.x, hTile.y);
    const ts = this.camera.tileSize;
    const screen = this.camera.worldToScreen(hTile.x, hTile.y);

    this.ctx.fillStyle = isValid ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)';
    this.ctx.fillRect(screen.x, screen.y, ts, ts);
    this.ctx.strokeStyle = isValid ? '#4caf50' : '#f44336';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(screen.x, screen.y, ts, ts);
  }

  public renderMinimap() {
    if (!this.minimapCtx || !this.minimapCanvas) return;
    const mctx = this.minimapCtx;
    const mw = this.minimapCanvas.width;
    const mh = this.minimapCanvas.height;

    mctx.fillStyle = '#101216';
    mctx.fillRect(0, 0, mw, mh);

    const scale = mw / this.world.width;

    for (const ent of this.entities) {
      mctx.fillStyle = ent.requiresPower ? '#00b4d8' : '#ff9f1c';
      mctx.fillRect(ent.x * scale, ent.y * scale, Math.max(2, ent.width * scale), Math.max(2, ent.height * scale));
    }

    mctx.fillStyle = '#f44336';
    for (const nest of this.enemyManager.nests) {
      mctx.fillRect(nest.x * scale - 1, nest.y * scale - 1, 3, 3);
    }
    for (const biter of this.enemyManager.biters) {
      mctx.fillRect(biter.x * scale, biter.y * scale, 2, 2);
    }

    if (!this.isDead) {
      mctx.fillStyle = '#4caf50';
      mctx.beginPath();
      mctx.arc(this.player.x * scale, this.player.y * scale, 3, 0, Math.PI * 2);
      mctx.fill();
    }

    const sweepX = (this.animTime * 40) % mw;
    mctx.strokeStyle = 'rgba(76, 175, 80, 0.3)';
    mctx.beginPath();
    mctx.moveTo(sweepX, 0);
    mctx.lineTo(sweepX, mh);
    mctx.stroke();
  }

  public saveGame(): string {
    const saveData = {
      difficulty: this.difficulty,
      player: {
        x: this.player.x,
        y: this.player.y,
        health: this.player.health,
        inventory: this.player.inventory,
        quickbar: this.player.quickbar
      },
      unlockedTechs: Array.from(this.unlockedTechs),
      entities: this.entities.map(e => ({
        id: e.id,
        itemType: e.itemType,
        x: e.x,
        y: e.y,
        direction: e.direction,
        health: e.health
      }))
    };
    const jsonStr = JSON.stringify(saveData);
    localStorage.setItem('factorio_web_save', jsonStr);
    return jsonStr;
  }

  public loadGame(jsonStr?: string): boolean {
    const str = jsonStr || localStorage.getItem('factorio_web_save');
    if (!str) return false;

    try {
      const data = JSON.parse(str);
      this.difficulty = data.difficulty || 'normal';
      this.player.x = data.player.x;
      this.player.y = data.player.y;
      this.player.health = data.player.health;
      this.player.inventory = data.player.inventory;
      this.player.quickbar = data.player.quickbar;
      this.unlockedTechs = new Set(data.unlockedTechs);

      this.entities = [];
      for (const e of data.entities) {
        this.placeEntity(e.itemType, e.x, e.y, e.direction);
      }
      this.updateDifficultyHUD();
      return true;
    } catch (err) {
      console.error('Failed to load save state:', err);
      return false;
    }
  }

  public canPlaceEntity(itemId: ItemId, x: number, y: number): boolean {
    const tile = this.world.getTile(x, y);
    if (!tile || tile.type === 'water') return false;
    const existing = this.getEntityAt(x, y);
    return existing === null;
  }

  public handleLeftClick(x: number, y: number, dir: Direction) {
    if (this.isDead) return;

    if (this.player.selectedQuickbarIndex === -2) {
      // Deconstruct tool mode active
      const ent = this.getEntityAt(x, y);
      if (ent) {
        this.destroyEntity(ent);
        this.player.addItem(ent.itemType, 1);
        soundManager.playDismantle();
        this.uiManager.updateInventoryUI();
      }
      return;
    }

    const selItem = this.player.selectedQuickbarIndex >= 0 ? this.player.quickbar[this.player.selectedQuickbarIndex] : null;

    if (selItem === 'blueprint-tool') {
      // Blueprint ghost tool mode
      const isClear = this.canPlaceEntity('assembling-machine-1', x, y);
      if (isClear) {
        this.buildingGhosts.push({ itemType: 'assembling-machine-1', x, y, direction: dir });
        soundManager.playClick();
      }
      return;
    }

    if (selItem) {
      if (this.canPlaceEntity(selItem, x, y)) {
        if (this.player.hasItem(selItem, 1)) {
          this.placeEntity(selItem, x, y, dir);
          this.player.removeItem(selItem, 1);
          soundManager.playBuild();
          this.uiManager.renderQuickbar();
          this.uiManager.updateInventoryUI();
        } else {
          // No item in inventory -> place building ghost for bots/player
          this.buildingGhosts.push({ itemType: selItem, x, y, direction: dir });
          soundManager.playClick();
        }
      }
    } else {
      // Check if clicking on ghost tile to complete building manually
      const ghostIdx = this.buildingGhosts.findIndex(g => g.x === x && g.y === y);
      if (ghostIdx !== -1) {
        const ghost = this.buildingGhosts[ghostIdx];
        if (this.player.hasItem(ghost.itemType, 1)) {
          this.placeEntity(ghost.itemType, ghost.x, ghost.y, ghost.direction);
          this.player.removeItem(ghost.itemType, 1);
          this.buildingGhosts.splice(ghostIdx, 1);
          soundManager.playBuild();
          this.uiManager.updateInventoryUI();
          return;
        }
      }

      const ent = this.getEntityAt(x, y);
      if (ent) {
        this.uiManager.inspectEntity(ent);
      }
    }
  }

  public handleRightClick(x: number, y: number) {
    if (this.isDead) return;
    const ent = this.getEntityAt(x, y);
    if (ent) {
      this.destroyEntity(ent);
      this.player.addItem(ent.itemType, 1);
      soundManager.playDismantle();
      this.uiManager.updateInventoryUI();
    } else {
      const tile = this.world.getTile(x, y);
      if (tile && tile.resourceAmount > 0) {
        tile.resourceAmount -= 5;
        soundManager.playMine();

        let mined: ItemId = 'stone';
        if (tile.type === 'iron-ore') mined = 'iron-ore';
        else if (tile.type === 'copper-ore') mined = 'copper-ore';
        else if (tile.type === 'coal-ore') mined = 'coal';
        else if (tile.type === 'stone-ore') mined = 'stone';
        else if (tile.type === 'tree') mined = 'wood';

        this.player.addItem(mined, 1);

        if (tile.resourceAmount <= 0) {
          tile.type = 'grass';
        }
        this.uiManager.updateInventoryUI();
      }
    }
  }

  public placeEntity(itemId: ItemId, x: number, y: number, dir: Direction): Entity | null {
    const id = `ent-${this.idCounter++}`;
    let ent: Entity | null = null;

    if (itemId.includes('transport-belt')) {
      const speed = itemId.startsWith('express') ? 3 : itemId.startsWith('fast') ? 2 : 1;
      ent = new TransportBeltEntity(id, itemId, x, y, dir, speed);
    } else if (itemId.includes('inserter')) {
      const speed = itemId.startsWith('fast') ? 4.5 : 2.5;
      const reach = itemId.startsWith('long-handed') ? 2 : 1;
      ent = new InserterEntity(id, itemId, x, y, dir, speed, reach);
    } else if (itemId.includes('chest')) {
      const slots = itemId.startsWith('steel') ? 48 : itemId.startsWith('iron') ? 32 : 16;
      ent = new ChestEntity(id, itemId, x, y, slots);
    } else if (itemId.includes('mining-drill')) {
      ent = new MiningDrillEntity(id, itemId, x, y, dir);
    } else if (itemId.includes('furnace')) {
      ent = new FurnaceEntity(id, itemId, x, y);
    } else if (itemId.includes('assembling-machine')) {
      ent = new AssemblerEntity(id, itemId, x, y);
    } else if (itemId === 'boiler') {
      ent = new BoilerEntity(id, itemId, x, y);
    } else if (itemId === 'lab') {
      ent = new LabEntity(id, itemId, x, y);
    } else if (itemId.includes('electric-pole') || itemId === 'substation') {
      ent = new ElectricPoleEntity(id, itemId, x, y);
    } else if (itemId === 'steam-engine') {
      ent = new SteamEngineEntity(id, itemId, x, y, dir);
    } else if (itemId === 'solar-panel') {
      ent = new SolarPanelEntity(id, itemId, x, y);
    } else if (itemId === 'accumulator') {
      ent = new AccumulatorEntity(id, itemId, x, y);
    } else if (itemId === 'stone-wall') {
      ent = new StoneWallEntity(id, itemId, x, y);
    } else if (itemId === 'gun-turret') {
      ent = new GunTurretEntity(id, itemId, x, y);
    } else if (itemId === 'laser-turret') {
      ent = new LaserTurretEntity(id, itemId, x, y);
    } else if (itemId === 'oil-refinery') {
      ent = new OilRefineryEntity(id, itemId, x, y);
    } else if (itemId === 'chemical-plant') {
      ent = new ChemicalPlantEntity(id, itemId, x, y);
    } else if (itemId === 'fluid-tank') {
      ent = new FluidTankEntity(id, itemId, x, y);
    } else if (itemId === 'rocket-silo') {
      ent = new RocketSiloEntity(id, itemId, x, y);
    } else if (itemId === 'roboport') {
      ent = new RoboportEntity(id, itemId, x, y);
    } else if (itemId === 'rail') {
      ent = new RailEntity(id, itemId, x, y, dir);
    } else if (itemId === 'locomotive' || itemId === 'cargo-wagon') {
      ent = new LocomotiveEntity(id, itemId, x, y, dir);
    }

    if (ent) {
      this.entities.push(ent);
    }
    return ent;
  }

  public getEntityAt(x: number, y: number): Entity | null {
    for (const ent of this.entities) {
      if (ent.occupiesTile(x, y)) return ent;
    }
    return null;
  }

  public findNearestEntity(x: number, y: number, maxDist: number): Entity | null {
    let closest: Entity | null = null;
    let minDist = maxDist;
    for (const ent of this.entities) {
      const dist = Math.hypot(ent.x - x, ent.y - y);
      if (dist < minDist) {
        minDist = dist;
        closest = ent;
      }
    }
    return closest;
  }

  public destroyEntity(entity: Entity) {
    const idx = this.entities.indexOf(entity);
    if (idx !== -1) {
      this.entities.splice(idx, 1);
    }
  }

  public startHandCrafting(recipe: Recipe) {
    for (const ing of recipe.ingredients) {
      this.player.removeItem(ing.item, ing.amount);
    }
    this.handCraftingQueue.push({ recipe, progress: 0 });
  }

  public startResearch(tech: Technology) {
    this.currentResearch = tech;
    this.researchProgress = 0;
  }

  public advanceResearch(amount: number) {
    if (!this.currentResearch) return;
    this.researchProgress += amount;

    if (this.researchProgress >= this.currentResearch.cost.count) {
      this.unlockedTechs.add(this.currentResearch.id);
      soundManager.playResearchComplete();
      this.currentResearch = null;
      this.researchProgress = 0;
      this.uiManager.updateTechTreeUI();
      this.uiManager.updateHUD();
    }
  }

  public recordProduction(item: ItemId, amount: number) {
    this.productionStats[item] = (this.productionStats[item] || 0) + amount;
  }

  public addParticle(p: Partial<Particle>) {
    this.particles.push({
      x: p.startX || 0,
      y: p.startY || 0,
      vx: p.vx || 0,
      vy: p.vy || 0,
      life: p.life || 0.2,
      maxLife: p.life || 0.2,
      color: p.color || '#fff',
      size: p.size || 2,
      ...p
    });
  }
}
