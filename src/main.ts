import { Game } from './engine/Game';
import { soundManager } from './audio/SoundManager';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element #game-canvas not found!');
    return;
  }

  const game = new Game(canvas);

  // Main Menu Homescreen Button bindings
  document.getElementById('btn-start-game')?.addEventListener('click', () => {
    game.startGame();
    soundManager.playClick();
  });

  document.getElementById('btn-new-world')?.addEventListener('click', () => {
    game.uiManager.toggleWindow('newWorld');
  });

  document.getElementById('btn-save-load-menu')?.addEventListener('click', () => {
    game.uiManager.toggleWindow('saveLoad');
  });

  document.getElementById('btn-how-to-play')?.addEventListener('click', () => {
    game.uiManager.toggleWindow('guide');
  });

  document.getElementById('btn-open-menu')?.addEventListener('click', () => {
    game.openMainMenu();
    soundManager.playClick();
  });

  // HUD Button bindings
  document.getElementById('btn-open-inv')?.addEventListener('click', () => {
    game.uiManager.toggleWindow('inventory');
  });

  document.getElementById('btn-tech-tree')?.addEventListener('click', () => {
    game.uiManager.toggleWindow('techTree');
  });

  document.getElementById('btn-production-stats')?.addEventListener('click', () => {
    game.uiManager.toggleWindow('productionStats');
  });

  document.getElementById('btn-blueprint')?.addEventListener('click', () => {
    game.player.quickbar[game.player.selectedQuickbarIndex] = 'blueprint-tool';
    game.uiManager.renderQuickbar();
    soundManager.playClick();
  });

  document.getElementById('btn-deconstruct')?.addEventListener('click', () => {
    game.player.quickbar[game.player.selectedQuickbarIndex] = 'deconstruction-tool';
    game.uiManager.renderQuickbar();
    soundManager.playClick();
  });

  document.getElementById('btn-mute-sound')?.addEventListener('click', (e) => {
    const isMuted = soundManager.toggleMute();
    (e.currentTarget as HTMLElement).textContent = isMuted ? '🔇 Sound Off' : '🔊 Sound On';
  });

  document.getElementById('btn-continue-freeplay')?.addEventListener('click', () => {
    const victoryModal = document.getElementById('victory-modal');
    if (victoryModal) victoryModal.classList.remove('visible');
    soundManager.playClick();
  });

  // Speed Selector bindings
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget as HTMLElement;
      target.classList.add('active');
      const spd = parseFloat(target.getAttribute('data-speed') || '1');
      game.gameSpeed = spd;
      soundManager.playClick();
    });
  });
});
