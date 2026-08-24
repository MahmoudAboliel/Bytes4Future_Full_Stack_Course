import { pascalAngle_1, pascalAngle_2, pascalAngle_3 } from "./lib.js";
// const array = [1, 2, 3, 4, 5];
// const [x, y] = [6, "Mahmoud"];


// seperate
// const [x1, y1, z1] = array;

// reset operator
// const [x2, y2, ...z2] = array;

// console.log(x2)
// console.log(y2)
// console.log(z2)

// const sum = (...args) => {
//   let res = 0;
//   for (let i = 0; i < args.length; i++) {
//     res += args[i];
//   }
//   return res;
// };
// console.log(sum(1, 2, 3, 4));

// const power = (x, y = 0) => {
//   return x ** y;
// };
// console.log(power(4));

console.log("Pascal Angle one algorithm:", pascalAngle_1(6));
console.log("Pascal Angle two algorithm:", pascalAngle_2(6));
console.log("Pascal Angle three algorithm:", pascalAngle_3(4, 2));
