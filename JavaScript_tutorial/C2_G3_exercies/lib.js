// Write a function to check if a number is a Disarium or not.

export const checkDisarium = (num = 0) => {
  let n = num.toFixed().split("");
  let res = 0;
  for (let i = 0; i < n.length; i++) {
    res += Math.pow(n[i], i + 1);
  }

  if (res === num) return "Disarium";
  else return "Not Disarium";
};

// Write a function to move all zeroes in an array to the end.
export const moveZerosToEnd = (arr = []) => {
  let count = 0;
  const arr2 = arr.filter((item) => {
    if (item === 0) count++;
    return item !== 0;
  });

  for (let i = 0; i < count; i++) arr2.push(0);
  return arr2;
};

// Write a function to generate th thue-morese sequence.
export const thueMorseSequence = (n = 0) => {
  let arr = [];
  let count = 0;
  let bin;
  let binArr;
  for (let i = 0; i <= n; i++) {
    bin = i.toString(2);
    binArr = bin.split("");
    for (let i = 0; i < binArr.length; i++) {
      if (binArr[i] == 1) count++;
    }
    arr.push(count);
    count = 0;
  }

  return arr;
};

// Write a function to find the length of the longest increasing subsequence.
export const longestIncreasingSubsequence = (lst = []) => {
  let arr = [];
  let max;
  for (let i = 0; i < lst.length; i++) {
    let subArr = [];
    subArr.push(lst[i]);
    for (let j = i + 1; j < lst.length; j++) {
      if (lst[j] > subArr[subArr.length - 1]) subArr.push(lst[j]);
    }
    arr.push(subArr);
    subArr = [];
  }

  max = arr[0].length;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].length > max) max = arr[i].length;
  }
  return max;
};

// Write a function to connect an array of words into a single string.
export const connectWords = (words = [""]) => {
  let string = words[0];
  let count = words.length - 1;
  while (count >= 0) {
    for (let i = 1; i < words.length; i++) {
      if (words[i].startsWith(string[string.length - 1])) {
        string += words[i];
        words[i] = "";
        break;
      }
      count--;
    }
  }
  return string;
};
