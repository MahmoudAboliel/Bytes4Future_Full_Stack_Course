class ShapeManager {
    shapes = [];
    addShape(shape) {
        console.log(shape);
    }
    removeShape(id) {
        return false;
    }
    getShape(id) {
        return undefined;
    }
    updateShape(id, updates) {
        return false;
    }
    addMultipleShapes(shapes) {
        console.log(shapes);
    }
    clearAll() {
        console.log('clear');
    }
    findShapes(predicate) {
        return [];
    }
    getAverageArea() {
        return 0;
    }
    getLargestPerimeter() {
        return null;
    }
}
export default ShapeManager;
