import { Direction } from '../types';
import { soundManager } from '../audio/SoundManager';

export class InputManager {
  public keys: Record<string, boolean> = {};
  public mouseX: number = 0;
  public mouseY: number = 0;
  public isMouseDown: boolean = false;
  public isRightMouseDown: boolean = false;
  public placementDirection: Direction = 0; // 0: N, 1: E, 2: S, 3: W
  public hoveredTile: { x: number; y: number } = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement, game: any) {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Ignore hotkeys when typing inside input text fields
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      // Quickbar slot selection (1-0)
      if (e.code.startsWith('Digit')) {
        const digit = parseInt(e.code.replace('Digit', ''), 10);
        const index = digit === 0 ? 9 : digit - 1;
        game.player.selectedQuickbarIndex = index;
        game.uiManager.renderQuickbar();
        soundManager.playClick();
      }

      // Pipette tool (Q): Copy entity under cursor into active hotbar slot
      if (e.code === 'KeyQ') {
        const ent = game.getEntityAt(this.hoveredTile.x, this.hoveredTile.y);
        if (ent) {
          const slotIdx = game.player.selectedQuickbarIndex >= 0 ? game.player.selectedQuickbarIndex : 0;
          game.player.quickbar[slotIdx] = ent.itemType;
          game.player.selectedQuickbarIndex = slotIdx;
        } else {
          game.player.selectedQuickbarIndex = -1;
        }
        game.uiManager.renderQuickbar();
        soundManager.playClick();
      }

      // Blueprint Tool (B)
      if (e.code === 'KeyB') {
        const slotIdx = game.player.selectedQuickbarIndex >= 0 ? game.player.selectedQuickbarIndex : 0;
        game.player.quickbar[slotIdx] = 'blueprint-tool';
        game.player.selectedQuickbarIndex = slotIdx;
        game.uiManager.renderQuickbar();
        soundManager.playClick();
      }

      // Rotate blueprint placement (R)
      if (e.code === 'KeyR') {
        this.placementDirection = ((this.placementDirection + 1) % 4) as Direction;
        soundManager.playClick();
      }

      // Deconstruct / Clear shortcut (X)
      if (e.code === 'KeyX') {
        if (game.player.selectedQuickbarIndex === -2) {
          game.player.selectedQuickbarIndex = -1;
        } else {
          game.player.selectedQuickbarIndex = -2;
        }
        game.uiManager.renderQuickbar();
        soundManager.playClick();
      }

      // Toggle UI Windows
      if (e.code === 'KeyE') {
        game.uiManager.toggleWindow('inventory');
      } else if (e.code === 'KeyT') {
        game.uiManager.toggleWindow('techTree');
      } else if (e.code === 'KeyP') {
        game.uiManager.toggleWindow('productionStats');
      } else if (e.code === 'KeyM') {
        game.uiManager.toggleWindow('minimapModal');
      } else if (e.code === 'Escape') {
        game.player.selectedQuickbarIndex = -1;
        game.uiManager.renderQuickbar();
        game.uiManager.closeAllModals();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      const worldPos = game.camera.screenToWorld(this.mouseX, this.mouseY);
      this.hoveredTile = {
        x: Math.floor(worldPos.x),
        y: Math.floor(worldPos.y)
      };
    });

    canvas.addEventListener('mousedown', (e) => {
      const worldPos = game.camera.screenToWorld(this.mouseX, this.mouseY);

      if (e.button === 0) {
        this.isMouseDown = true;
        // Check if left click on biter/nest -> shoot!
        const biterUnderCursor = game.enemyManager.findNearestBiter(worldPos.x, worldPos.y, 1.5);
        let nestUnderCursor = null;
        for (const nest of game.enemyManager.nests) {
          if (Math.hypot(nest.x - worldPos.x, nest.y - worldPos.y) < 1.8) {
            nestUnderCursor = nest;
            break;
          }
        }

        if (biterUnderCursor || nestUnderCursor) {
          game.player.shoot(game, worldPos.x, worldPos.y);
        } else {
          game.handleLeftClick(this.hoveredTile.x, this.hoveredTile.y, this.placementDirection);
        }
      } else if (e.button === 2) {
        this.isRightMouseDown = true;
        game.handleRightClick(this.hoveredTile.x, this.hoveredTile.y);
      }
    });

    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.isMouseDown = false;
      if (e.button === 2) this.isRightMouseDown = false;
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      game.camera.zoom(e.deltaY, this.mouseX, this.mouseY);
    });
  }
}
