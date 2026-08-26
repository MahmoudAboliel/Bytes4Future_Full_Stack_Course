"use strict";

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

// console.log("Pascal Angle one algorithm:", pascalAngle_1(6));
// console.log("Pascal Angle two algorithm:", pascalAngle_2(6));
// console.log("Pascal Angle three algorithm:", pascalAngle_3(4, 2));

// const person = {
//   name: "Mahmoud",
//   family: "Abulail",
//   age: 28,
//   gender: "M",
//   printFullName: function () {
//     return this.name + " " + this.family;
//   },
// };

// Object.preventExtensions(person);
// person["gender"] = "M";
// console.log(person);

// const keys = Object.keys(person);
// const values = Object.values(person);
// const entries = Object.entries(person);

// console.log('keys', keys);
// console.log('values', values);
// console.log('entries', entries);

// for (let i in person) {
//     console.log('index', i)
// }

// for (let val of Object.values(person)) {
//     console.log('value', val);
// }

// const person1 = {
//   name: "Ali",
//   family: "Mousa",
//   age: 21,
//   gender: "M",
//   printFullName: function () {
//     return this.name + " " + this.family;
//   },
// };
// const person2 = {
//   name: "Khalid",
//   family: "Alabid",
//   age: 23,
//   gender: "M",
//   printFullName: function () {
//     return this.name + " " + this.family;
//   },
// };
// const person3 = {
//   name: "Marouan",
//   family: "Ahmad",
//   age: 19,
//   gender: "M",
//   printFullName: function () {
//     return this.name + " " + this.family;
//   },
// };
// const person4 = {
//   name: "Nour",
//   family: "Alshareef",
//   age: 25,
//   gender: "F",
//   printFullName: function () {
//     return this.name + " " + this.family;
//   },
// };
// const person5 = {
//   name: "Maram",
//   family: "Mahmoud",
//   age: 24,
//   gender: "F",
//   printFullName: function () {
//     return this.name + " " + this.family;
//   },
// };

// function Person(name, family, age, gender) {
//   this.name = name;
//   this.family = family;
//   this.age = age;
//   this.gender = gender;
//   this.printFullName = function () {
//     return this.name + " " + this.family;
//   };
// }

// const mahmoud = new Person("Mahmoud", "Abulail", 28, "M");
// const ahmad = new Person("Ahmad", "Salih", 30, "M");
// console.log(mahmoud);
// console.log(mahmoud.printFullName());
// mahmoud.position = "Frontend developer";
// console.log(mahmoud);

class Person {
  constructor(name, family, age = 25) {
    this.name = name;
    this.family = family;
    this.age = age;
    this.gender = "M";
  }
  printFullName() {
    return this.name + " " + this.family;
  }
}

const kinda = new Person("Kinda", "Soso", 20);
kinda.gender = "F";
const fadia = { ...kinda, name: "Fadia", age: 19, address: "Damascus" };
fadia.nationality = "Syrian";
// console.log(kinda);
// console.log(fadia);
// console.log(family);

const { name: userName, family, ...rest} = fadia;

const [x, y] = [1, 3, 4]

const str = JSON.stringify(fadia);


// console.log(userName);
// console.log(family);c
// console.log(rest);
// console.log(address);
console.log(str);




/**
 *
 * 'use strict' to make the file like other languages: modeling
 * function builder for objects
 *
 * class
 */
