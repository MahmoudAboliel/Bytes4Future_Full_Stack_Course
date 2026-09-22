import Shape from "./ShapeClass.ts";
import type { BoundingBox, IDrawable, ITransformable, Point } from "./types.ts";

class Rectangle extends Shape implements IDrawable, ITransformable {
  private width: number;
  private height: number;
  private position: Point;

  constructor(
    name: string,
    width: number,
    height: number,
    x: number = 0,
    y: number = 0,
  ) {
    super(name);
    this.width = Math.abs(width);
    this.height = Math.abs(height);
    this.position = { x, y };
  }

  getWidth(): number {
    return this.width;
  }
  getHeight(): number {
    return this.height;
  }
  getPosition(): Point {
    return { ...this.position };
  }
  getArea(): number {
    return this.width * this.height;
  }
  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
  scale(factor: number): void {
    this.width = this.width * factor;
    this.height = this.height * factor;
  }
  isSquare(): boolean {
    return this.width === this.height;
  }
  getDiagonal(): number {
    return Math.sqrt(this.width * this.width + this.height * this.height);
  }
  getAspectRatio(): number {
    if (this.width / this.height) 
        return this.width / this.height;
    else 
        return this.height / this.width;
  }
  getBoundingBox(): BoundingBox {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    };
  }
  rotate(degrees: number): void {
    // required
  }
}

export default Rectangle;
