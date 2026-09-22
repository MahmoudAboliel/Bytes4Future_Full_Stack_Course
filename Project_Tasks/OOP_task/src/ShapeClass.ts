import type { IShape, IComparable } from "./types.ts";
import { generateId } from "./lib.ts";

abstract class Shape implements IShape, IComparable<Shape> {
  protected static totalShapes: number = 0;
  public readonly id: string;
  protected name: string;

  constructor(name: string) {
    if (name.trim().length === 0) throw new Error("the name is required");

    this.name = name;
    this.id = generateId();

    Shape.totalShapes++;
  }

  abstract getArea(): number;
  abstract getPerimeter(): number;
  abstract scale(factor: number): void;

  getName(): string {
    return this.name;
  }
  getDescription(): string {
    return `The shape is ${this.name} \nArea: ${this.getArea()} \nPerimeter: ${this.getPerimeter()}`;
  }
  compareTo(other: Shape): number {
    if (!other) throw new Error("other shape is required");

    return this.getArea() - other.getArea();
  }
  equals(other: Shape): boolean {
    if (!other) return false;
    if (this.id === other.id) return true;

    return (
      this.getArea() === other.getArea() &&
      this.getPerimeter() === other.getPerimeter()
    );
  }
  static getTotalShapes(): number {
    return Shape.totalShapes;
  }
}

export default Shape;
