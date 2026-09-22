import { generateId } from "./lib.js";
class Shape {
    static totalShapes = 0;
    id;
    name;
    constructor(name) {
        if (name.trim().length === 0)
            throw new Error("the name is required");
        this.name = name;
        this.id = generateId();
        Shape.totalShapes++;
    }
    getDescription() {
        return `The shape is ${this.name} \nArea: ${this.getArea()} \nPerimeter: ${this.getPerimeter()}`;
    }
    compareTo(other) {
        if (!other)
            throw new Error("other shape is required");
        return this.getArea() - other.getArea();
    }
    equals(other) {
        if (!other)
            return false;
        if (this.id === other.id)
            return true;
        return this.getArea() === other.getArea() &&
            this.getPerimeter() === other.getPerimeter();
    }
    static getTotalShapes() {
        return Shape.totalShapes;
    }
}
export default Shape;
