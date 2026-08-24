import { myForeach, sortingArray, arrayFilter, myMap } from "./lib.js";

const ar = [1, 2, 3, 4, 5, 6];
console.log("before forEach:", ar);
myForeach(ar, (x) => x * x - 2 * x);
console.log("after forEach:", ar);

console.log("before mapping:", ar);
const newAr = myMap(ar, (x) => x * x);
console.log("after mapping :", newAr);

let x = [9, 6, 5, 8, 2, 4, 3, 7, 1];
const points = [
  [5, 1],
  [0, 3],
  [2, 5],
];

const len = (p) => Math.sqrt(p[0] * p[0] + p[1] * p[1]);

console.log("before sorting:", points);
// sortingArray(x, (x, y) => );
sortingArray(points, (p1, p2) => len(p1) > len(p2));
console.log("after sorting:", points);

const students = [
  {
    name: "mahmoud",
    age: 22,
  },
  {
    name: "ahmad",
    age: 28,
  },
  {
    name: "ali",
    age: 17,
  },
  {
    name: "rami",
    age: 35,
  },
];
console.log("before sorting:", students);
// sortingArray(x, (x, y) => );
sortingArray(students, (s1, s2) => s1.age > s2.age);
console.log("after sorting:", students);

let even = (x) => x % 2 === 0;
let odd = (x) => x % 2 !== 0;

console.log("before filtering:", x);
const filteringData = arrayFilter(x, odd);
console.log("after filtering:", filteringData);

const data = [1, 2, 3, 4];
const adding = (x, y, z) => x + y + z;
console.log("seperate operator:", adding(...data));

/**
 * what we learned
 * create a function can handle elemnts of array without create a new array
 * how to create a function can do any operating on array elements
 * how to use a function as a parameter
 * a anonimous function and a callback function
 * a forEach fucntion edit the orginal array
 * a Map function create a new array without edit the orginal array
 * seperate operator -> clone a content
 */
