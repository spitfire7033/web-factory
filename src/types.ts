export type Direction = 0 | 1 | 2 | 3; // 0: North, 1: East, 2: South, 3: West

export type DifficultyMode = 'peaceful' | 'normal' | 'deathworld' | 'sandbox';

export type ItemId =
  // Raw Ores & Minerals
  | 'wood'
  | 'coal'
  | 'iron-ore'
  | 'copper-ore'
  | 'stone'
  | 'crude-oil'

  // Intermediate Products
  | 'iron-plate'
  | 'copper-plate'
  | 'stone-brick'
  | 'steel-plate'
  | 'iron-gear'
  | 'copper-wire'
  | 'electronic-circuit' // Green chip
  | 'advanced-circuit'   // Red chip
  | 'processing-unit'   // Blue chip
  | 'plastic'
  | 'sulfur'
  | 'battery'
  | 'engine-unit'

  // High-Tech & Rocket Components
  | 'low-density-structure'
  | 'rocket-fuel'
  | 'rocket-control-unit'
  | 'rocket-part'

  // Science Packs
  | 'science-pack-1' // Automation (Red)
  | 'science-pack-2' // Logistics (Green)
  | 'science-pack-3' // Military (Black)
  | 'science-pack-4' // Chemical (Blue)

  // Transport & Logistics
  | 'transport-belt'
  | 'fast-transport-belt'
  | 'express-transport-belt'
  | 'underground-belt'
  | 'splitter'
  | 'burner-inserter'
  | 'inserter'
  | 'fast-inserter'
  | 'long-handed-inserter'
  | 'filter-inserter'

  // Rail Network
  | 'rail'
  | 'train-stop'
  | 'locomotive'
  | 'cargo-wagon'

  // Robotics & Automation
  | 'roboport'
  | 'construction-robot'
  | 'logistic-robot'

  // Storage & Production Entities
  | 'wooden-chest'
  | 'iron-chest'
  | 'steel-chest'
  | 'burner-mining-drill'
  | 'electric-mining-drill'
  | 'offshore-pump'
  | 'stone-furnace'
  | 'steel-furnace'
  | 'electric-furnace'
  | 'assembling-machine-1'
  | 'assembling-machine-2'
  | 'assembling-machine-3'
  | 'oil-refinery'
  | 'chemical-plant'
  | 'fluid-tank'
  | 'lab'
  | 'rocket-silo'

  // Power Infrastructure
  | 'boiler'
  | 'steam-engine'
  | 'solar-panel'
  | 'accumulator'
  | 'small-electric-pole'
  | 'medium-electric-pole'
  | 'substation'
  | 'pipe'
  | 'underground-pipe'

  // Combat & Defense
  | 'stone-wall'
  | 'gun-turret'
  | 'laser-turret'
  | 'firearm-magazine'
  | 'piercing-rounds-magazine'
  | 'pistol'
  | 'submachine-gun'
  | 'grenade'
  
  // Tools
  | 'blueprint-tool'
  | 'deconstruction-tool';

export type Category = 'logistics' | 'production' | 'intermediate' | 'combat';

export interface ItemDef {
  id: ItemId;
  name: string;
  category: Category;
  stackSize: number;
  description: string;
  iconColor: string;
  symbol: string;
  placeableEntity?: string;
}

export interface Ingredient {
  item: ItemId;
  amount: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  craftTime: number; // in seconds
  ingredients: Ingredient[];
  results: Ingredient[];
  madeIn: ('hand' | 'assembler' | 'furnace' | 'refinery' | 'chemical' | 'silo')[];
  unlockedByTech?: string;
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: {
    sciencePacks: { item: ItemId; amount: number }[];
    count: number; // total units needed
    timePerUnit: number; // seconds
  };
  prerequisites: string[];
  unlockedRecipes: string[];
  unlockedEntities?: ItemId[];
}

export type TileType = 'grass' | 'dirt' | 'sand' | 'water' | 'tree' | 'iron-ore' | 'copper-ore' | 'coal-ore' | 'stone-ore';

export interface Tile {
  type: TileType;
  resourceAmount: number; // For ore patches / trees
  treeVariant?: number;
}

export interface ItemStack {
  item: ItemId;
  count: number;
}

export interface BuildingCost {
  item: ItemId;
  count: number;
}

export interface InventorySlot {
  item: ItemId | null;
  count: number;
}
