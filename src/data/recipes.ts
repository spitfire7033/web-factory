import { Recipe } from '../types';

export const RECIPES: Recipe[] = [
  // Smelting Recipes (Furnace)
  {
    id: 'smelt-iron-plate',
    name: 'Iron Plate',
    category: 'intermediate',
    craftTime: 3.2,
    ingredients: [{ item: 'iron-ore', amount: 1 }],
    results: [{ item: 'iron-plate', amount: 1 }],
    madeIn: ['furnace']
  },
  {
    id: 'smelt-copper-plate',
    name: 'Copper Plate',
    category: 'intermediate',
    craftTime: 3.2,
    ingredients: [{ item: 'copper-ore', amount: 1 }],
    results: [{ item: 'copper-plate', amount: 1 }],
    madeIn: ['furnace']
  },
  {
    id: 'smelt-stone-brick',
    name: 'Stone Brick',
    category: 'intermediate',
    craftTime: 3.2,
    ingredients: [{ item: 'stone', amount: 2 }],
    results: [{ item: 'stone-brick', amount: 1 }],
    madeIn: ['furnace']
  },
  {
    id: 'smelt-steel-plate',
    name: 'Steel Plate',
    category: 'intermediate',
    craftTime: 16.0,
    ingredients: [{ item: 'iron-plate', amount: 5 }],
    results: [{ item: 'steel-plate', amount: 1 }],
    madeIn: ['furnace'],
    unlockedByTech: 'steel-processing'
  },

  // Intermediates & Components
  {
    id: 'craft-iron-gear',
    name: 'Iron Gear Wheel',
    category: 'intermediate',
    craftTime: 0.5,
    ingredients: [{ item: 'iron-plate', amount: 2 }],
    results: [{ item: 'iron-gear', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-copper-wire',
    name: 'Copper Cable',
    category: 'intermediate',
    craftTime: 0.5,
    ingredients: [{ item: 'copper-plate', amount: 1 }],
    results: [{ item: 'copper-wire', amount: 2 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-electronic-circuit',
    name: 'Electronic Circuit (Green)',
    category: 'intermediate',
    craftTime: 0.5,
    ingredients: [
      { item: 'iron-plate', amount: 1 },
      { item: 'copper-wire', amount: 3 }
    ],
    results: [{ item: 'electronic-circuit', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'electronics'
  },
  {
    id: 'craft-plastic',
    name: 'Plastic Bar',
    category: 'intermediate',
    craftTime: 1.0,
    ingredients: [
      { item: 'coal', amount: 1 },
      { item: 'wood', amount: 1 }
    ],
    results: [{ item: 'plastic', amount: 2 }],
    madeIn: ['hand', 'chemical', 'refinery', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },
  {
    id: 'craft-sulfur',
    name: 'Sulfur',
    category: 'intermediate',
    craftTime: 1.0,
    ingredients: [
      { item: 'coal', amount: 1 },
      { item: 'stone', amount: 1 }
    ],
    results: [{ item: 'sulfur', amount: 2 }],
    madeIn: ['hand', 'chemical', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },
  {
    id: 'craft-battery',
    name: 'Battery',
    category: 'intermediate',
    craftTime: 4.0,
    ingredients: [
      { item: 'iron-plate', amount: 1 },
      { item: 'copper-plate', amount: 1 },
      { item: 'sulfur', amount: 1 }
    ],
    results: [{ item: 'battery', amount: 1 }],
    madeIn: ['hand', 'chemical', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },
  {
    id: 'craft-advanced-circuit',
    name: 'Advanced Circuit (Red)',
    category: 'intermediate',
    craftTime: 6.0,
    ingredients: [
      { item: 'electronic-circuit', amount: 2 },
      { item: 'plastic', amount: 2 },
      { item: 'copper-wire', amount: 4 }
    ],
    results: [{ item: 'advanced-circuit', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },
  {
    id: 'craft-processing-unit',
    name: 'Processing Unit (Blue)',
    category: 'intermediate',
    craftTime: 10.0,
    ingredients: [
      { item: 'electronic-circuit', amount: 20 },
      { item: 'advanced-circuit', amount: 2 }
    ],
    results: [{ item: 'processing-unit', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },
  {
    id: 'craft-engine-unit',
    name: 'Engine Unit',
    category: 'intermediate',
    craftTime: 10.0,
    ingredients: [
      { item: 'steel-plate', amount: 1 },
      { item: 'iron-gear', amount: 1 }
    ],
    results: [{ item: 'engine-unit', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'railway'
  },

  // High-Tech Rocket Recipe Components
  {
    id: 'craft-low-density-structure',
    name: 'Low Density Structure',
    category: 'intermediate',
    craftTime: 20.0,
    ingredients: [
      { item: 'steel-plate', amount: 2 },
      { item: 'copper-plate', amount: 20 },
      { item: 'plastic', amount: 5 }
    ],
    results: [{ item: 'low-density-structure', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'rocket-silo'
  },
  {
    id: 'craft-rocket-fuel',
    name: 'Rocket Fuel',
    category: 'intermediate',
    craftTime: 30.0,
    ingredients: [
      { item: 'coal', amount: 10 },
      { item: 'wood', amount: 10 }
    ],
    results: [{ item: 'rocket-fuel', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'rocket-silo'
  },
  {
    id: 'craft-rocket-control-unit',
    name: 'Rocket Control Unit',
    category: 'intermediate',
    craftTime: 30.0,
    ingredients: [
      { item: 'processing-unit', amount: 1 },
      { item: 'advanced-circuit', amount: 1 }
    ],
    results: [{ item: 'rocket-control-unit', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'rocket-silo'
  },

  // Science Packs
  {
    id: 'craft-science-pack-1',
    name: 'Automation Science Pack (Red)',
    category: 'intermediate',
    craftTime: 5.0,
    ingredients: [
      { item: 'copper-plate', amount: 1 },
      { item: 'iron-gear', amount: 1 }
    ],
    results: [{ item: 'science-pack-1', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-science-pack-2',
    name: 'Logistics Science Pack (Green)',
    category: 'intermediate',
    craftTime: 6.0,
    ingredients: [
      { item: 'transport-belt', amount: 1 },
      { item: 'inserter', amount: 1 }
    ],
    results: [{ item: 'science-pack-2', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'logistic-science-pack'
  },
  {
    id: 'craft-science-pack-3',
    name: 'Military Science Pack (Black)',
    category: 'intermediate',
    craftTime: 10.0,
    ingredients: [
      { item: 'stone-wall', amount: 1 },
      { item: 'grenade', amount: 1 },
      { item: 'firearm-magazine', amount: 1 }
    ],
    results: [{ item: 'science-pack-3', amount: 2 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'railway'
  },
  {
    id: 'craft-science-pack-4',
    name: 'Chemical Science Pack (Blue)',
    category: 'intermediate',
    craftTime: 24.0,
    ingredients: [
      { item: 'engine-unit', amount: 1 },
      { item: 'advanced-circuit', amount: 1 },
      { item: 'sulfur', amount: 1 }
    ],
    results: [{ item: 'science-pack-4', amount: 2 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },

  // Logistics Infrastructure
  {
    id: 'craft-transport-belt',
    name: 'Transport Belt',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'iron-plate', amount: 1 },
      { item: 'iron-gear', amount: 1 }
    ],
    results: [{ item: 'transport-belt', amount: 2 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-fast-transport-belt',
    name: 'Fast Transport Belt',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'transport-belt', amount: 1 },
      { item: 'iron-gear', amount: 5 }
    ],
    results: [{ item: 'fast-transport-belt', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'logistics'
  },
  {
    id: 'craft-express-transport-belt',
    name: 'Express Transport Belt',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'fast-transport-belt', amount: 1 },
      { item: 'iron-gear', amount: 10 }
    ],
    results: [{ item: 'express-transport-belt', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'logistics'
  },
  {
    id: 'craft-underground-belt',
    name: 'Underground Belt',
    category: 'logistics',
    craftTime: 1.0,
    ingredients: [
      { item: 'transport-belt', amount: 5 },
      { item: 'iron-plate', amount: 10 }
    ],
    results: [{ item: 'underground-belt', amount: 2 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'logistics'
  },
  {
    id: 'craft-splitter',
    name: 'Splitter',
    category: 'logistics',
    craftTime: 1.0,
    ingredients: [
      { item: 'transport-belt', amount: 4 },
      { item: 'iron-gear', amount: 5 },
      { item: 'electronic-circuit', amount: 5 }
    ],
    results: [{ item: 'splitter', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'logistics'
  },

  // Inserters
  {
    id: 'craft-burner-inserter',
    name: 'Burner Inserter',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'iron-plate', amount: 1 },
      { item: 'iron-gear', amount: 1 }
    ],
    results: [{ item: 'burner-inserter', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-inserter',
    name: 'Electric Inserter',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'electronic-circuit', amount: 1 },
      { item: 'iron-gear', amount: 1 },
      { item: 'iron-plate', amount: 1 }
    ],
    results: [{ item: 'inserter', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'automation'
  },
  {
    id: 'craft-fast-inserter',
    name: 'Fast Inserter',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'inserter', amount: 1 },
      { item: 'electronic-circuit', amount: 2 },
      { item: 'iron-plate', amount: 2 }
    ],
    results: [{ item: 'fast-inserter', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'automation'
  },
  {
    id: 'craft-long-handed-inserter',
    name: 'Long-handed Inserter',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'inserter', amount: 1 },
      { item: 'iron-gear', amount: 1 },
      { item: 'iron-plate', amount: 1 }
    ],
    results: [{ item: 'long-handed-inserter', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'automation'
  },
  {
    id: 'craft-filter-inserter',
    name: 'Filter Inserter',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'fast-inserter', amount: 1 },
      { item: 'electronic-circuit', amount: 4 }
    ],
    results: [{ item: 'filter-inserter', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'electronics'
  },

  // Storage
  {
    id: 'craft-wooden-chest',
    name: 'Wooden Chest',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [{ item: 'wood', amount: 4 }],
    results: [{ item: 'wooden-chest', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-iron-chest',
    name: 'Iron Chest',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [{ item: 'iron-plate', amount: 8 }],
    results: [{ item: 'iron-chest', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-steel-chest',
    name: 'Steel Chest',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [{ item: 'steel-plate', amount: 8 }],
    results: [{ item: 'steel-chest', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'steel-processing'
  },

  // Pipes & Fluids
  {
    id: 'craft-pipe',
    name: 'Pipe',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [{ item: 'iron-plate', amount: 1 }],
    results: [{ item: 'pipe', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-underground-pipe',
    name: 'Underground Pipe',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'pipe', amount: 10 },
      { item: 'iron-plate', amount: 5 }
    ],
    results: [{ item: 'underground-pipe', amount: 2 }],
    madeIn: ['hand', 'assembler']
  },

  // Production Machines
  {
    id: 'craft-burner-mining-drill',
    name: 'Burner Mining Drill',
    category: 'production',
    craftTime: 2.0,
    ingredients: [
      { item: 'iron-gear', amount: 3 },
      { item: 'stone-furnace', amount: 1 },
      { item: 'iron-plate', amount: 3 }
    ],
    results: [{ item: 'burner-mining-drill', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-electric-mining-drill',
    name: 'Electric Mining Drill',
    category: 'production',
    craftTime: 2.0,
    ingredients: [
      { item: 'electronic-circuit', amount: 3 },
      { item: 'iron-gear', amount: 5 },
      { item: 'iron-plate', amount: 10 }
    ],
    results: [{ item: 'electric-mining-drill', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'automation'
  },
  {
    id: 'craft-stone-furnace',
    name: 'Stone Furnace',
    category: 'production',
    craftTime: 0.5,
    ingredients: [{ item: 'stone', amount: 5 }],
    results: [{ item: 'stone-furnace', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-steel-furnace',
    name: 'Steel Furnace',
    category: 'production',
    craftTime: 3.0,
    ingredients: [
      { item: 'steel-plate', amount: 6 },
      { item: 'stone-brick', amount: 8 }
    ],
    results: [{ item: 'steel-furnace', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'steel-processing'
  },
  {
    id: 'craft-electric-furnace',
    name: 'Electric Furnace',
    category: 'production',
    craftTime: 5.0,
    ingredients: [
      { item: 'steel-plate', amount: 10 },
      { item: 'stone-brick', amount: 10 },
      { item: 'advanced-circuit', amount: 5 }
    ],
    results: [{ item: 'electric-furnace', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },
  {
    id: 'craft-assembling-machine-1',
    name: 'Assembling Machine 1',
    category: 'production',
    craftTime: 2.0,
    ingredients: [
      { item: 'electronic-circuit', amount: 3 },
      { item: 'iron-gear', amount: 5 },
      { item: 'iron-plate', amount: 9 }
    ],
    results: [{ item: 'assembling-machine-1', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'automation'
  },
  {
    id: 'craft-assembling-machine-2',
    name: 'Assembling Machine 2',
    category: 'production',
    craftTime: 0.5,
    ingredients: [
      { item: 'assembling-machine-1', amount: 1 },
      { item: 'iron-gear', amount: 5 },
      { item: 'electronic-circuit', amount: 3 },
      { item: 'iron-plate', amount: 9 }
    ],
    results: [{ item: 'assembling-machine-2', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'automation'
  },
  {
    id: 'craft-assembling-machine-3',
    name: 'Assembling Machine 3',
    category: 'production',
    craftTime: 0.5,
    ingredients: [
      { item: 'assembling-machine-2', amount: 2 },
      { item: 'processing-unit', amount: 4 }
    ],
    results: [{ item: 'assembling-machine-3', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },
  {
    id: 'craft-oil-refinery',
    name: 'Oil Refinery',
    category: 'production',
    craftTime: 10.0,
    ingredients: [
      { item: 'steel-plate', amount: 15 },
      { item: 'iron-gear', amount: 10 },
      { item: 'stone-brick', amount: 10 },
      { item: 'electronic-circuit', amount: 10 }
    ],
    results: [{ item: 'oil-refinery', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },
  {
    id: 'craft-chemical-plant',
    name: 'Chemical Plant',
    category: 'production',
    craftTime: 5.0,
    ingredients: [
      { item: 'steel-plate', amount: 5 },
      { item: 'iron-gear', amount: 5 },
      { item: 'electronic-circuit', amount: 5 },
      { item: 'pipe', amount: 5 }
    ],
    results: [{ item: 'chemical-plant', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },
  {
    id: 'craft-offshore-pump',
    name: 'Offshore Pump',
    category: 'production',
    craftTime: 0.5,
    ingredients: [
      { item: 'electronic-circuit', amount: 2 },
      { item: 'pipe', amount: 1 },
      { item: 'iron-gear', amount: 1 }
    ],
    results: [{ item: 'offshore-pump', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-fluid-tank',
    name: 'Fluid Storage Tank',
    category: 'production',
    craftTime: 3.0,
    ingredients: [
      { item: 'iron-plate', amount: 20 },
      { item: 'steel-plate', amount: 5 }
    ],
    results: [{ item: 'fluid-tank', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-lab',
    name: 'Lab',
    category: 'production',
    craftTime: 2.0,
    ingredients: [
      { item: 'electronic-circuit', amount: 10 },
      { item: 'iron-gear', amount: 10 },
      { item: 'transport-belt', amount: 4 }
    ],
    results: [{ item: 'lab', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'automation'
  },

  // Power Infrastructure
  {
    id: 'craft-boiler',
    name: 'Boiler',
    category: 'production',
    craftTime: 0.5,
    ingredients: [
      { item: 'stone-furnace', amount: 1 },
      { item: 'pipe', amount: 4 }
    ],
    results: [{ item: 'boiler', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-steam-engine',
    name: 'Steam Engine',
    category: 'production',
    craftTime: 0.5,
    ingredients: [
      { item: 'iron-gear', amount: 8 },
      { item: 'pipe', amount: 5 },
      { item: 'iron-plate', amount: 10 }
    ],
    results: [{ item: 'steam-engine', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-solar-panel',
    name: 'Solar Panel',
    category: 'production',
    craftTime: 10.0,
    ingredients: [
      { item: 'copper-plate', amount: 5 },
      { item: 'electronic-circuit', amount: 15 },
      { item: 'steel-plate', amount: 5 }
    ],
    results: [{ item: 'solar-panel', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'solar-energy'
  },
  {
    id: 'craft-accumulator',
    name: 'Accumulator',
    category: 'production',
    craftTime: 10.0,
    ingredients: [
      { item: 'iron-plate', amount: 2 },
      { item: 'battery', amount: 5 }
    ],
    results: [{ item: 'accumulator', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'solar-energy'
  },
  {
    id: 'craft-small-electric-pole',
    name: 'Small Electric Pole',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'wood', amount: 1 },
      { item: 'copper-wire', amount: 1 }
    ],
    results: [{ item: 'small-electric-pole', amount: 2 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-medium-electric-pole',
    name: 'Medium Electric Pole',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'steel-plate', amount: 2 },
      { item: 'copper-wire', amount: 2 }
    ],
    results: [{ item: 'medium-electric-pole', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'steel-processing'
  },
  {
    id: 'craft-substation',
    name: 'Substation',
    category: 'logistics',
    craftTime: 2.0,
    ingredients: [
      { item: 'steel-plate', amount: 10 },
      { item: 'advanced-circuit', amount: 5 },
      { item: 'copper-wire', amount: 5 }
    ],
    results: [{ item: 'substation', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'advanced-electronics'
  },

  // Rail & Robotics
  {
    id: 'craft-rail',
    name: 'Straight Rail',
    category: 'logistics',
    craftTime: 0.5,
    ingredients: [
      { item: 'stone', amount: 1 },
      { item: 'iron-plate', amount: 1 }
    ],
    results: [{ item: 'rail', amount: 2 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'railway'
  },
  {
    id: 'craft-locomotive',
    name: 'Diesel Locomotive',
    category: 'logistics',
    craftTime: 10.0,
    ingredients: [
      { item: 'engine-unit', amount: 20 },
      { item: 'steel-plate', amount: 30 },
      { item: 'electronic-circuit', amount: 10 }
    ],
    results: [{ item: 'locomotive', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'railway'
  },
  {
    id: 'craft-cargo-wagon',
    name: 'Cargo Wagon',
    category: 'logistics',
    craftTime: 5.0,
    ingredients: [
      { item: 'iron-gear', amount: 10 },
      { item: 'iron-plate', amount: 20 },
      { item: 'steel-plate', amount: 20 }
    ],
    results: [{ item: 'cargo-wagon', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'railway'
  },
  {
    id: 'craft-roboport',
    name: 'Roboport',
    category: 'logistics',
    craftTime: 15.0,
    ingredients: [
      { item: 'steel-plate', amount: 45 },
      { item: 'iron-gear', amount: 45 },
      { item: 'advanced-circuit', amount: 45 }
    ],
    results: [{ item: 'roboport', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'robotics'
  },
  {
    id: 'craft-construction-robot',
    name: 'Construction Robot',
    category: 'logistics',
    craftTime: 10.0,
    ingredients: [
      { item: 'engine-unit', amount: 1 },
      { item: 'electronic-circuit', amount: 2 }
    ],
    results: [{ item: 'construction-robot', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'robotics'
  },
  {
    id: 'craft-rocket-silo',
    name: 'Rocket Silo',
    category: 'production',
    craftTime: 30.0,
    ingredients: [
      { item: 'steel-plate', amount: 100 },
      { item: 'stone-brick', amount: 100 },
      { item: 'processing-unit', amount: 50 }
    ],
    results: [{ item: 'rocket-silo', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'rocket-silo'
  },

  // Combat & Defense
  {
    id: 'craft-stone-wall',
    name: 'Stone Wall',
    category: 'combat',
    craftTime: 0.5,
    ingredients: [{ item: 'stone-brick', amount: 5 }],
    results: [{ item: 'stone-wall', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-gun-turret',
    name: 'Gun Turret',
    category: 'combat',
    craftTime: 8.0,
    ingredients: [
      { item: 'iron-plate', amount: 20 },
      { item: 'iron-gear', amount: 10 },
      { item: 'copper-plate', amount: 10 }
    ],
    results: [{ item: 'gun-turret', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-laser-turret',
    name: 'Laser Turret',
    category: 'combat',
    craftTime: 20.0,
    ingredients: [
      { item: 'steel-plate', amount: 20 },
      { item: 'electronic-circuit', amount: 20 },
      { item: 'battery', amount: 12 }
    ],
    results: [{ item: 'laser-turret', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'solar-energy'
  },
  {
    id: 'craft-firearm-magazine',
    name: 'Firearm Magazine',
    category: 'combat',
    craftTime: 1.0,
    ingredients: [{ item: 'iron-plate', amount: 4 }],
    results: [{ item: 'firearm-magazine', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-piercing-rounds-magazine',
    name: 'Piercing Rounds Magazine',
    category: 'combat',
    craftTime: 3.0,
    ingredients: [
      { item: 'firearm-magazine', amount: 1 },
      { item: 'copper-plate', amount: 5 },
      { item: 'steel-plate', amount: 1 }
    ],
    results: [{ item: 'piercing-rounds-magazine', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'steel-processing'
  },
  {
    id: 'craft-grenade',
    name: 'Grenade',
    category: 'combat',
    craftTime: 8.0,
    ingredients: [
      { item: 'iron-plate', amount: 5 },
      { item: 'coal', amount: 10 }
    ],
    results: [{ item: 'grenade', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-pistol',
    name: 'Pistol',
    category: 'combat',
    craftTime: 0.5,
    ingredients: [
      { item: 'copper-plate', amount: 5 },
      { item: 'iron-plate', amount: 5 }
    ],
    results: [{ item: 'pistol', amount: 1 }],
    madeIn: ['hand', 'assembler']
  },
  {
    id: 'craft-submachine-gun',
    name: 'Submachine Gun',
    category: 'combat',
    craftTime: 10.0,
    ingredients: [
      { item: 'iron-gear', amount: 10 },
      { item: 'copper-plate', amount: 10 },
      { item: 'steel-plate', amount: 5 }
    ],
    results: [{ item: 'submachine-gun', amount: 1 }],
    madeIn: ['hand', 'assembler'],
    unlockedByTech: 'steel-processing'
  }
];
