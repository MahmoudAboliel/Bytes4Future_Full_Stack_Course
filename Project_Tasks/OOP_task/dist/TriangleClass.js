import Shape from "./ShapeClass.js";
class Triangle extends Shape {
    sides;
    vertices;
    constructor(name, sideA, sideB, sideC, positions) {
        super(name);
        if (sideA <= 0 || sideB <= 0 || sideC <= 0) {
            throw new Error("the length of sides should be psitive");
        }
        if (sideA + sideB <= sideC ||
            sideA + sideC <= sideB ||
            sideB + sideC <= sideA) {
            throw new Error("this lengths don't make triangle");
        }
        this.sides = [sideA, sideB, sideC];
        this.vertices = positions;
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
    getAngles() {
        return { angleA: 0, angleB: 0, angleC: 0 };
    }
    isEquilateral() {
        return false;
    }
    isIsosceles() {
        return false;
    }
    isRightAngled() {
        return false;
    }
    getCircumradius() {
        return 0;
    }
    getInradius() {
        return 0;
    }
    getBoundingBox() {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
}
export default Triangle;
