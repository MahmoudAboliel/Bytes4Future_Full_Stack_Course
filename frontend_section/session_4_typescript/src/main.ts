// type User = {
//   name: string;
//   age: number;
//   city: string;
// };

// const user1: User = {
//   name: "Mahmoud Abulail",
//   age: 28,
//   city: "Damascus Countryside",
// };

// console.log(user1);

// const arr: (number | string)[] = [1, 2, 3, "Mahmoud"];
// const arr2: Array<number | string> = [1, 2, 3, "Mahmoud"];

const calculator = (startTime: string, finalTime: string): number => {
  let minutes = 0;
  let [hs, ms] = startTime.split(":");
  let [he, me] = finalTime.split(":");

  minutes = (Number(he) - Number(hs)) * 60;
  minutes = minutes + Number(me) - Number(ms);
  return minutes;
};

console.log(calculator("1:30", "5:00"));
