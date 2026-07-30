import { Technology } from '../types';

export const TECHNOLOGIES: Record<string, Technology> = {
  automation: {
    id: 'automation',
    name: 'Automation 1',
    description: 'Key building block for automated production lines and science labs.',
    icon: '⚙️',
    cost: {
      sciencePacks: [{ item: 'science-pack-1', amount: 1 }],
      count: 10,
      timePerUnit: 10
    },
    prerequisites: [],
    unlockedRecipes: ['craft-inserter', 'craft-electric-mining-drill', 'craft-assembling-machine-1']
  },
  electronics: {
    id: 'electronics',
    name: 'Electronics',
    description: 'Basic electronic components for advanced machinery and circuits.',
    icon: '🟩',
    cost: {
      sciencePacks: [{ item: 'science-pack-1', amount: 1 }],
      count: 15,
      timePerUnit: 15
    },
    prerequisites: [],
    unlockedRecipes: ['craft-electronic-circuit']
  },
  logistics: {
    id: 'logistics',
    name: 'Logistics 1',
    description: 'Faster transport belts and splitters for organizing factory lines.',
    icon: '⏩',
    cost: {
      sciencePacks: [{ item: 'science-pack-1', amount: 1 }],
      count: 20,
      timePerUnit: 15
    },
    prerequisites: [],
    unlockedRecipes: ['craft-underground-belt', 'craft-splitter']
  },
  'steel-processing': {
    id: 'steel-processing',
    name: 'Steel Processing',
    description: 'Allows smelting iron plates into durable steel alloy.',
    icon: '🔩',
    cost: {
      sciencePacks: [{ item: 'science-pack-1', amount: 1 }],
      count: 50,
      timePerUnit: 15
    },
    prerequisites: [],
    unlockedRecipes: ['smelt-steel-plate']
  },
  'logistic-science-pack': {
    id: 'logistic-science-pack',
    name: 'Logistics Science Pack',
    description: 'Unlocks Green Science packs to research intermediate and tier 2 tech.',
    icon: '🧪',
    cost: {
      sciencePacks: [{ item: 'science-pack-1', amount: 1 }],
      count: 75,
      timePerUnit: 15
    },
    prerequisites: ['automation', 'logistics'],
    unlockedRecipes: ['craft-science-pack-2']
  },
  railway: {
    id: 'railway',
    name: 'Railway Transport',
    description: 'Unlocks tracks, diesel locomotives, and cargo wagons for high-speed automated transport.',
    icon: '🚂',
    cost: {
      sciencePacks: [
        { item: 'science-pack-1', amount: 1 },
        { item: 'science-pack-2', amount: 1 }
      ],
      count: 100,
      timePerUnit: 20
    },
    prerequisites: ['steel-processing', 'logistic-science-pack'],
    unlockedRecipes: ['craft-rail', 'craft-locomotive', 'craft-cargo-wagon', 'craft-engine-unit']
  },
  robotics: {
    id: 'robotics',
    name: 'Robotics & Drones',
    description: 'Roboports and autonomous construction bots to build blueprints and deconstruct factory zones.',
    icon: '🛸',
    cost: {
      sciencePacks: [
        { item: 'science-pack-1', amount: 1 },
        { item: 'science-pack-2', amount: 1 }
      ],
      count: 150,
      timePerUnit: 25
    },
    prerequisites: ['railway'],
    unlockedRecipes: ['craft-roboport', 'craft-construction-robot']
  },
  'solar-energy': {
    id: 'solar-energy',
    name: 'Solar Energy',
    description: 'Clean, pollution-free electricity generation during day.',
    icon: '☀️',
    cost: {
      sciencePacks: [
        { item: 'science-pack-1', amount: 1 },
        { item: 'science-pack-2', amount: 1 }
      ],
      count: 100,
      timePerUnit: 30
    },
    prerequisites: ['electronics', 'logistic-science-pack'],
    unlockedRecipes: ['craft-solar-panel']
  },
  'advanced-electronics': {
    id: 'advanced-electronics',
    name: 'Advanced Electronics (Red Chips)',
    description: 'Advanced microprocessors using plastic and green chips.',
    icon: '🟥',
    cost: {
      sciencePacks: [
        { item: 'science-pack-1', amount: 1 },
        { item: 'science-pack-2', amount: 1 }
      ],
      count: 120,
      timePerUnit: 30
    },
    prerequisites: ['electronics', 'logistic-science-pack'],
    unlockedRecipes: ['craft-advanced-circuit']
  },
  'rocket-silo': {
    id: 'rocket-silo',
    name: 'Space Rocket Silo (WIN CONDITION)',
    description: 'Unlocks the 9x9 Rocket Silo structure and rocket parts to launch into space and WIN THE GAME!',
    icon: '🚀',
    cost: {
      sciencePacks: [
        { item: 'science-pack-1', amount: 1 },
        { item: 'science-pack-2', amount: 1 }
      ],
      count: 200,
      timePerUnit: 30
    },
    prerequisites: ['robotics', 'advanced-electronics'],
    unlockedRecipes: ['craft-rocket-silo', 'craft-low-density-structure', 'craft-rocket-fuel', 'craft-rocket-control-unit']
  }
};
