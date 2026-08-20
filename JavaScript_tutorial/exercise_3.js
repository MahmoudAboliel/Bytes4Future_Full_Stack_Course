import { letterConventer } from "./exercise_2.js";

export const evenAndOddCounter = (str) => {
  let odd = [];
  let even = [];

  for (let i = 0; i < str.length; i++) {
    if (parseInt(str[i]) % 2 === 0) even.push(parseInt(str[i]));
    else odd.push(parseInt(str[i]));
  }

  return [even.length, odd.length];
};

export const pascalCase = (str) => {
  let temp = letterConventer(str[0]);

  for (let i = 1; i < str.length; i++) {
    if (str[i] === " ") continue;

    if (str[i - 1] === " ") {
      temp = temp + letterConventer(str[i]);
    } else {
      temp = temp + str[i];
    }
  }
  return temp;
};

export const unionOfTwoArrays = (arr1, arr2) => {
  let shard = [];
  let isMatched = false;
  for (let i = 0; i < arr2.length; i++) {
    for (let j = 0; j < arr1.length; j++) {
      if (arr2[i] === arr1[j]) isMatched = true;
    }
    if (!isMatched) shard.push(arr2[i]);
    isMatched = false;
  }

  return shard;
};

