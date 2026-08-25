import {
  largestNumbers_1,
  largestNumbers_2,
  largestNumbers_3,
  longestName_1,
  longestName_2,
  longestName_3,
  numbersBiggerThanNeighbors_1,
  numbersBiggerThanNeighbors_2,
  countEligiblePeople_1,
  countEligiblePeople_2,
  countEligiblePeople_3,
  checkIfNumberIsExists_1,
  checkIfNumberIsExists_2,
  checkIfNumberIsExists_3,
  average_1,
  average_2,
  average_3,
  commonElements_1,
  commonElements_2,
  commonElements_3,
  sortCities_1,
  sortCities_2,
  sortCities_3,
  duplicatedItems_1,
  duplicatedItems_2,
  splitArrays_1,
  splitArrays_2,
  splitArrays_3,
  reverseWords_1,
  reverseWords_2,
  reverseWords_3,
  initialNames_1,
  initialNames_2,
  initialNames_3,
  productOver1000_1,
  productOver1000_2,
  productOver1000_3,
  chooseAndSortWords_1,
  chooseAndSortWords_2,
  sumPositive,
  extractPassedStudents,
  productsAboveAverage,
  sortNames,
} from "./lib.js";

const numbers = [88, 54, 63, 11, 87, 3, 47, 6, 3, 9, 12, 28, 0, 16, 21];
console.log("the first way:", largestNumbers_1(numbers));
console.log("the second way:", largestNumbers_2(numbers));
console.log("the third way:", largestNumbers_3(numbers));

const names = ["Sophia", "Jackson", "alaaAldeen", "Olivia", "Liam", "Emma"];
console.log("the first way:", longestName_1(names));
console.log("the second way:", longestName_2(names));
console.log("the third way:", longestName_3(names));

const numbers_2 = [1, 3, 4, 5, 12, 31, 4, 2, 16];
console.log("the first way:", numbersBiggerThanNeighbors_1(numbers_2));
console.log("the second way:", numbersBiggerThanNeighbors_2(numbers_2));

const peopleAges = [
  10, 5, 23, 18, 19, 6, 25, 11, 3, 66, 50, 41, 14, 8, 33, 17, 54, 28,
];
console.log("the first way:", countEligiblePeople_1(peopleAges));
console.log("the second way:", countEligiblePeople_2(peopleAges));
console.log("the third way:", countEligiblePeople_3(peopleAges));

const numbers_3 = [1111, 2222, 3333, 7777, 8888];
console.log(checkIfNumberIsExists_1(numbers_3, 1111));
console.log(checkIfNumberIsExists_2(numbers_3, 1111));
console.log(checkIfNumberIsExists_3(numbers_3, 1111));

const avg = [11, 15, 84, 54, 21, 74, 85];
console.log(average_1(avg));
console.log(average_2(avg));
console.log(average_3(avg));

const arr1 = [1, "hello", "A", 3, "world", "B", 5, 7, 7, 7];
const arr2 = ["B", "world", 4, "A", "hello", 7, 8];
console.log(commonElements_1(arr1, arr2));
console.log(commonElements_2(arr1, arr2));
console.log(commonElements_3(arr1, arr2));

const cities = [
  "Damascus",
  "Aleppo",
  "Homs",
  "Hama",
  "Latakia",
  "Deir ez-Zor",
  "Raqqa",
  "Al-Hasakah",
  "Tartus",
  "Idlib",
  "Al-Qamishli",
];
console.log(sortCities_1(cities));
console.log(sortCities_2(cities));
console.log(sortCities_3(cities));

const duplicated = [1.5, 2, "3", 4, 2, 5.6, true, 1.5, "7", 8, 4, "3"];
console.log(duplicatedItems_1(duplicated));
console.log(duplicatedItems_2(duplicated));

const numbers_4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
console.log(splitArrays_1(numbers_4, 3));
console.log(splitArrays_2(numbers_4, 3));
console.log(splitArrays_3(numbers_4, 3));

const words = ["red", "yellow", "green", "purple", "blue", "white"];
console.log(reverseWords_1(words));
console.log(reverseWords_2(words));
console.log(reverseWords_3(words));

const fullNames = [
  "Eduard Newgate",
  "Naruto Uzumaki",
  "Mahmoud Abulail",
  "Karem Ali",
];
console.log(initialNames_1(fullNames));
// console.log(initialNames_2(fullNames));
// console.log(initialNames_3(fullNames));

const products = [
  { name: "Laptop", price: 500, quantity: 3 },
  { name: "Phone", price: 1200, quantity: 1 },
  { name: "Tablet", price: 400, quantity: 2 },
  { name: "Camira", price: 1300, quantity: 1 },
];
console.log(productOver1000_1(products));
console.log(productOver1000_2(products));
console.log(productOver1000_3(products));

const fruits = [
  "strawberry",
  "banana",
  "cherry",
  "date",
  "new",
  "elderberry",
  "Apple",
];
console.log(chooseAndSortWords_1(fruits, 5));
console.log(chooseAndSortWords_2(fruits, 5));

const numbers_5 = [1, 11, -9, 20, -3, 8, -1];
console.log(sumPositive(numbers_5));

const students = [
  { name: "Sara", status: "pass" },
  { name: "Ali", status: "fail" },
  { name: "Lina", status: "pass" },
];
console.log(extractPassedStudents(students));

const products_2 = [
  { name: "Table", price: 500 },
  { name: "Chair", price: 200 },
  { name: "Desk", price: 800 },
  { name: "Lamp", price: 150 },
];
console.log(productsAboveAverage(products_2));

const names_3 = [
  { name: "Ahmad", age: 25 },
  { name: "Omar", age: 30 },
  { name: "Layla", age: 22 },
];
console.log(sortNames(names_3));
