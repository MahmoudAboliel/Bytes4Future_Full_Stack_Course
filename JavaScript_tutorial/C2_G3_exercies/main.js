import {
  checkDisarium,
  moveZerosToEnd,
  thueMorseSequence,
  longestIncreasingSubsequence,
} from "./lib.js";

console.log("check Disarium:", checkDisarium(89));

console.log("move Zeros To End:", moveZerosToEnd([10, 0, 5, 20, 0, 12, 0]));

console.log("thue Morse Sequence:", thueMorseSequence(10));

console.log(
  "longest Increasing Subsequence:",
  longestIncreasingSubsequence([20, 24, 22, 26, 30, 34, 28, 40, 30, 42, 44]),
);

let x = "asdfg";
console.log(x[x.length - 1]);
