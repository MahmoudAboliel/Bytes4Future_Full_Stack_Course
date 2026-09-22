import Shape from "./ShapeClass.ts";
import type { BoundingBox, IDrawable } from "./types.ts";

class Triangle extends Shape implements IDrawable {
  private sides: [number, number, number];
  private vertices: { x: number; y: number }[];

  constructor(
    name: string,
    sideA: number,
    sideB: number,
    sideC: number,
    positions: { x: number; y: number }[],
  ) {
    super(name);
    if (sideA <= 0 || sideB <= 0 || sideC <= 0) {
      throw new Error("the length of sides should be psitive");
    }
    if (
      sideA + sideB <= sideC ||
      sideA + sideC <= sideB ||
      sideB + sideC <= sideA
    ) {
      throw new Error("this lengths don't make triangle");
    }
    this.sides = [sideA, sideB, sideC];
    this.vertices = positions;
  }

  getArea(): number {
    const [a, b, c] = this.sides;
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }
  getPerimeter(): number {
    return this.sides[0] + this.sides[1] + this.sides[2];
  }
  scale(factor: number): void {
     this.sides = [
       this.sides[0] * factor,
       this.sides[1] * factor,
       this.sides[2] * factor,
     ];
     let cx = 0;
     let cy = 0;
     for (const v of this.vertices) {
       cx += v.x;
       cy += v.y;
     }
     cx /= this.vertices.length;
     cy /= this.vertices.length;

     for (const v of this.vertices) {
       v.x = cx + (v.x - cx) * factor;
       v.y = cy + (v.y - cy) * factor;
     }
  }
  getAngles(): { angleA: number; angleB: number; angleC: number } {
    const [a, b, c] = this.sides;
    const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c));
    const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c));
    const angleC = Math.PI - angleA - angleB;
    return { angleA, angleB, angleC };
  }
  isEquilateral(): boolean {
    const [a, b, c] = this.sides;
    return a === b && b === c;
  }
  isIsosceles(): boolean {
    const [a, b, c] = this.sides;
    return a === b || b === c || a === c;
  }
  isRightAngled(): boolean {
    const sorted = [...this.sides].sort((x, y) => x - y);
    const [a, b, c] = sorted;
    return a! * a! + b! * b! === c! * c!;
  }
  getCircumradius(): number {
    const [a, b, c] = this.sides;
    return (a * b * c) / (4 * this.getArea());
  }
  getInradius(): number {
    return this.getArea() / (this.getPerimeter() / 2);
  }

  getBoundingBox(): BoundingBox {
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
}

export default Triangle;
