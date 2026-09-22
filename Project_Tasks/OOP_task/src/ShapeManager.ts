import type { IShape } from "./types.ts";

class ShapeManager {
  private shapes: IShape[] = [];

  addShape(shape: IShape): void {
    this.shapes.push(shape);
  }
  removeShape(id: string): boolean {
    const index = this.shapes.findIndex((s) => s.id === id);
    if (index === -1) return false;
    this.shapes.splice(index, 1);
    return true;
  }
  getShape(id: string): IShape | undefined {
    return this.shapes.find((s) => s.id === id);
  }
  updateShape(id: string, updates: Partial<IShape>): boolean {
    const shape = this.shapes.find((s) => s.id === id);
    if (!shape) return false;

    for (const key of Object.keys(updates)) {
      const value = (updates as any)[key];
      if (typeof value !== "function" && key !== "id") {
        (shape as any)[key] = value;
      }
    }
    return true;
  }
  addMultipleShapes(shapes: IShape[]): void {
    for (const shape of shapes) {
      this.shapes.push(shape);
    }
  }
  clearAll(): void {
    this.shapes = [];
  }
  findShapes(predicate: (shape: IShape) => boolean): IShape[] {
    return this.shapes.filter(predicate);
  }
  getAverageArea(): number {
    if (this.shapes.length === 0) return 0;

    const sum = this.shapes.reduce((sum, s) => sum + s.getArea(), 0);
    return sum / this.shapes.length;
  }
  getLargestPerimeter(): IShape | null {
    if (this.shapes.length === 0) return null;

    let largest = this.shapes[0]!;
    for (const shape of this.shapes) {
      if (shape.getPerimeter() > largest.getPerimeter()) {
        largest = shape;
      }
    }
    return largest;
  }
}

export default ShapeManager;
