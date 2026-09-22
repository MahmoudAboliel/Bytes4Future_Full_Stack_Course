import Circle from "./CircleClass.ts";
import Rectangle from "./RectangleClass.ts";
import Triangle from "./TriangleClass.ts";
import ShapeUtilities from "./ShapeUtilities.ts";
import ShapeManager from "./ShapeManager.ts";

// console.log("circle methods");
// const c = new Circle("C1", 5, 10, 20);
// console.log("C1 area", c.getArea());
// console.log("C1 perimeter", c.getPerimeter());
// console.log("C1 diameter", c.getDiameter());
// console.log("is point inside circle", c.isPointInside(12, 22));
// console.log("C1 bounding box", c.getBoundingBox());
// c.scale(2);
// console.log("C1 radius", c.getRadius());
// console.log("C1 bounding box", c.getBoundingBox());
// const c2 = new Circle("C2", 10, 10, 20);
// console.log("C1 equals C2", c.equals(c2));
console.log("==========================================================");
// ============================================
// console.log("Rectangle methods");
// const r = new Rectangle("R1", 4, 2, 0, 0);
// console.log("width:", r.getWidth());
// console.log("height:", r.getHeight());
// console.log("area:", r.getArea());
// console.log("perimeter:", r.getPerimeter());
// console.log("diagonal:", r.getDiagonal());
// console.log("aspect ratio:", r.getAspectRatio());
// console.log("is square", r.isSquare());
// console.log("bounding box", r.getBoundingBox());
console.log("==========================================================");
// ==============================================

// const shapes = [
//     new Circle("C1", 3),
//     new Circle("C2", 1),
//     new Rectangle("R1", 4, 2),
//     new Triangle("T1", 3, 4, 5, [
//         { x: 0, y: 0 },
//         { x: 3, y: 0 },
//         { x: 0, y: 4 },
//     ]),
// ];

// console.log(ShapeUtilities.calculateTotalArea(shapes)); // متوسط
// console.log(ShapeUtilities.findLargestShape(shapes)?.getName());
// console.log(ShapeUtilities.findSmallestShape(shapes)?.getName());
// console.log(ShapeUtilities.sortByArea(shapes, true).map((s) => s.getArea()));
// console.log(ShapeUtilities.getShapeTypeDistribution(shapes));
// console.log(ShapeUtilities.generateSummaryReport(shapes));
console.log("==========================================================");

const m = new ShapeManager();

const c1 = new Circle("C1", 3);
const c2 = new Circle("C2", 1);
const r1 = new Rectangle("R1", 4, 2);

m.addShape(c1);
m.addShape(c2);
m.addMultipleShapes([r1]);

console.log("عدد الأشكال:", m.findShapes(() => true).length);
console.log("متوسط المساحة:", m.getAverageArea());
console.log("أكبر محيط:", m.getLargestPerimeter()?.getName());

console.log("حذف C2:", m.removeShape(c2.id));
console.log("حذف مفقود:", m.removeShape("xxx"));

console.log("بحث:", m.getShape(c1.id)?.getName());

m.clearAll();
console.log("بعد المسح:", m.findShapes(() => true).length);
