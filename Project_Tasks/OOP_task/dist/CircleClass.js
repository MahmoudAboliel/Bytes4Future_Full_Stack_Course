import Shape from "./ShapeClass.js";
class Circle extends Shape {
    radius;
    center;
    constructor(name, radius, x = 0, y = 0) {
        super(name);
        this.radius = radius;
        this.center = { x, y };
    }
    getRadius() {
        return this.radius;
    }
    getCenter() {
        return { ...this.center };
    }
    getArea() {
        // π r²
        return Math.PI * this.radius * this.radius;
    }
    getPerimeter() {
        // 2πr
        return 2 * Math.PI * this.radius;
    }
    scale(factor) {
        this.radius = this.radius * factor;
    }
    getDiameter() {
        return this.radius * 2;
    }
    getCircumference() {
        return this.getPerimeter();
    }
    isPointInside(px, py) {
        const dx = px - this.center.x;
        const dy = py - this.center.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
    getBoundingBox() {
        return {
            x: this.center.x - this.radius,
            y: this.center.y - this.radius,
            width: this.getDiameter(),
            height: this.getDiameter(),
        };
    }
    rotate(degrees) {
        void degrees;
    }
    getPosition() {
        return { ...this.center };
    }
}
export default Circle;
