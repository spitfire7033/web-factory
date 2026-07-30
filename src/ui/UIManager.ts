import { ItemId, DifficultyMode, Recipe, Technology } from '../types';
import { ITEMS } from '../data/items';
import { RECIPES } from '../data/recipes';
import { TECHNOLOGIES } from '../data/technologies';
import { soundManager } from '../audio/SoundManager';
import { AssemblerEntity, FurnaceEntity, ChestEntity } from '../entities/ProductionEntities';
import { RocketSiloEntity } from '../entities/SpecialEntities';

export class UIManager {
  private game: any;
  public activeModal: string | null = null;
  public selectedCategory: string = 'logistics';
  public recipeSearchQuery: string = '';

  constructor(game: any) {
    this.game = game;
    this.setupDOM();
  }

  private setupDOM() {
    this.renderQuickbar();
    this.renderInventoryModal();
    this.renderTechTreeModal();
    this.renderStatsModal();
    this.renderInspectorModal();
    this.renderSaveLoadModal();
    this.renderGuideModal();
    this.renderNewWorldModal();
  }

  public toggleWindow(windowId: string) {
    if (this.activeModal === windowId) {
      this.closeAllModals();
    } else {
      this.closeAllModals();
      this.activeModal = windowId;
      const modalId = windowId === 'techTree' ? 'tech-tree-modal' :
                      windowId === 'productionStats' ? 'production-stats-modal' :
                      windowId === 'saveLoad' ? 'save-load-modal' :
                      windowId === 'guide' ? 'guide-modal' :
                      windowId === 'newWorld' ? 'new-world-modal' :
                      `${windowId}-modal`;

      const el = document.getElementById(modalId);
      if (el) el.classList.add('visible');

      if (windowId === 'inventory') this.updateInventoryUI();
      if (windowId === 'techTree') this.updateTechTreeUI();
      if (windowId === 'productionStats') this.updateStatsUI();
      soundManager.playClick();
    }
  }

  public closeAllModals() {
    this.activeModal = null;
    document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('visible'));
  }

  public renderQuickbar() {
    const barContainer = document.getElementById('quickbar-container');
    if (!barContainer) return;

    barContainer.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const itemId = this.game.player.quickbar[i];
      const isSelected = i === this.game.player.selectedQuickbarIndex;
      const itemDef = itemId ? ITEMS[itemId as ItemId] : null;

      const slotEl = document.createElement('div');
      slotEl.className = `quickbar-slot ${isSelected ? 'selected' : ''}`;
      slotEl.innerHTML = `
        <span class="slot-num">${i === 9 ? 0 : i + 1}</span>
        ${itemDef ? `<span class="slot-icon">${itemDef.symbol}</span><span class="slot-name">${itemDef.name}</span>` : '<span class="slot-empty">Empty</span>'}
      `;

      slotEl.addEventListener('click', () => {
        this.game.player.selectedQuickbarIndex = i;
        this.renderQuickbar();
        soundManager.playClick();
      });

      barContainer.appendChild(slotEl);
    }
  }

  public updateHUD() {
    // Health Bar
    const hpBar = document.getElementById('player-hp-fill');
    const hpText = document.getElementById('player-hp-text');
    if (hpBar && hpText) {
      const pct = Math.max(0, (this.game.player.health / this.game.player.maxHealth) * 100);
      hpBar.style.width = `${pct}%`;
      hpText.textContent = `${Math.ceil(this.game.player.health)} / ${this.game.player.maxHealth} HP`;
    }

    // Active Research Bar
    const techBar = document.getElementById('active-tech-fill');
    const techText = document.getElementById('active-tech-text');
    if (techBar && techText) {
      if (this.game.currentResearch) {
        const tech = this.game.currentResearch;
        const pct = (this.game.researchProgress / tech.cost.count) * 100;
        techBar.style.width = `${pct}%`;
        techText.textContent = `Researching: ${tech.name} (${Math.floor(pct)}%)`;
      } else {
        techBar.style.width = '0%';
        techText.textContent = 'No Research Selected (Press T)';
      }
    }

    // Power Grid Ratio
    const powerBar = document.getElementById('power-ratio-fill');
    const powerText = document.getElementById('power-ratio-text');
    if (powerBar && powerText) {
      const ratio = this.game.powerManager.satisfactionRatio;
      const capKW = Math.round(this.game.powerManager.totalCapacityKW);
      const demKW = Math.round(this.game.powerManager.totalDemandKW);
      powerBar.style.width = `${ratio * 100}%`;
      powerBar.style.backgroundColor = ratio >= 0.9 ? '#4caf50' : ratio >= 0.5 ? '#ff9800' : '#f44336';
      powerText.textContent = `Power: ${capKW}kW / ${demKW}kW (${Math.floor(ratio * 100)}%)`;
    }
  }

  public renderInventoryModal() {
    const invModal = document.getElementById('inventory-modal');
    if (!invModal) return;

    invModal.innerHTML = `
      <div class="modal-box large">
        <div class="modal-header">
          <h2>🎒 Inventory & Hand Crafting</h2>
          <button class="close-btn" id="close-inv-btn">✕</button>
        </div>
        <div class="modal-body inventory-layout">
          <div class="inventory-section">
            <h3>Player Storage (40 Slots)</h3>
            <div id="player-inventory-grid" class="inventory-grid"></div>
          </div>

          <div class="crafting-section">
            <h3>Hand Crafting</h3>
            <div class="category-tabs">
              <button class="cat-tab active" data-cat="logistics">Logistics</button>
              <button class="cat-tab" data-cat="production">Production</button>
              <button class="cat-tab" data-cat="intermediate">Intermediate</button>
              <button class="cat-tab" data-cat="combat">Combat</button>
            </div>
            <input type="text" id="recipe-search-input" placeholder="Search recipe..." />
            <div id="crafting-recipes-list" class="recipes-list"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('close-inv-btn')?.addEventListener('click', () => this.closeAllModals());

    invModal.querySelectorAll('.cat-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        invModal.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        this.selectedCategory = (e.currentTarget as HTMLElement).getAttribute('data-cat') || 'logistics';
        this.updateInventoryUI();
      });
    });

    document.getElementById('recipe-search-input')?.addEventListener('input', (e) => {
      this.recipeSearchQuery = (e.target as HTMLInputElement).value.toLowerCase();
      this.updateInventoryUI();
    });
  }

  public updateInventoryUI() {
    const grid = document.getElementById('player-inventory-grid');
    if (grid) {
      grid.innerHTML = '';
      for (let i = 0; i < 40; i++) {
        const slot = this.game.player.inventory[i];
        const itemDef = slot ? ITEMS[slot.item as ItemId] : null;

        const slotEl = document.createElement('div');
        slotEl.className = 'inv-slot';
        slotEl.innerHTML = slot && itemDef ? `
          <span class="inv-symbol">${itemDef.symbol}</span>
          <span class="inv-count">${slot.count}</span>
          <span class="inv-tooltip">${itemDef.name}</span>
        ` : '';

        grid.appendChild(slotEl);
      }
    }

    const recipeList = document.getElementById('crafting-recipes-list');
    if (recipeList) {
      recipeList.innerHTML = '';

      const filtered = RECIPES.filter(r => {
        if (!r.madeIn.includes('hand')) return false;
        if (r.category !== this.selectedCategory) return false;
        if (r.unlockedByTech && !this.game.unlockedTechs.has(r.unlockedByTech)) return false;
        if (this.recipeSearchQuery && !r.name.toLowerCase().includes(this.recipeSearchQuery)) return false;
        return true;
      });

      filtered.forEach(recipe => {
        const resultDef = ITEMS[recipe.results[0].item];
        const canCraft = recipe.ingredients.every(ing => this.game.player.hasItem(ing.item, ing.amount));

        const card = document.createElement('div');
        card.className = `recipe-card ${canCraft ? 'craftable' : 'disabled'}`;
        card.innerHTML = `
          <div class="recipe-header">
            <span class="recipe-icon">${resultDef.symbol}</span>
            <span class="recipe-title">${recipe.name}</span>
            <span class="recipe-time">⏱️ ${recipe.craftTime}s</span>
          </div>
          <div class="recipe-ingredients">
            ${recipe.ingredients.map(ing => {
              const ingDef = ITEMS[ing.item];
              const has = this.game.player.hasItem(ing.item, ing.amount);
              return `<span class="ing-pill ${has ? 'has' : 'lacks'}">${ingDef.symbol} ${ing.amount} ${ingDef.name}</span>`;
            }).join('')}
          </div>
        `;

        if (canCraft) {
          card.addEventListener('click', () => {
            this.game.startHandCrafting(recipe);
            this.updateInventoryUI();
            soundManager.playClick();
          });
        }

        recipeList.appendChild(card);
      });
    }
  }

  public renderTechTreeModal() {
    const modal = document.getElementById('tech-tree-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-box extra-large">
        <div class="modal-header">
          <h2>🔬 Technology Research Tree</h2>
          <button class="close-btn" id="close-tech-btn">✕</button>
        </div>
        <div class="modal-body tech-tree-grid" id="tech-tree-content"></div>
      </div>
    `;

    document.getElementById('close-tech-btn')?.addEventListener('click', () => this.closeAllModals());
  }

  public updateTechTreeUI() {
    const container = document.getElementById('tech-tree-content');
    if (!container) return;

    container.innerHTML = '';

    Object.values(TECHNOLOGIES).forEach(tech => {
      const isUnlocked = this.game.unlockedTechs.has(tech.id);
      const isCurrent = this.game.currentResearch?.id === tech.id;
      const prerequisitesMet = tech.prerequisites.every(p => this.game.unlockedTechs.has(p));

      const card = document.createElement('div');
      card.className = `tech-card ${isUnlocked ? 'unlocked' : isCurrent ? 'researching' : prerequisitesMet ? 'available' : 'locked'}`;

      card.innerHTML = `
        <div class="tech-icon">${tech.icon}</div>
        <div class="tech-info">
          <h3>${tech.name}</h3>
          <p>${tech.description}</p>
          <div class="tech-cost">
            Required: ${tech.cost.sciencePacks.map(p => `${ITEMS[p.item].symbol} x${p.amount * tech.cost.count}`).join(' + ')}
          </div>
        </div>
        <div class="tech-action">
          ${isUnlocked ? '<span class="status-badge green">Researched</span>' :
            isCurrent ? '<span class="status-badge yellow">Researching...</span>' :
            prerequisitesMet ? `<button class="btn primary" id="start-tech-${tech.id}">Start Research</button>` :
            '<span class="status-badge gray">Locked</span>'}
        </div>
      `;

      if (!isUnlocked && !isCurrent && prerequisitesMet) {
        card.querySelector(`#start-tech-${tech.id}`)?.addEventListener('click', () => {
          this.game.startResearch(tech);
          this.updateTechTreeUI();
          this.updateHUD();
          soundManager.playClick();
        });
      }

      container.appendChild(card);
    });
  }

  public renderStatsModal() {
    const modal = document.getElementById('production-stats-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-box large">
        <div class="modal-header">
          <h2>📊 Production & Consumption Statistics</h2>
          <button class="close-btn" id="close-stats-btn">✕</button>
        </div>
        <div class="modal-body stats-layout">
          <div class="stats-table">
            <h3>Automated Output (Per Minute)</h3>
            <div id="stats-produced-list"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('close-stats-btn')?.addEventListener('click', () => this.closeAllModals());
  }

  public updateStatsUI() {
    const container = document.getElementById('stats-produced-list');
    if (!container) return;

    container.innerHTML = '';
    const stats = this.game.productionStats;

    if (Object.keys(stats).length === 0) {
      container.innerHTML = '<p class="empty-msg">No automated production recorded yet. Build assemblers to automate items!</p>';
      return;
    }

    Object.entries(stats).forEach(([itemId, count]) => {
      const itemDef = ITEMS[itemId as ItemId];
      if (!itemDef) return;

      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `
        <span class="stat-icon">${itemDef.symbol}</span>
        <span class="stat-name">${itemDef.name}</span>
        <span class="stat-val">+${count} / min</span>
      `;
      container.appendChild(row);
    });
  }

  public renderInspectorModal() {
    const modal = document.getElementById('inspector-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-box medium">
        <div class="modal-header">
          <h2 id="inspector-title">Building Inspector</h2>
          <button class="close-btn" id="close-inspector-btn">✕</button>
        </div>
        <div class="modal-body" id="inspector-content"></div>
      </div>
    `;

    document.getElementById('close-inspector-btn')?.addEventListener('click', () => this.closeAllModals());
  }

  public inspectEntity(entity: any) {
    this.closeAllModals();
    this.activeModal = 'inspector';
    const modal = document.getElementById('inspector-modal');
    const title = document.getElementById('inspector-title');
    const content = document.getElementById('inspector-content');

    if (!modal || !title || !content) return;

    const itemDef = ITEMS[entity.itemType as ItemId];
    title.textContent = itemDef ? `${itemDef.symbol} ${itemDef.name}` : entity.itemType;

    if (entity instanceof AssemblerEntity) {
      const recipes = RECIPES.filter(r => r.madeIn.includes('assembler'));
      content.innerHTML = `
        <p>Selected Recipe: <strong>${entity.activeRecipe ? entity.activeRecipe.name : 'None'}</strong></p>
        <p>Crafting Speed: <strong>${entity.craftSpeed}x</strong></p>
        <div class="recipe-select-grid">
          ${recipes.map(r => `
            <button class="recipe-select-btn ${entity.activeRecipe?.id === r.id ? 'active' : ''}" data-recipe-id="${r.id}">
              ${ITEMS[r.results[0].item as ItemId]?.symbol || '⚙️'} ${r.name}
            </button>
          `).join('')}
        </div>
      `;

      content.querySelectorAll('.recipe-select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const recipeId = (e.currentTarget as HTMLElement).getAttribute('data-recipe-id');
          const recipe = RECIPES.find(r => r.id === recipeId) || null;
          entity.setRecipe(recipe);
          this.closeAllModals();
          soundManager.playClick();
        });
      });
    } else if (entity instanceof ChestEntity) {
      content.innerHTML = `
        <h3>Chest Inventory (${entity.inventory.length} / ${entity.maxSlots} Slots)</h3>
        <div class="inventory-grid">
          ${entity.inventory.map(slot => `
            <div class="inv-slot">
              <span class="inv-symbol">${ITEMS[slot.item].symbol}</span>
              <span class="inv-count">${slot.count}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else if (entity instanceof RocketSiloEntity) {
      content.innerHTML = `
        <h3>🚀 Rocket Silo Construction</h3>
        <p style="margin-bottom: 12px; color: var(--text-muted);">Insert Low Density Structures, Rocket Fuel, and Rocket Control Units to construct the space rocket.</p>

        <div class="hud-bar-container" style="height: 24px; margin-bottom: 16px;">
          <div class="hud-bar-fill green" style="width: ${entity.rocketPartsCount}%;"></div>
          <span class="hud-bar-text">Rocket Construction: ${entity.rocketPartsCount} / 100 Parts</span>
        </div>

        <button class="menu-btn primary" id="btn-launch-rocket" ${entity.rocketPartsCount >= 100 ? '' : 'disabled'}>
          🚀 LAUNCH SPACE ROCKET
        </button>
      `;

      document.getElementById('btn-launch-rocket')?.addEventListener('click', () => {
        entity.launchRocket(this.game);
        this.closeAllModals();
      });
    }

    modal.classList.add('visible');
  }

  public renderSaveLoadModal() {
    const modal = document.getElementById('save-load-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-box medium">
        <div class="modal-header">
          <h2>💾 Save / Load Factory State</h2>
          <button class="close-btn" id="close-saveload-btn">✕</button>
        </div>
        <div class="modal-body saveload-actions">
          <button class="btn primary" id="btn-do-save">💾 Save Game (LocalStorage)</button>
          <button class="btn" id="btn-do-load">📂 Load Saved Game</button>
          <hr/>
          <button class="btn" id="btn-export-json">📥 Export Save to File (JSON)</button>
          <input type="file" id="import-json-file" accept=".json" style="display:none" />
          <button class="btn" id="btn-import-json">📤 Import Save from File</button>
          <div id="save-status-msg"></div>
        </div>
      </div>
    `;

    document.getElementById('close-saveload-btn')?.addEventListener('click', () => this.closeAllModals());

    document.getElementById('btn-do-save')?.addEventListener('click', () => {
      this.game.saveGame();
      const msg = document.getElementById('save-status-msg');
      if (msg) msg.textContent = '✅ Game Saved Successfully!';
      soundManager.playClick();
    });

    document.getElementById('btn-do-load')?.addEventListener('click', () => {
      const ok = this.game.loadGame();
      const msg = document.getElementById('save-status-msg');
      if (msg) msg.textContent = ok ? '✅ Game Loaded Successfully!' : '❌ No Save Found!';
      if (ok) this.closeAllModals();
      soundManager.playClick();
    });

    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const json = this.game.saveGame();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'factorio_web_save.json';
      a.click();
    });

    document.getElementById('btn-import-json')?.addEventListener('click', () => {
      document.getElementById('import-json-file')?.click();
    });

    document.getElementById('import-json-file')?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const ok = this.game.loadGame(content);
          if (ok) this.closeAllModals();
        };
        reader.readAsText(file);
      }
    });
  }

  public renderGuideModal() {
    const modal = document.getElementById('guide-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-box large">
        <div class="modal-header">
          <h2>📖 Engineer Field Guide - How To Play</h2>
          <button class="close-btn" id="close-guide-btn">✕</button>
        </div>
        <div class="modal-body guide-content">
          <h3>1. Basic Controls & Movement</h3>
          <p>Use <strong>WASD</strong> or Arrow Keys to move your engineer. Press <strong>E</strong> to open your Inventory and Hand Crafting menu. Press <strong>R</strong> to rotate buildings before placing them.</p>

          <h3>2. Gathering Ores & Hand Mining</h3>
          <p>Hold <strong>Right-Click</strong> on Iron Ore, Copper Ore, Coal, or Stone patches to mine raw resources. Hold Right-Click on trees to gather Wood.</p>

          <h3>3. Building Your First Automation Line</h3>
          <p>Place a <strong>Burner Mining Drill</strong> over Coal or Iron Ore patches. Place a <strong>Stone Furnace</strong> in front of it and connect them with <strong>Transport Belts</strong> and <strong>Inserters</strong>.</p>

          <h3>4. Powering Your Factory</h3>
          <p>Build <strong>Boilers</strong> fed with Coal and Water, connected to <strong>Steam Engines</strong>. Connect <strong>Electric Poles</strong> to power drills, assemblers, and science labs!</p>

          <h3>5. Science & Tech Tree</h3>
          <p>Craft <strong>Automation Science Packs (Red)</strong>, feed them into a <strong>Lab</strong>, and press <strong>T</strong> to open the Tech Tree to unlock fast belts, solar panels, and defense turrets!</p>
        </div>
      </div>
    `;

    document.getElementById('close-guide-btn')?.addEventListener('click', () => this.closeAllModals());
  }

  public renderNewWorldModal() {
    const modal = document.getElementById('new-world-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-box medium">
        <div class="modal-header">
          <h2>🌍 Create Custom World & Difficulty</h2>
          <button class="close-btn" id="close-world-btn">✕</button>
        </div>
        <div class="modal-body world-form">
          <label>World Seed Number:</label>
          <input type="number" id="world-seed-input" value="${Math.floor(Math.random() * 100000)}" />

          <label>Difficulty Mode:</label>
          <div class="difficulty-options">
            <label class="diff-card">
              <input type="radio" name="diff" value="peaceful" />
              <span>🕊️ Peaceful (No Biter Attacks)</span>
            </label>
            <label class="diff-card active">
              <input type="radio" name="diff" value="normal" checked />
              <span>⚙️ Normal (Standard Factorio)</span>
            </label>
            <label class="diff-card">
              <input type="radio" name="diff" value="deathworld" />
              <span>💀 Deathworld (High Aggression & Evolution)</span>
            </label>
            <label class="diff-card">
              <input type="radio" name="diff" value="sandbox" />
              <span>🧪 Sandbox (Invincible, 10x Speed)</span>
            </label>
          </div>

          <button class="btn primary" id="btn-generate-world">⚡ Generate & Start World</button>
        </div>
      </div>
    `;

    document.getElementById('close-world-btn')?.addEventListener('click', () => this.closeAllModals());

    document.getElementById('btn-generate-world')?.addEventListener('click', () => {
      const input = document.getElementById('world-seed-input') as HTMLInputElement;
      const seed = parseInt(input.value, 10) || 12345;
      const checkedDiff = (document.querySelector('input[name="diff"]:checked') as HTMLInputElement)?.value as DifficultyMode || 'normal';

      this.game.generateNewWorld(seed, checkedDiff);
      this.game.startGame();
      this.closeAllModals();
      soundManager.playClick();
    });

    // Respawn button
    document.getElementById('btn-respawn-now')?.addEventListener('click', () => {
      this.game.respawnPlayer();
      soundManager.playClick();
    });
  }
}
