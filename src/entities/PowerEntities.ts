import { Entity } from './Entity';
import { Direction, ItemId } from '../types';
import { BoilerEntity } from './ProductionEntities';

export class ElectricPoleEntity extends Entity {
  public wireRange: number;
  public supplyRadius: number;

  constructor(id: string, itemType: ItemId, x: number, y: number, wireRange: number = 6, supplyRadius: number = 2.5) {
    const isSubstation = itemType === 'substation';
    const isMedium = itemType === 'medium-electric-pole';
    super(id, itemType, x, y, isSubstation ? 2 : 1, isSubstation ? 2 : 1, 0, 100);
    this.wireRange = isSubstation ? 18 : isMedium ? 9 : 6;
    this.supplyRadius = isSubstation ? 9 : isMedium ? 3.5 : 2.5;
  }

  public update(dt: number, game: any): void {}
}

export class SteamEngineEntity extends Entity {
  constructor(id: string, itemType: ItemId, x: number, y: number, direction: Direction = 0) {
    super(id, itemType, x, y, 3, 5, direction, 200);
    this.powerProductionKW = 900;
  }

  public update(dt: number, game: any): void {
    // Check boiler nearby
    const center = this.getCenter();
    const adjacent = [
      game.getEntityAt(center.x - 2, center.y),
      game.getEntityAt(center.x + 2, center.y),
      game.getEntityAt(center.x, center.y - 3),
      game.getEntityAt(center.x, center.y + 3)
    ];

    const boiler = adjacent.find(e => e instanceof BoilerEntity && e.steamOutput > 10) as BoilerEntity | undefined;
    if (boiler) {
      this.powerProductionKW = Math.min(900, boiler.steamOutput * 9);
      boiler.steamOutput = Math.max(0, boiler.steamOutput - dt * 15);
    } else {
      this.powerProductionKW = 0;
    }
  }
}

export class SolarPanelEntity extends Entity {
  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 3, 3, 0, 150);
    this.powerProductionKW = 60;
  }

  public update(dt: number, game: any): void {
    const light = game.world.getLightLevel();
    this.powerProductionKW = 60 * light;
  }
}

export class AccumulatorEntity extends Entity {
  public energyMJ: number = 0; // 0 to 5 MJ
  public maxEnergyMJ: number = 5.0;

  constructor(id: string, itemType: ItemId, x: number, y: number) {
    super(id, itemType, x, y, 2, 2, 0, 150);
  }

  public update(dt: number, game: any): void {}

  public charge(amountKW: number, dt: number) {
    const addMJ = (amountKW * dt) / 1000;
    this.energyMJ = Math.min(this.maxEnergyMJ, this.energyMJ + addMJ);
  }

  public discharge(amountKW: number, dt: number): number {
    const reqMJ = (amountKW * dt) / 1000;
    const actualMJ = Math.min(this.energyMJ, reqMJ);
    this.energyMJ -= actualMJ;
    return (actualMJ * 1000) / dt;
  }
}

export class PowerGridManager {
  public totalCapacityKW: number = 0;
  public totalDemandKW: number = 0;
  public satisfactionRatio: number = 1.0;

  public update(dt: number, game: any) {
    let capacity = 0;
    let demand = 0;

    const poles: ElectricPoleEntity[] = [];
    const rawProducers: Entity[] = [];
    const rawConsumers: Entity[] = [];
    const accumulators: AccumulatorEntity[] = [];

    for (const ent of game.entities) {
      if (ent instanceof ElectricPoleEntity) {
        poles.push(ent);
      } else if (ent instanceof SolarPanelEntity || ent instanceof SteamEngineEntity) {
        rawProducers.push(ent);
      } else if (ent instanceof AccumulatorEntity) {
        accumulators.push(ent);
      } else if (ent.requiresPower) {
        rawConsumers.push(ent);
      }
    }

    const isConnectedToPole = (ent: Entity): boolean => {
      const ec = ent.getCenter();
      return poles.some(pole => {
        const pc = pole.getCenter();
        const dist = Math.hypot(ec.x - pc.x, ec.y - pc.y);
        return dist <= pole.supplyRadius + Math.max(ent.width, ent.height) / 2;
      });
    };

    const validProducers = rawProducers.filter(p => isConnectedToPole(p));
    const validConsumers = rawConsumers.filter(c => isConnectedToPole(c));

    for (const p of validProducers) {
      capacity += p.powerProductionKW;
    }
    for (const c of validConsumers) {
      demand += c.powerConsumptionKW;
    }

    this.totalCapacityKW = capacity;
    this.totalDemandKW = demand;

    let satisfaction = 1.0;
    if (demand > 0) {
      if (capacity >= demand) {
        satisfaction = 1.0;
        const surplus = capacity - demand;
        accumulators.forEach(acc => acc.charge(surplus / Math.max(1, accumulators.length), dt));
      } else {
        const deficitKW = demand - capacity;
        let accumulatorKW = 0;
        accumulators.forEach(acc => {
          accumulatorKW += acc.discharge(deficitKW / Math.max(1, accumulators.length), dt);
        });
        const totalAvail = capacity + accumulatorKW;
        satisfaction = Math.min(1.0, totalAvail / demand);
      }
    }

    this.satisfactionRatio = satisfaction;

    // Apply satisfaction ratio to connected consumers, 0 to un-poled consumers
    for (const cons of rawConsumers) {
      cons.powerSatisfied = isConnectedToPole(cons) ? satisfaction : 0.0;
    }
  }
}
