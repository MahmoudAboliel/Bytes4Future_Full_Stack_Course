type BoundingBox = { x: number; y: number; width: number; height: number };
type Point = { x: number, y: number };

interface IShape {
  readonly id: string;
  getArea(): number;
  getPerimeter(): number;
  getDescription(): string;
  scale(factor: number): void;
  getName(): string;
}

interface IDrawable {
  getBoundingBox(): BoundingBox;
}

interface ITransformable {
  rotate(degrees: number): void;
  getPosition(): Point;
}

interface IComparable<T> {
  compareTo(other: T): number;
  equals(other: T): boolean;
}

export type {
    IShape,
    IDrawable,
    ITransformable,
    IComparable,
    BoundingBox,
    Point
}
