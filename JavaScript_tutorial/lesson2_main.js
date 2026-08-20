import { operatingOnArray, sortingArray } from "./lesson2_lilb.js";

const ar = [1, 2, 3, 4, 5, 6];
console.log("before operating:", ar);
operatingOnArray(ar, (x) => x * x - 2 * x);
console.log("after operating:", ar);

let x = [9, 6, 5, 8, 2, 4, 3, 7, 1];
const points = [
  [5, 1],
  [0, 3],
  [2, 5],
];

const length = (p) => Math.sqrt(p[0] * p[0] + p[1] * p[1]);
const comp = (p1, p2) => length(p1) > length(p2);

console.log("before sorting:", points);
// sortingArray(x, (x, y) => );
sortingArray(points, comp);
console.log("after sorting:", points);

/**
 * what we learned
 * create a function can handle elemnts of array without create a new array
 * how to create a function can do any operating on array elements
 * deffirance between anonimous function and callback function
 */
