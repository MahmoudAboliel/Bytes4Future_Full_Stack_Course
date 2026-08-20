import { avarge, snakeCase, camelCase, HCF } from "./exercise_2.js";
import {
  evenAndOddCounter,
  pascalCase,
  unionOfTwoArrays,
} from "./exercise_3.js";

const x = [4, 6, 8, 10, 2];
console.log("avarge: ", avarge(x));

console.log("snake case: ", snakeCase("hello wo r d  "));

console.log(
  "camel case: ",
  camelCase("hello world welcome to my couse programming"),
);

console.log("HCF: ", HCF(12, 18));

console.log("even And Odd Counter: ", evenAndOddCounter("1234567890"));

console.log("pascal case: ", pascalCase("hello to my world"));

console.log(
  "union of two arrays: ",
  unionOfTwoArrays(
    [10, 20, 30, 40, 4, 6, 8, 10, 2],
    [20, 30, 40, 10, 90, 222, 11, 65, 32, 1234, 50, 60, 4, 6, 8, 10, 2],
  ).sort(),
);
