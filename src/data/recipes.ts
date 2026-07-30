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
    unlockedByTech: 'advanced-electronics-2'
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

  // Rail Network
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

  // Robotics
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

  // Rocket Silo
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

  // Standard Logistics & Production
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
    unlockedByTech: 'logistics-2'
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
    id: 'craft-stone-furnace',
    name: 'Stone Furnace',
    category: 'production',
    craftTime: 0.5,
    ingredients: [{ item: 'stone', amount: 5 }],
    results: [{ item: 'stone-furnace', amount: 1 }],
    madeIn: ['hand', 'assembler']
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
  }
];
