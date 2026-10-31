import { Entity } from './Entity';
import { Direction, ItemId } from '../types';
import { TransportBeltEntity } from './BeltSystem';
import { ChestEntity, FurnaceEntity, AssemblerEntity, MiningDrillEntity, BoilerEntity, LabEntity, OilRefineryEntity, ChemicalPlantEntity } from './ProductionEntities';
import { GunTurretEntity } from './MilitaryEntities';
import { RocketSiloEntity } from './SpecialEntities';

export class InserterEntity extends Entity {
  public heldItem: ItemId | null = null;
  public armAngle: number = 0; // -Math.PI / 2 (pickup) to Math.PI / 2 (dropoff)
  public armState: 'pickup' | 'moving_to_drop' | 'dropoff' | 'moving_to_pick' = 'pickup';
  public armSpeed: number = 2.5; // radians per sec
  public reach: number = 1; // 1 tile reach for normal, 2 for long-handed
  public filterItem: ItemId | null = null;

  constructor(id: string, itemType: ItemId, x: number, y: number, direction: Direction = 0, armSpeed: number = 2.5, reach: number = 1) {
    super(id, itemType, x, y, 1, 1, direction, 80);
    this.armSpeed = armSpeed;
    this.reach = reach;
    this.requiresPower = itemType !== 'burner-inserter';
    this.powerConsumptionKW = 13;
  }

  public getPickupTile(): { x: number; y: number } {
    const vec = this.getDirectionVector();
    return {
      x: this.x - vec.x * this.reach,
      y: this.y - vec.y * this.reach
    };
  }

  public getDropoffTile(): { x: number; y: number } {
    const vec = this.getDirectionVector();
    return {
      x: this.x + vec.x * this.reach,
      y: this.y + vec.y * this.reach
    };
  }

  public update(dt: number, game: any): void {
    if (this.requiresPower && this.powerSatisfied < 0.2) return;

    const speed = this.armSpeed * (this.requiresPower ? this.powerSatisfied : 1.0);

    if (this.armState === 'pickup') {
      if (!this.heldItem) {
        const pickupTile = this.getPickupTile();
        const srcEntity = game.getEntityAt(pickupTile.x, pickupTile.y);

        if (srcEntity) {
          this.heldItem = this.extractItemFromSource(srcEntity);
        }
      }

      if (this.heldItem) {
        this.armState = 'moving_to_drop';
      }
    } else if (this.armState === 'moving_to_drop') {
      this.armAngle += speed * dt;
      if (this.armAngle >= Math.PI) {
        this.armAngle = Math.PI;
        this.armState = 'dropoff';
      }
    } else if (this.armState === 'dropoff') {
      if (this.heldItem) {
        const dropTile = this.getDropoffTile();
        const targetEntity = game.getEntityAt(dropTile.x, dropTile.y);

        if (targetEntity) {
          const success = this.depositItemToTarget(targetEntity, this.heldItem);
          if (success) {
            this.heldItem = null;
            this.armState = 'moving_to_pick';
          }
        }
      } else {
        this.armState = 'moving_to_pick';
      }
    } else if (this.armState === 'moving_to_pick') {
      this.armAngle -= speed * dt;
      if (this.armAngle <= 0) {
        this.armAngle = 0;
        this.armState = 'pickup';
      }
    }
  }

  private extractItemFromSource(src: Entity): ItemId | null {
    if (src instanceof TransportBeltEntity) {
      const beltItem = src.removeItem();
      if (beltItem) {
        if (this.itemType === 'filter-inserter' && this.filterItem && beltItem.item !== this.filterItem) {
          src.addItem(beltItem.item, beltItem.lane, 0.9);
          return null;
        }
        return beltItem.item;
      }
    } else if (src instanceof ChestEntity) {
      return src.takeFirstItem(this.itemType === 'filter-inserter' ? this.filterItem : null);
    } else if (src instanceof FurnaceEntity) {
      return src.takeOutputItem();
    } else if (src instanceof AssemblerEntity) {
      return src.takeOutputItem();
    } else if (src instanceof MiningDrillEntity) {
      return src.takeOutputBuffer();
    } else if (src instanceof LabEntity) {
      return src.takeFirstPack();
    } else if (src instanceof OilRefineryEntity) {
      return src.takeOutputItem();
    } else if (src instanceof ChemicalPlantEntity) {
      return src.takeOutputItem();
    }
    return null;
  }

  private depositItemToTarget(target: Entity, item: ItemId): boolean {
    if (target instanceof TransportBeltEntity) {
      return target.addItem(item, 'left');
    } else if (target instanceof ChestEntity) {
      return target.addItem(item);
    } else if (target instanceof FurnaceEntity) {
      return target.addInputItem(item);
    } else if (target instanceof AssemblerEntity) {
      return target.addInputItem(item);
    } else if (target instanceof BoilerEntity) {
      return target.addFuel(item);
    } else if (target instanceof LabEntity) {
      return target.addSciencePack(item);
    } else if (target instanceof GunTurretEntity) {
      return target.addAmmo(item);
    } else if (target instanceof MiningDrillEntity) {
      return target.addFuel(item);
    } else if (target instanceof OilRefineryEntity) {
      return target.addInputItem(item);
    } else if (target instanceof ChemicalPlantEntity) {
      return target.addInputItem(item);
    } else if (target instanceof RocketSiloEntity) {
      return target.addInputItem(item);
    }
    return false;
  }
}
