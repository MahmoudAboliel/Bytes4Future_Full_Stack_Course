import type { IShape } from "./types.ts";

class ShapeUtilities {
  static calculateTotalArea(shapes: IShape[]): number {
    const sum = shapes.reduce((total, shape) => {
      total += shape.getArea();
      return total;
    }, 0);

    return sum / shapes.length;
  }
  static findLargestShape(shapes: IShape[]): IShape | null {
    if (shapes.length === 0) return null;

    let largest = shapes[0]!;
    for (const shape of shapes) {
      if (shape.getArea() > largest.getArea()) {
        largest = shape;
      }
    }
    return largest;
  }
  static findSmallestShape(shapes: IShape[]): IShape | null {
    if (shapes.length === 0) return null;

    let smallest = shapes[0]!;
    for (const shape of shapes) {
      if (shape.getArea() < smallest.getArea()) {
        smallest = shape;
      }
    }
    return smallest;
  }
  static sortByArea(shapes: IShape[], ascending: boolean): IShape[] {
    const copy = [...shapes];
    copy.sort((a, b) => {
      if (ascending) return a.getArea() - b.getArea();
      return b.getArea() - a.getArea();
    });
    return copy;
  }
  static getShapeTypeDistribution(shapes: IShape[]): Map<string, number> {
    const map = new Map<string, number>();
    for (const shape of shapes) {
      const name = shape.getName();
      const current = map.get(name) ?? 0;
      map.set(name, current + 1);
    }
    return map;
  }
  static generateSummaryReport(shapes: IShape[]): string {
    if (shapes.length === 0) {
      return "No shapes to report.";
    }

    const total = shapes.reduce((sum, s) => sum + s.getArea(), 0);
    const largest = ShapeUtilities.findLargestShape(shapes);
    const smallest = ShapeUtilities.findSmallestShape(shapes);
    const distribution = ShapeUtilities.getShapeTypeDistribution(shapes);

    let report = "";
    report += `Total shapes: ${shapes.length}\n`;
    report += `Total area: ${total}\n`;
    report += `Largest: ${largest?.getName()} (area = ${largest?.getArea()})\n`;
    report += `Smallest: ${smallest?.getName()} (area = ${smallest?.getArea()})\n`;
    report += `Distribution:\n`;

    for (const [name, count] of distribution) {
      report += `  - ${name}: ${count}\n`;
    }

    return report;
  }
}

export default ShapeUtilities;
