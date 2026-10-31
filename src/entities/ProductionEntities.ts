import { Entity } from './Entity';
import { Direction, ItemId, Recipe } from '../types';
import { RECIPES } from '../data/recipes';
import { ITEMS } from '../data/items';
import { soundManager } from '../audio/SoundManager';

export class ChestEntity extends Entity {
  public inventory: { item: ItemId; count: number }[] = [];
  public maxSlots: number;

  constructor(id: string, itemType: ItemId, x: number, y: number, maxSlots: number = 16) {
    super(id, itemType, x, y, 1, 1, 0, 100);
    this.maxSlots = maxSlots;
  }

  public update(dt: number, game: any): void {}

  public addItem(item: ItemId, count: number = 1): boolean {
    const stackLimit = ITEMS[item]?.stackSize || 100;
    // Stack into existing slot
    for (const slot of this.inventory) {
      if (slot.item === item && slot.count < stackLimit) {
        const space = stackLimit - slot.count;
        const add = Math.min(space, count);
        slot.count += add;
        count -= add;
        if (count <= 0) return true;
      }
    }
    // Add new slot
    if (this.inventory.length < this.maxSlots) {
      this.inventory.push({ item, count });
      return true;
    }
    return false;
  }

  public takeFirstItem(filterItem: ItemId | null = null): ItemId | null {
    for (let i = 0; i < this.inventory.length; i++) {
      const slot = this.inventory[i];
      if (slot.count > 0 && (!filterItem || slot.item === filterItem)) {
        slot.count--;
        const item = slot.item;
        if (slot.count <= 0) {
          this.inventory.splice(i, 1);
        }
        return item;
      }
    }
    return null;
  }
}

export class MiningDrillEntity extends Entity {
  public progress: number = 0;
  public miningSpeed: number = 0.5; // items per second
  public outputBuffer: ItemId | null = null;
  public fuelCount: number = 0; // For burner drill

  constructor(id: string, itemType: ItemId, x: number, y: number, direction: Direction = 0) {
    const isElectric = itemType === 'electric-mining-drill';
    super(id, itemType, x, y, isElectric ? 3 : 2, isElectric ? 3 : 2, direction, 150);
    this.requiresPower = isElectric;
    this.miningSpeed = isElectric ? 1.0 : 0.5;
    this.powerConsumptionKW = 90;
  }

  public addFuel(item: ItemId): boolean {
    if ((item === 'coal' || item === 'wood') && !this.requiresPower) {
      if (this.fuelCount < 50) {
        this.fuelCount++;
        return true;
      }
    }
    return false;
  }

  private tryEjectItem(game: any, item: ItemId): boolean {
    const outTile = this.getOutputTile();
    const outEntity = game.getEntityAt(outTile.x, outTile.y);
    if (!outEntity) return false;

    if ('addItem' in outEntity && typeof outEntity.addItem === 'function') {
      return outEntity.addItem(item);
    } else if ('addInputItem' in outEntity && typeof outEntity.addInputItem === 'function') {
      return outEntity.addInputItem(item);
    } else if ('addFuel' in outEntity && typeof outEntity.addFuel === 'function') {
      return outEntity.addFuel(item);
    } else if ('addSciencePack' in outEntity && typeof outEntity.addSciencePack === 'function') {
      return outEntity.addSciencePack(item);
    }
    return false;
  }

  public update(dt: number, game: any): void {
    if (this.outputBuffer) {
      if (this.tryEjectItem(game, this.outputBuffer)) {
        this.outputBuffer = null;
      } else {
        return; // Buffer full
      }
    }

    if (this.requiresPower && this.powerSatisfied < 0.2) return;

    if (!this.requiresPower && this.fuelCount <= 0) {
      return; // Burner drill with no fuel
    }

    if (!this.requiresPower && this.fuelCount > 0) {
      this.fuelCount = Math.max(0, this.fuelCount - dt * 0.05);
    }

    // Mine resource tile under drill footprint (or 5x5 coverage for electric drill)
    let targetTile = null;
    const searchRadius = this.requiresPower ? 2 : 1;

    for (let dx = -searchRadius; dx <= searchRadius && !targetTile; dx++) {
      for (let dy = -searchRadius; dy <= searchRadius && !targetTile; dy++) {
        const tx = Math.floor(this.x + this.width / 2 + dx);
        const ty = Math.floor(this.y + this.height / 2 + dy);
        const tile = game.world.getTile(tx, ty);
        if (tile && (tile.type.includes('ore') || tile.type === 'tree') && tile.resourceAmount > 0) {
          targetTile = tile;
        }
      }
    }

    if (targetTile) {
      const effSpeed = this.miningSpeed * (this.requiresPower ? this.powerSatisfied : 1.0);
      this.progress += dt * effSpeed;

      game.world.addPollution(this.x, this.y, dt * (this.requiresPower ? 0.3 : 0.8));

      if (this.progress >= 1.0) {
        this.progress = 0;
        targetTile.resourceAmount--;

        let minedItem: ItemId = 'stone';
        if (targetTile.type === 'iron-ore') minedItem = 'iron-ore';
        else if (targetTile.type === 'copper-ore') minedItem = 'copper-ore';
        else if (targetTile.type === 'coal-ore') minedItem = 'coal';
        else if (targetTile.type === 'stone-ore') minedItem = 'stone';
        else if (targetTile.type === 'tree') minedItem = 'wood';

        if (targetTile.resourceAmount <= 0) {
          targetTile.type = 'grass';
        }

        if (!this.tryEjectItem(game, minedItem)) {
          this.outputBuffer = minedItem;
        }
      }
    }
  }

  public takeOutputBuffer(): ItemId | null {
    const item = this.outputBuffer;
    this.outputBuffer = null;
    return item;
  }
}

export class FurnaceEntity extends Entity {
  public fuelCount: number = 0;
  public fuelTimer: number = 0;
  public inputItem: ItemId | null = null;
  public inputCount: number = 0;
  public outputItem: ItemId | null = null;
  public outputCount: number = 0;
  public craftProgress: number = 0;
  public craftSpeed: number = 1.0;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    const isElectric = itemType === 'electric-furnace';
    super(id, itemType, x, y, isElectric ? 3 : 2, isElectric ? 3 : 2, 0, 150);
    this.requiresPower = isElectric;
    this.craftSpeed = itemType === 'steel-furnace' ? 2.0 : isElectric ? 2.0 : 1.0;
    this.powerConsumptionKW = 180;
  }

  public update(dt: number, game: any): void {
    if (!this.inputItem || this.inputCount <= 0) return;

    let targetRecipe = RECIPES.find(r => r.madeIn.includes('furnace') && r.ingredients[0].item === this.inputItem);
    if (!targetRecipe) return;

    const neededAmount = targetRecipe.ingredients[0].amount;
    if (this.inputCount < neededAmount) return;

    if (this.requiresPower && this.powerSatisfied < 0.2) return;

    if (!this.requiresPower) {
      if (this.fuelTimer <= 0) {
        if (this.fuelCount > 0) {
          this.fuelCount--;
          this.fuelTimer = 8.0;
        } else {
          return;
        }
      } else {
        this.fuelTimer -= dt;
      }
    }

    const effSpeed = this.craftSpeed * (this.requiresPower ? this.powerSatisfied : 1.0);
    this.craftProgress += (dt * effSpeed) / targetRecipe.craftTime;

    game.world.addPollution(this.x, this.y, dt * 0.4);

    if (this.craftProgress >= 1.0) {
      this.craftProgress = 0;
      this.inputCount -= neededAmount;
      if (this.inputCount <= 0) this.inputItem = null;

      const result = targetRecipe.results[0];
      this.outputItem = result.item;
      this.outputCount += result.amount;
    }
  }

  public addInputItem(item: ItemId): boolean {
    const isSmeltable = RECIPES.some(r => r.madeIn.includes('furnace') && r.ingredients[0].item === item);
    if (isSmeltable) {
      if (!this.inputItem || this.inputItem === item) {
        if (this.inputCount < 50) {
          this.inputItem = item;
          this.inputCount++;
          return true;
        }
      }
    }
    if ((item === 'coal' || item === 'wood') && !this.requiresPower) {
      if (this.fuelCount < 50) {
        this.fuelCount++;
        return true;
      }
    }
    return false;
  }

  public takeOutputItem(): ItemId | null {
    if (this.outputItem && this.outputCount > 0) {
      this.outputCount--;
      const item = this.outputItem;
      if (this.outputCount <= 0) this.outputItem = null;
      return item;
    }
    return null;
  }
}

export class AssemblerEntity extends Entity {
  public activeRecipe: Recipe | null = null;
  public inputs: Record<ItemId, number> = {} as any;
  public outputItem: ItemId | null = null;
  public outputCount: number = 0;
  public craftProgress: number = 0;
  public craftSpeed: number = 0.5;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 3, 3, 0, 200);
    this.requiresPower = true;
    this.craftSpeed = itemType === 'assembling-machine-3' ? 1.25 : itemType === 'assembling-machine-2' ? 0.75 : 0.5;
    this.powerConsumptionKW = 150;
  }

  public setRecipe(recipe: Recipe | null) {
    this.activeRecipe = recipe;
    this.inputs = {} as any;
    this.craftProgress = 0;
  }

  public update(dt: number, game: any): void {
    if (!this.activeRecipe || this.powerSatisfied < 0.2) return;

    const hasAllIngredients = this.activeRecipe.ingredients.every(ing => (this.inputs[ing.item] || 0) >= ing.amount);

    if (hasAllIngredients && this.outputCount < 50) {
      this.craftProgress += (dt * this.craftSpeed * this.powerSatisfied) / this.activeRecipe.craftTime;

      game.world.addPollution(this.x, this.y, dt * 0.2);

      if (this.craftProgress >= 1.0) {
        this.craftProgress = 0;
        for (const ing of this.activeRecipe.ingredients) {
          this.inputs[ing.item] -= ing.amount;
        }
        const res = this.activeRecipe.results[0];
        this.outputItem = res.item;
        this.outputCount += res.amount;

        game.recordProduction(res.item, res.amount);
      }
    }
  }

  public addInputItem(item: ItemId): boolean {
    if (!this.activeRecipe) return false;
    const ing = this.activeRecipe.ingredients.find(i => i.item === item);
    if (ing) {
      const current = this.inputs[item] || 0;
      if (current < ing.amount * 5) {
        this.inputs[item] = current + 1;
        return true;
      }
    }
    return false;
  }

  public takeOutputItem(): ItemId | null {
    if (this.outputItem && this.outputCount > 0) {
      this.outputCount--;
      const item = this.outputItem;
      if (this.outputCount <= 0) this.outputItem = null;
      return item;
    }
    return null;
  }
}

export class OilRefineryEntity extends Entity {
  public activeRecipe: Recipe | null = null;
  public inputs: Record<ItemId, number> = {} as any;
  public outputItem: ItemId | null = null;
  public outputCount: number = 0;
  public craftProgress: number = 0;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 5, 5, 0, 300);
    this.requiresPower = true;
    this.powerConsumptionKW = 420;
  }

  public update(dt: number, game: any): void {
    if (this.powerSatisfied < 0.2) return;

    // Automatic refining of Crude Oil / Plastic
    if (this.inputs['coal'] > 0 && this.outputCount < 50) {
      this.craftProgress += dt * 0.5 * this.powerSatisfied;
      if (this.craftProgress >= 1.0) {
        this.craftProgress = 0;
        this.inputs['coal']--;
        this.outputItem = 'plastic';
        this.outputCount += 2;
        game.recordProduction('plastic', 2);
      }
    }
  }

  public addInputItem(item: ItemId): boolean {
    if (item === 'coal' || item === 'crude-oil') {
      const current = this.inputs[item] || 0;
      if (current < 50) {
        this.inputs[item] = current + 1;
        return true;
      }
    }
    return false;
  }

  public takeOutputItem(): ItemId | null {
    if (this.outputItem && this.outputCount > 0) {
      this.outputCount--;
      const item = this.outputItem;
      if (this.outputCount <= 0) this.outputItem = null;
      return item;
    }
    return null;
  }
}

export class ChemicalPlantEntity extends Entity {
  public activeRecipe: Recipe | null = null;
  public inputs: Record<ItemId, number> = {} as any;
  public outputItem: ItemId | null = null;
  public outputCount: number = 0;
  public craftProgress: number = 0;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 3, 3, 0, 250);
    this.requiresPower = true;
    this.powerConsumptionKW = 210;
  }

  public setRecipe(recipe: Recipe | null) {
    this.activeRecipe = recipe;
    this.inputs = {} as any;
    this.craftProgress = 0;
  }

  public update(dt: number, game: any): void {
    if (!this.activeRecipe || this.powerSatisfied < 0.2) return;

    const hasAll = this.activeRecipe.ingredients.every(ing => (this.inputs[ing.item] || 0) >= ing.amount);
    if (hasAll && this.outputCount < 50) {
      this.craftProgress += (dt * 1.0 * this.powerSatisfied) / this.activeRecipe.craftTime;
      if (this.craftProgress >= 1.0) {
        this.craftProgress = 0;
        for (const ing of this.activeRecipe.ingredients) {
          this.inputs[ing.item] -= ing.amount;
        }
        const res = this.activeRecipe.results[0];
        this.outputItem = res.item;
        this.outputCount += res.amount;
        game.recordProduction(res.item, res.amount);
      }
    }
  }

  public addInputItem(item: ItemId): boolean {
    if (!this.activeRecipe) return false;
    const ing = this.activeRecipe.ingredients.find(i => i.item === item);
    if (ing) {
      const current = this.inputs[item] || 0;
      if (current < ing.amount * 5) {
        this.inputs[item] = current + 1;
        return true;
      }
    }
    return false;
  }

  public takeOutputItem(): ItemId | null {
    if (this.outputItem && this.outputCount > 0) {
      this.outputCount--;
      const item = this.outputItem;
      if (this.outputCount <= 0) this.outputItem = null;
      return item;
    }
    return null;
  }
}

export class FluidTankEntity extends Entity {
  public fluidAmount: number = 0;
  public maxFluid: number = 25000;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 3, 3, 0, 200);
  }

  public update(dt: number, game: any): void {}
}

export class BoilerEntity extends Entity {
  public fuelCount: number = 0;
  public fuelTimer: number = 0;
  public waterLevel: number = 100;
  public steamOutput: number = 0;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 3, 2, 0, 150);
  }

  public update(dt: number, game: any): void {
    if (this.fuelTimer <= 0) {
      if (this.fuelCount > 0) {
        this.fuelCount--;
        this.fuelTimer = 6.0;
      }
    } else {
      this.fuelTimer -= dt;
      this.steamOutput = Math.min(100, this.steamOutput + dt * 20);
      game.world.addPollution(this.x, this.y, dt * 1.2);
    }
  }

  public addFuel(item: ItemId): boolean {
    if (item === 'coal' || item === 'wood') {
      if (this.fuelCount < 50) {
        this.fuelCount++;
        return true;
      }
    }
    return false;
  }
}

export class LabEntity extends Entity {
  public sciencePacks: Record<ItemId, number> = {} as any;
  public researchProgress: number = 0;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 3, 3, 0, 150);
    this.requiresPower = true;
    this.powerConsumptionKW = 60;
  }

  public update(dt: number, game: any): void {
    if (!game.currentResearch || this.powerSatisfied < 0.2) return;

    const tech = game.currentResearch;
    const hasPacks = tech.cost.sciencePacks.every((p: { item: ItemId; amount: number }) => (this.sciencePacks[p.item as ItemId] || 0) > 0);

    if (hasPacks) {
      this.researchProgress += dt * 0.5 * this.powerSatisfied;

      if (this.researchProgress >= tech.cost.timePerUnit) {
        this.researchProgress = 0;
        for (const p of tech.cost.sciencePacks) {
          const itemKey = p.item as ItemId;
          this.sciencePacks[itemKey] = (this.sciencePacks[itemKey] || 1) - 1;
        }
        game.advanceResearch(1);
      }
    }
  }

  public addSciencePack(item: ItemId): boolean {
    if (item.startsWith('science-pack-')) {
      const current = this.sciencePacks[item] || 0;
      if (current < 20) {
        this.sciencePacks[item] = current + 1;
        return true;
      }
    }
    return false;
  }

  public takeFirstPack(): ItemId | null {
    for (const key of Object.keys(this.sciencePacks)) {
      const packId = key as ItemId;
      if ((this.sciencePacks[packId] || 0) > 0) {
        this.sciencePacks[packId]--;
        return packId;
      }
    }
    return null;
  }
}
