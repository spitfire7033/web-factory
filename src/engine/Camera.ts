export class Camera {
  public x: number = 150; // target world tile position
  public y: number = 150;
  public tileSize: number = 36; // screen pixels per map tile
  public targetTileSize: number = 36;
  public viewportWidth: number = 1280;
  public viewportHeight: number = 720;

  public follow(targetX: number, targetY: number, dt: number) {
    // Smooth lerp follow
    this.x += (targetX - this.x) * dt * 8;
    this.y += (targetY - this.y) * dt * 8;

    // Smooth zoom lerp
    this.tileSize += (this.targetTileSize - this.tileSize) * dt * 10;
  }

  public zoom(delta: number, mouseX: number, mouseY: number) {
    const zoomFactor = delta < 0 ? 1.15 : 0.85;
    this.targetTileSize = Math.max(16, Math.min(80, this.targetTileSize * zoomFactor));
  }

  public worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    const screenX = (worldX - this.x) * this.tileSize + this.viewportWidth / 2;
    const screenY = (worldY - this.y) * this.tileSize + this.viewportHeight / 2;
    return { x: screenX, y: screenY };
  }

  public screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    const worldX = (screenX - this.viewportWidth / 2) / this.tileSize + this.x;
    const worldY = (screenY - this.viewportHeight / 2) / this.tileSize + this.y;
    return { x: worldX, y: worldY };
  }
}
