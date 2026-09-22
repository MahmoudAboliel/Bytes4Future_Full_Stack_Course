import Shape from "./ShapeClass.js";
class Rectangle extends Shape {
    width;
    height;
    position;
    constructor(name, width, height, x = 0, y = 0) {
        super(name);
        this.width = width;
        this.height = height;
        this.position = { x, y };
    }
    getWidth() {
        return 0;
    }
    getHeight() {
        return 0;
    }
    getPosition() {
        return { x: 0, y: 0 };
    }
    getArea() {
        return 0;
    }
    getPerimeter() {
        return 0;
    }
    scale(factor) {
        console.log(factor);
    }
    isSquare() {
        return false;
    }
    getDiagonal() {
        return 0;
    }
    getAspectRatio() {
        return 0;
    }
    getBoundingBox() {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    rotate(degrees) {
        console.log(degrees);
    }
}
export default Rectangle;
