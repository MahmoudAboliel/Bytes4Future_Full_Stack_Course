type Gender = "Male" | "Female";

type Person = {
  name: string;
  family: string;
  age: number;
  gender?: Gender;
};
type Student = {
  year: string;
  class: string;
  
};
const user1: Person = {
  name: "Mahmoud",
  family: "Abulail",
  age: 28,
  gender: "Male",
};

console.log(user1);

// Tuple
type St = [string, number, string];
const ahmad: St = ["", 0, ""];

type Point = [number, number, number?];
let O: Point = [0, 0];
