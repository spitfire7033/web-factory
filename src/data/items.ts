import { ItemDef, ItemId } from '../types';

export const ITEMS: Record<ItemId, ItemDef> = {
  // Raw Ores
  wood: {
    id: 'wood',
    name: 'Wood',
    category: 'intermediate',
    stackSize: 100,
    description: 'Harvested from trees. Basic fuel and crafting ingredient.',
    iconColor: '#8B4513',
    symbol: '🪵'
  },
  coal: {
    id: 'coal',
    name: 'Coal',
    category: 'intermediate',
    stackSize: 100,
    description: 'Fossil fuel used in furnaces, boilers, and burner drills.',
    iconColor: '#2b2b2b',
    symbol: '⬛'
  },
  'iron-ore': {
    id: 'iron-ore',
    name: 'Iron Ore',
    category: 'intermediate',
    stackSize: 100,
    description: 'Raw iron mined from patches. Smelted into Iron Plates.',
    iconColor: '#8a9ea7',
    symbol: '⛰️'
  },
  'copper-ore': {
    id: 'copper-ore',
    name: 'Copper Ore',
    category: 'intermediate',
    stackSize: 100,
    description: 'Raw copper mined from patches. Smelted into Copper Plates.',
    iconColor: '#c87d55',
    symbol: '🪨'
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    category: 'intermediate',
    stackSize: 100,
    description: 'Basic mineral used for bricks, furnaces, and walls.',
    iconColor: '#969696',
    symbol: '🪨'
  },
  'crude-oil': {
    id: 'crude-oil',
    name: 'Crude Oil',
    category: 'intermediate',
    stackSize: 100,
    description: 'Black liquid extracted with Pumpjacks. Refined into plastics and fuel.',
    iconColor: '#1a1a24',
    symbol: '🛢️'
  },

  // Intermediates
  'iron-plate': {
    id: 'iron-plate',
    name: 'Iron Plate',
    category: 'intermediate',
    stackSize: 100,
    description: 'Primary structural material for machinery and infrastructure.',
    iconColor: '#b0bec5',
    symbol: '⬜'
  },
  'copper-plate': {
    id: 'copper-plate',
    name: 'Copper Plate',
    category: 'intermediate',
    stackSize: 100,
    description: 'Primary electrical conductor for wire and electronics.',
    iconColor: '#d7ccc8',
    symbol: '🟧'
  },
  'stone-brick': {
    id: 'stone-brick',
    name: 'Stone Brick',
    category: 'intermediate',
    stackSize: 100,
    description: 'Processed stone used for walls and advanced furnaces.',
    iconColor: '#78909c',
    symbol: '🧱'
  },
  'steel-plate': {
    id: 'steel-plate',
    name: 'Steel Plate',
    category: 'intermediate',
    stackSize: 100,
    description: 'Refined iron alloy. High strength for advanced structures.',
    iconColor: '#546e7a',
    symbol: '🔩'
  },
  'iron-gear': {
    id: 'iron-gear',
    name: 'Iron Gear Wheel',
    category: 'intermediate',
    stackSize: 100,
    description: 'Mechanical component for belts, inserters, and assemblers.',
    iconColor: '#90a4ae',
    symbol: '⚙️'
  },
  'copper-wire': {
    id: 'copper-wire',
    name: 'Copper Cable',
    category: 'intermediate',
    stackSize: 200,
    description: 'Conductive wire for electronics and power grid poles.',
    iconColor: '#ffb74d',
    symbol: '〰️'
  },
  'electronic-circuit': {
    id: 'electronic-circuit',
    name: 'Electronic Circuit (Green)',
    category: 'intermediate',
    stackSize: 200,
    description: 'Basic logic board for automated inserters, splitters, and technology.',
    iconColor: '#4caf50',
    symbol: '🟩'
  },
  'advanced-circuit': {
    id: 'advanced-circuit',
    name: 'Advanced Circuit (Red)',
    category: 'intermediate',
    stackSize: 200,
    description: 'Microprocessor circuit for high-tech machinery and science.',
    iconColor: '#e53935',
    symbol: '🟥'
  },
  'processing-unit': {
    id: 'processing-unit',
    name: 'Processing Unit (Blue)',
    category: 'intermediate',
    stackSize: 100,
    description: 'High-density computational unit for endgame technology.',
    iconColor: '#1e88e5',
    symbol: '🟦'
  },
  plastic: {
    id: 'plastic',
    name: 'Plastic Bar',
    category: 'intermediate',
    stackSize: 100,
    description: 'Petrochemical polymer essential for Red Circuits.',
    iconColor: '#eceff1',
    symbol: '🍬'
  },
  sulfur: {
    id: 'sulfur',
    name: 'Sulfur',
    category: 'intermediate',
    stackSize: 100,
    description: 'Chemical reactant for batteries and explosives.',
    iconColor: '#fdd835',
    symbol: '🟡'
  },
  battery: {
    id: 'battery',
    name: 'Battery',
    category: 'intermediate',
    stackSize: 100,
    description: 'Chemical energy storage element for accumulators and laser turrets.',
    iconColor: '#fb8c00',
    symbol: '🔋'
  },
  'engine-unit': {
    id: 'engine-unit',
    name: 'Engine Unit',
    category: 'intermediate',
    stackSize: 50,
    description: 'Heavy motor for pumps, trains, and robotics.',
    iconColor: '#6d4c41',
    symbol: '🚜'
  },

  // High-Tech & Rocket Components
  'low-density-structure': {
    id: 'low-density-structure',
    name: 'Low Density Structure',
    category: 'intermediate',
    stackSize: 100,
    description: 'Lightweight titanium-steel alloy matrix for space rockets.',
    iconColor: '#90a4ae',
    symbol: '🏗️'
  },
  'rocket-fuel': {
    id: 'rocket-fuel',
    name: 'Rocket Fuel',
    category: 'intermediate',
    stackSize: 100,
    description: 'Concentrated solid fuel for launching the space rocket.',
    iconColor: '#ff6d00',
    symbol: '🚀'
  },
  'rocket-control-unit': {
    id: 'rocket-control-unit',
    name: 'Rocket Control Unit',
    category: 'intermediate',
    stackSize: 100,
    description: 'Guidance computer for rocket flight trajectories.',
    iconColor: '#29b6f6',
    symbol: '🎛️'
  },
  'rocket-part': {
    id: 'rocket-part',
    name: 'Rocket Part',
    category: 'intermediate',
    stackSize: 100,
    description: 'Completed rocket component built inside Rocket Silo.',
    iconColor: '#ff3d00',
    symbol: '🧩'
  },

  // Science Packs
  'science-pack-1': {
    id: 'science-pack-1',
    name: 'Automation Science Pack (Red)',
    category: 'intermediate',
    stackSize: 200,
    description: 'Used in Labs to research basic industrial tech.',
    iconColor: '#f44336',
    symbol: '🧪'
  },
  'science-pack-2': {
    id: 'science-pack-2',
    name: 'Logistics Science Pack (Green)',
    category: 'intermediate',
    stackSize: 200,
    description: 'Used in Labs to research transport, circuits, and solar power.',
    iconColor: '#4caf50',
    symbol: '🧪'
  },
  'science-pack-3': {
    id: 'science-pack-3',
    name: 'Military Science Pack (Black)',
    category: 'intermediate',
    stackSize: 200,
    description: 'Used in Labs to research advanced armaments, walls, and laser defense.',
    iconColor: '#37474f',
    symbol: '🧪'
  },
  'science-pack-4': {
    id: 'science-pack-4',
    name: 'Chemical Science Pack (Blue)',
    category: 'intermediate',
    stackSize: 200,
    description: 'Used in Labs for advanced petrochemical and processing units.',
    iconColor: '#00bcd4',
    symbol: '🧪'
  },

  // Logistics Entities
  'transport-belt': {
    id: 'transport-belt',
    name: 'Transport Belt',
    category: 'logistics',
    stackSize: 100,
    description: 'Moves items forward at 1.875 items/sec.',
    iconColor: '#fbc02d',
    symbol: '⏩',
    placeableEntity: 'transport-belt'
  },
  'fast-transport-belt': {
    id: 'fast-transport-belt',
    name: 'Fast Transport Belt',
    category: 'logistics',
    stackSize: 100,
    description: 'Moves items forward at 3.75 items/sec (Red).',
    iconColor: '#e53935',
    symbol: '⏩',
    placeableEntity: 'fast-transport-belt'
  },
  'express-transport-belt': {
    id: 'express-transport-belt',
    name: 'Express Transport Belt',
    category: 'logistics',
    stackSize: 100,
    description: 'Moves items forward at 5.625 items/sec (Blue).',
    iconColor: '#1e88e5',
    symbol: '⏩',
    placeableEntity: 'express-transport-belt'
  },
  'underground-belt': {
    id: 'underground-belt',
    name: 'Underground Belt',
    category: 'logistics',
    stackSize: 50,
    description: 'Allows transport belts to cross under structures up to 5 tiles.',
    iconColor: '#fb8c00',
    symbol: '🕳️',
    placeableEntity: 'underground-belt'
  },
  splitter: {
    id: 'splitter',
    name: 'Splitter',
    category: 'logistics',
    stackSize: 50,
    description: 'Splits incoming belt items 1:1 onto two parallel outgoing belts.',
    iconColor: '#fbc02d',
    symbol: '🔀',
    placeableEntity: 'splitter'
  },
  'burner-inserter': {
    id: 'burner-inserter',
    name: 'Burner Inserter',
    category: 'logistics',
    stackSize: 50,
    description: 'Moves items between containers/belts. Fueled by Coal/Wood.',
    iconColor: '#6d4c41',
    symbol: '🦾',
    placeableEntity: 'burner-inserter'
  },
  inserter: {
    id: 'inserter',
    name: 'Electric Inserter',
    category: 'logistics',
    stackSize: 50,
    description: 'Standard electric arm for item transfers.',
    iconColor: '#fbc02d',
    symbol: '🦾',
    placeableEntity: 'inserter'
  },
  'fast-inserter': {
    id: 'fast-inserter',
    name: 'Fast Inserter',
    category: 'logistics',
    stackSize: 50,
    description: 'High speed electric arm for rapid item movement.',
    iconColor: '#1e88e5',
    symbol: '🦾',
    placeableEntity: 'fast-inserter'
  },
  'long-handed-inserter': {
    id: 'long-handed-inserter',
    name: 'Long-handed Inserter',
    category: 'logistics',
    stackSize: 50,
    description: 'Electric inserter with double pickup & drop range (2 tiles).',
    iconColor: '#e53935',
    symbol: '🦾',
    placeableEntity: 'long-handed-inserter'
  },
  'filter-inserter': {
    id: 'filter-inserter',
    name: 'Filter Inserter',
    category: 'logistics',
    stackSize: 50,
    description: 'Moves only specific filtered item types.',
    iconColor: '#8e24aa',
    symbol: '🦾',
    placeableEntity: 'filter-inserter'
  },

  // Rail Network
  rail: {
    id: 'rail',
    name: 'Straight Rail',
    category: 'logistics',
    stackSize: 100,
    description: 'Rail track segment for automated trains.',
    iconColor: '#616161',
    symbol: '🛤️',
    placeableEntity: 'rail'
  },
  'train-stop': {
    id: 'train-stop',
    name: 'Train Stop',
    category: 'logistics',
    stackSize: 10,
    description: 'Station marker for train scheduling and cargo loading.',
    iconColor: '#e040fb',
    symbol: '🚉',
    placeableEntity: 'train-stop'
  },
  locomotive: {
    id: 'locomotive',
    name: 'Diesel Locomotive',
    category: 'logistics',
    stackSize: 5,
    description: 'Heavy automated engine that runs along rail lines transporting cargo wagons.',
    iconColor: '#d32f2f',
    symbol: '🚂',
    placeableEntity: 'locomotive'
  },
  'cargo-wagon': {
    id: 'cargo-wagon',
    name: 'Cargo Wagon',
    category: 'logistics',
    stackSize: 5,
    description: 'Attaches to locomotive to carry bulk factory freight (40 slots).',
    iconColor: '#455a64',
    symbol: '🚃',
    placeableEntity: 'cargo-wagon'
  },

  // Robotics & Automation
  roboport: {
    id: 'roboport',
    name: 'Roboport',
    category: 'logistics',
    stackSize: 10,
    description: 'Base hub for charging and launching Construction and Logistic Bots (50x50 area).',
    iconColor: '#00acc1',
    symbol: '📡',
    placeableEntity: 'roboport'
  },
  'construction-robot': {
    id: 'construction-robot',
    name: 'Construction Robot',
    category: 'logistics',
    stackSize: 50,
    description: 'Automated flying drone that builds blueprint ghosts and deconstructs marked buildings.',
    iconColor: '#8e24aa',
    symbol: '🛸'
  },
  'logistic-robot': {
    id: 'logistic-robot',
    name: 'Logistic Robot',
    category: 'logistics',
    stackSize: 50,
    description: 'Automated flying drone that transports items between provider and requester chests.',
    iconColor: '#00b0ff',
    symbol: '🤖'
  },

  // Storage & Production
  'wooden-chest': {
    id: 'wooden-chest',
    name: 'Wooden Chest',
    category: 'logistics',
    stackSize: 50,
    description: 'Basic storage container (16 slots).',
    iconColor: '#8d6e63',
    symbol: '📦',
    placeableEntity: 'wooden-chest'
  },
  'iron-chest': {
    id: 'iron-chest',
    name: 'Iron Chest',
    category: 'logistics',
    stackSize: 50,
    description: 'Durable storage container (32 slots).',
    iconColor: '#b0bec5',
    symbol: '🧰',
    placeableEntity: 'iron-chest'
  },
  'steel-chest': {
    id: 'steel-chest',
    name: 'Steel Chest',
    category: 'logistics',
    stackSize: 50,
    description: 'High capacity storage container (48 slots).',
    iconColor: '#546e7a',
    symbol: '💼',
    placeableEntity: 'steel-chest'
  },
  'burner-mining-drill': {
    id: 'burner-mining-drill',
    name: 'Burner Mining Drill',
    category: 'production',
    stackSize: 20,
    description: 'Mines resources directly from tiles beneath it. Powered by Coal/Wood.',
    iconColor: '#795548',
    symbol: '⛏️',
    placeableEntity: 'burner-mining-drill'
  },
  'electric-mining-drill': {
    id: 'electric-mining-drill',
    name: 'Electric Mining Drill',
    category: 'production',
    stackSize: 20,
    description: 'Large area electric mining drill (3x3 footprint, 5x5 coverage).',
    iconColor: '#0288d1',
    symbol: '🏭',
    placeableEntity: 'electric-mining-drill'
  },
  'offshore-pump': {
    id: 'offshore-pump',
    name: 'Offshore Pump',
    category: 'production',
    stackSize: 20,
    description: 'Pumps water continuously from lake shoreline for boilers.',
    iconColor: '#0288d1',
    symbol: '⚓',
    placeableEntity: 'offshore-pump'
  },
  'stone-furnace': {
    id: 'stone-furnace',
    name: 'Stone Furnace',
    category: 'production',
    stackSize: 50,
    description: 'Smelts ores into plates using Coal fuel.',
    iconColor: '#8d6e63',
    symbol: '🔥',
    placeableEntity: 'stone-furnace'
  },
  'steel-furnace': {
    id: 'steel-furnace',
    name: 'Steel Furnace',
    category: 'production',
    stackSize: 50,
    description: 'Double speed furnace powered by Coal.',
    iconColor: '#546e7a',
    symbol: '🏬',
    placeableEntity: 'steel-furnace'
  },
  'electric-furnace': {
    id: 'electric-furnace',
    name: 'Electric Furnace',
    category: 'production',
    stackSize: 50,
    description: 'High tier 3x3 furnace powered purely by electricity.',
    iconColor: '#009688',
    symbol: '⚡',
    placeableEntity: 'electric-furnace'
  },
  'assembling-machine-1': {
    id: 'assembling-machine-1',
    name: 'Assembling Machine 1',
    category: 'production',
    stackSize: 50,
    description: 'Automatically crafts recipes up to 2 ingredients (Speed: 0.5).',
    iconColor: '#ff9800',
    symbol: '🏭',
    placeableEntity: 'assembling-machine-1'
  },
  'assembling-machine-2': {
    id: 'assembling-machine-2',
    name: 'Assembling Machine 2',
    category: 'production',
    stackSize: 50,
    description: 'Faster crafting speed (0.75) supporting all recipes.',
    iconColor: '#03a9f4',
    symbol: '🏭',
    placeableEntity: 'assembling-machine-2'
  },
  'assembling-machine-3': {
    id: 'assembling-machine-3',
    name: 'Assembling Machine 3',
    category: 'production',
    stackSize: 50,
    description: 'High speed crafting machine (1.25).',
    iconColor: '#9c27b0',
    symbol: '🏭',
    placeableEntity: 'assembling-machine-3'
  },
  'oil-refinery': {
    id: 'oil-refinery',
    name: 'Oil Refinery',
    category: 'production',
    stackSize: 10,
    description: 'Refines Crude Oil into Heavy, Light, and Petroleum fluids.',
    iconColor: '#37474f',
    symbol: '🛢️',
    placeableEntity: 'oil-refinery'
  },
  'chemical-plant': {
    id: 'chemical-plant',
    name: 'Chemical Plant',
    category: 'production',
    stackSize: 25,
    description: 'Crafts Plastic, Sulfur, and Batteries from petrochemical inputs.',
    iconColor: '#00acc1',
    symbol: '⚗️',
    placeableEntity: 'chemical-plant'
  },
  'fluid-tank': {
    id: 'fluid-tank',
    name: 'Fluid Storage Tank',
    category: 'production',
    stackSize: 20,
    description: 'Stores up to 25,000 units of liquids or gases.',
    iconColor: '#0277bd',
    symbol: '🛢️',
    placeableEntity: 'fluid-tank'
  },
  lab: {
    id: 'lab',
    name: 'Lab',
    category: 'production',
    stackSize: 20,
    description: 'Consumes Science Packs to research new Technologies.',
    iconColor: '#ab47bc',
    symbol: '🔬',
    placeableEntity: 'lab'
  },
  'rocket-silo': {
    id: 'rocket-silo',
    name: 'Rocket Silo',
    category: 'production',
    stackSize: 1,
    description: 'Massive 9x9 landmark structure to construct and launch the space rocket to WIN THE GAME!',
    iconColor: '#d50000',
    symbol: '🚀',
    placeableEntity: 'rocket-silo'
  },

  // Power Infrastructure
  boiler: {
    id: 'boiler',
    name: 'Boiler',
    category: 'production',
    stackSize: 50,
    description: 'Burns Coal to heat Water into Steam for Steam Engines.',
    iconColor: '#d84315',
    symbol: '♨️',
    placeableEntity: 'boiler'
  },
  'steam-engine': {
    id: 'steam-engine',
    name: 'Steam Engine',
    category: 'production',
    stackSize: 50,
    description: 'Consumes Steam to generate up to 900kW of electric power.',
    iconColor: '#455a64',
    symbol: '💨',
    placeableEntity: 'steam-engine'
  },
  'solar-panel': {
    id: 'solar-panel',
    name: 'Solar Panel',
    category: 'production',
    stackSize: 50,
    description: 'Generates up to 60kW of zero-emission solar electricity during daylight.',
    iconColor: '#0288d1',
    symbol: '☀️',
    placeableEntity: 'solar-panel'
  },
  accumulator: {
    id: 'accumulator',
    name: 'Accumulator',
    category: 'production',
    stackSize: 50,
    description: 'Stores surplus energy during the day and discharges during the night.',
    iconColor: '#7b1fa2',
    symbol: '🔋',
    placeableEntity: 'accumulator'
  },
  'small-electric-pole': {
    id: 'small-electric-pole',
    name: 'Small Electric Pole',
    category: 'logistics',
    stackSize: 50,
    description: 'Connects power grid over 6 tile wire length (5x5 supply area).',
    iconColor: '#8d6e63',
    symbol: '📡',
    placeableEntity: 'small-electric-pole'
  },
  'medium-electric-pole': {
    id: 'medium-electric-pole',
    name: 'Medium Electric Pole',
    category: 'logistics',
    stackSize: 50,
    description: 'Connects power grid over 9 tile wire length (7x7 supply area).',
    iconColor: '#78909c',
    symbol: '📡',
    placeableEntity: 'medium-electric-pole'
  },
  substation: {
    id: 'substation',
    name: 'Substation',
    category: 'logistics',
    stackSize: 20,
    description: 'Massive coverage electric power grid node (18x18 area, 18 tile wire range).',
    iconColor: '#00838f',
    symbol: '🗼',
    placeableEntity: 'substation'
  },
  pipe: {
    id: 'pipe',
    name: 'Pipe',
    category: 'logistics',
    stackSize: 100,
    description: 'Transports fluids between pumps, boilers, and refineries.',
    iconColor: '#4e342e',
    symbol: '🧪',
    placeableEntity: 'pipe'
  },
  'underground-pipe': {
    id: 'underground-pipe',
    name: 'Underground Pipe',
    category: 'logistics',
    stackSize: 50,
    description: 'Allows fluid transport across up to 10 underground tiles.',
    iconColor: '#3e2723',
    symbol: '🕳️',
    placeableEntity: 'underground-pipe'
  },

  // Combat & Defense
  'stone-wall': {
    id: 'stone-wall',
    name: 'Stone Wall',
    category: 'combat',
    stackSize: 100,
    description: 'High health barrier block to protect base from biters (350 HP).',
    iconColor: '#616161',
    symbol: '🧱',
    placeableEntity: 'stone-wall'
  },
  'gun-turret': {
    id: 'gun-turret',
    name: 'Gun Turret',
    category: 'combat',
    stackSize: 20,
    description: 'Automated turret loaded with firearm magazines. Range: 18 tiles.',
    iconColor: '#d32f2f',
    symbol: '🔫',
    placeableEntity: 'gun-turret'
  },
  'laser-turret': {
    id: 'laser-turret',
    name: 'Laser Turret',
    category: 'combat',
    stackSize: 20,
    description: 'Powerful automated defense turret powered directly by electricity.',
    iconColor: '#7b1fa2',
    symbol: '⚡',
    placeableEntity: 'laser-turret'
  },
  'firearm-magazine': {
    id: 'firearm-magazine',
    name: 'Firearm Magazine',
    category: 'combat',
    stackSize: 200,
    description: 'Basic ammunition for player pistol/submachine gun and gun turrets.',
    iconColor: '#ff8f00',
    symbol: '🗡️'
  },
  'piercing-rounds-magazine': {
    id: 'piercing-rounds-magazine',
    name: 'Piercing Rounds Magazine',
    category: 'combat',
    stackSize: 200,
    description: 'High damage armor-piercing ammunition.',
    iconColor: '#c62828',
    symbol: '⚔️'
  },
  pistol: {
    id: 'pistol',
    name: 'Pistol',
    category: 'combat',
    stackSize: 5,
    description: 'Standard starting sidearm.',
    iconColor: '#424242',
    symbol: '🔫'
  },
  'submachine-gun': {
    id: 'submachine-gun',
    name: 'Submachine Gun',
    category: 'combat',
    stackSize: 5,
    description: 'Rapid fire automatic weapon.',
    iconColor: '#212121',
    symbol: '🔫'
  },
  grenade: {
    id: 'grenade',
    name: 'Grenade',
    category: 'combat',
    stackSize: 100,
    description: 'Thrown explosive dealing high area-of-effect damage.',
    iconColor: '#2e7d32',
    symbol: '💣'
  },

  // Blueprint & Deconstruction Tools
  'blueprint-tool': {
    id: 'blueprint-tool',
    name: 'Blueprint Copy Tool',
    category: 'logistics',
    stackSize: 1,
    description: 'Drag box to copy factory layouts and place building ghosts.',
    iconColor: '#00b0ff',
    symbol: '📋'
  },
  'deconstruction-tool': {
    id: 'deconstruction-tool',
    name: 'Deconstruction Planner',
    category: 'logistics',
    stackSize: 1,
    description: 'Drag box to mark multiple entities for bulk dismantling.',
    iconColor: '#d50000',
    symbol: '❌'
  }
};
