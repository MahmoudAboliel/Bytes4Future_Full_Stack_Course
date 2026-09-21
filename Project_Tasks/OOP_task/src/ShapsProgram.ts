interface IShape {
  readonly id: string;
  getArea(): number;
  getPerimeter(): number;
  getDescription(): string;
  scale(factor: number): void;
}

interface IDrawable {
  getBoundingBox(): { x: number; y: number; width: number; height: number };
}

interface ITransformable {
  rotate(degrees: number): void;
  getPosition(): { x: number; y: number };
}

interface IComparable<T> {
  compareTo(other: T): number;
  equals(other: T): boolean;
}

abstract class Shape implements IShape, IComparable<Shape> {
  protected static totalShapes: number = 0;
  public readonly id: string;
  protected name: string;

  constructor(name: string) {}

  abstract getArea(): number;
  abstract getPerimeter(): number;
  abstract scale(factor: number): void;

  getDescription(): string {}
  compareTo(other: Shape): number {}
  equals(other: Shape): boolean {}
  static getTotalShapes(): number {}
}

static class ShapeUtilities {
    static calculateTotalArea(shapes: IShape[]): number
    static findLargestShape(shapes: IShape[]): IShape | null
    static findSmallestShape(shapes: IShape[]): IShape | null
    static sortByArea(shapes: IShape[], ascending: boolean): IShape[]
    static getShapeTypeDistribution(shapes: IShape[]): Map<string, number>
    static generateSummaryReport(shapes: IShape[]): string
}


