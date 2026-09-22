import Shape from "./ShapeClass.ts";
import type { BoundingBox, IDrawable, ITransformable, Point } from "./types.ts";

class Circle extends Shape implements IDrawable, ITransformable {
  private radius: number;
  private center: Point;

  constructor(name: string, radius: number, x: number = 0, y: number = 0) {
    super(name);
    this.radius = radius;
    this.center = { x, y };
  }

  getRadius(): number {
    return this.radius;
  }
  getCenter(): Point {
    return { ...this.center };
  }

  getArea(): number {
    // π r²
    return Math.PI * this.radius * this.radius;
  }
  getPerimeter(): number {
    // 2πr
    return 2 * Math.PI * this.radius;
  }
  scale(factor: number): void {
    this.radius = this.radius * factor;
  }

  getDiameter(): number {
    return this.radius * 2;
  }
  getCircumference(): number {
    return this.getPerimeter();
  }
  isPointInside(px: number, py: number): boolean {
    const dx = px - this.center.x;
    const dy = py - this.center.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }
  getBoundingBox(): BoundingBox {
    return {
      x: this.center.x - this.radius,
      y: this.center.y - this.radius,
      width: this.getDiameter(),
      height: this.getDiameter(),
    };
  }
  rotate(degrees: number): void {
    void degrees;
  }
  getPosition(): Point {
    return { ...this.center };
  }
}

export default Circle;
