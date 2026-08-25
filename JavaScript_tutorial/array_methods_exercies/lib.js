// Find the largest number and the number before it
const maximum = (arr = []) => {
  let max = arr[0];
  let index = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
      index = i;
    }
  }
  return { max, index };
};

export const largestNumbers_1 = (arr = []) => {
  let newArr = [...arr];
  let { max, index } = maximum(newArr);
  newArr[index] = 0;
  let { max: secondMax, _ } = maximum(newArr);

  return { Largest: max, "Before the largest": secondMax };
};

export const largestNumbers_2 = (arr = []) => {
  let sortedArr = arr.toSorted((x, y) => x - y);
  return { Largest: sortedArr.at(-1), "Before the largest": sortedArr.at(-2) };
};

export const largestNumbers_3 = (arr = []) => {
  let newArr = [...arr];
  let max = Math.max.apply(null, newArr);
  let index = newArr.indexOf(max);
  newArr.splice(index, 1);
  let secondMax = Math.max(...newArr);
  return { Largest: max, "Before the largest": secondMax };
};

// Find the longest name in the array
export const longestName_1 = (arr = [""]) => {
  let longestLen = 0;
  let index = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length > longestLen) {
      longestLen = arr[i].length;
      index = i;
    }
  }
  return [arr[index]];
};

export const longestName_2 = (arr = [""]) => {
  let sortedArr = arr.toSorted((x, y) => y.length - x.length);
  return [sortedArr[0]];
};

export const longestName_3 = (arr = [""]) => {
  const arrayOflengths = arr.map((name) => name.length);
  const longes = Math.max(...arrayOflengths);
  const index = arrayOflengths.indexOf(longes);
  return [arr[index]];
};

// Extract numbers bigger than their adjacent neighbors
export const numbersBiggerThanNeighbors_1 = (arr = []) => {
  let init = [arr[0]];
  let result = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1] && arr[i] > init[init.length - 1])
      init.push(arr[i]);
  }
  init.shift();
  for (let i = 0; i < init.length; i++) {
    if (init[i] + 1 != init[i + 1]) result.push(init[i]);
  }
  return result;
};

export const numbersBiggerThanNeighbors_2 = (arr = []) => {
  const init = arr.filter((item, i, array) => {
    if (item > array[i - 1]) return true;
    return false;
  });

  const result = init.filter((item, i, array) => {
    if (item > array[i - 1] && item + 1 != array[i + 1]) return true;
    return false;
  });

  return result;
};

// Count the number of people eligible to vote
export const countEligiblePeople_1 = (arr = []) => {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= 18) count++;
  }
  return count;
};

export const countEligiblePeople_2 = (arr = []) => {
  let eligiblePeople = arr.filter((age) => age >= 18);
  return eligiblePeople.length;
};

export const countEligiblePeople_3 = (arr = []) => {
  const func = (total, value) => {
    if (value >= 18) return (total += 1);
    return total;
  };
  const count = arr.reduce(func, 0);
  return count;
};

// Check if a specific number exists in the array
export const checkIfNumberIsExists_1 = (arr = [], num = 0) => {
  let check = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == num) {
      check = true;
      break;
    }
  }
  return check;
};

export const checkIfNumberIsExists_2 = (arr = [], num = 0) => {
  return arr.includes(num);
};

export const checkIfNumberIsExists_3 = (arr = [], num = 0) => {
  let check = arr.indexOf(num);
  if (check != -1) return true;
  return false;
};

// Calculate the average of numbers
export const average_1 = (arr = []) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  let avg = sum / arr.length;
  return parseFloat(avg.toFixed(2));
};

export const average_2 = (arr = []) => {
  let sum = 0;
  for (let v of arr) {
    sum += v;
  }

  let avg = sum / arr.length;
  return parseFloat(avg.toFixed(2));
};

export const average_3 = (arr = []) => {
  let sum = arr.reduce((total, val) => total + val, 0);

  let avg = sum / arr.length;
  return parseFloat(avg.toFixed(2));
};

// Find common elements between two arrays
const removeDuplicates = (arr = []) => {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) arr.splice(j, 1);
    }
  }
  return arr;
};

export const commonElements_1 = (arr1 = [], arr2 = []) => {
  let common = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] == arr2[j]) {
        common.push(arr1[i]);
        break;
      }
    }
  }
  return removeDuplicates(common);
};

export const commonElements_2 = (arr1 = [], arr2 = []) => {
  let common = [];
  for (let one of arr1) {
    for (let two of arr2) {
      if (one == two) {
        common.push(one);
        break;
      }
    }
  }

  const res = new Set(common);
  return [...res];
};

export const commonElements_3 = (arr1 = [], arr2 = []) => {
  let common = [];
  for (let val of arr1) {
    if (arr2.includes(val)) common.push(val);
  }
  let res = common.filter((item, i) => {
    return common.lastIndexOf(item) === i;
  });

  return res;
};

// Sort cities alphabetically
export const sortCities_1 = (arr = []) => {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
};

export const sortCities_2 = (arr = []) => {
  return arr.sort();
};

export const sortCities_3 = (arr = []) => {
  const cities = arr.toSorted();
  return cities;
};

// Find duplicated items in an array
export const duplicatedItems_1 = (arr = []) => {
  let duplicated = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicated.push(arr[i]);
        break;
      }
    }
  }

  const res = new Set(duplicated);
  return [...res];
};

export const duplicatedItems_2 = (arr = []) => {
  const duplicated = arr.filter((item, i) => {
    return arr.lastIndexOf(item) !== i;
  });
  return duplicated;
};

export const duplicatedItems_3 = (arr = []) => {
  //   const duplicated = arr.sort((a, b) => a - b);
  //   return duplicated;
};

// Split an array into chunks of size 3
export const splitArrays_1 = (arr = [], size = 3) => {
  let splitArr = [];
  let len = 0;
  const mode = arr.length % size;
  let row = [];

  for (let i = 0; i < arr.length; i++) {
    len++;
    row.push(arr[i]);
    if (len == size) {
      splitArr.push(row);
      len = 0;
      row = [];
    }
  }

  if (mode) {
    row = [];
    for (let i = arr.length - mode; i < arr.length; i++) {
      row.push(arr[i]);
    }
    splitArr.push(row);
  }

  return splitArr;
};

export const splitArrays_2 = (arr = [], size = 3) => {
  const freq = arr.length / size;
  let splitArr = [];
  let start = 0;
  let end = size;

  for (let i = 0; i < freq; i++) {
    splitArr.push(arr.slice(start, end));
    start += size;
    end += size;
  }

  return splitArr;
};

export const splitArrays_3 = (arr = [], size = 3) => {
  const freq = arr.length / size;
  let store;

  for (let i = 0; i < freq; i++) {
    store = arr.slice(i, size + i);
    arr.splice(i, size, store);
  }
  return arr;
};

// Reverse each word in the array
export const reverseWords_1 = (arr = [""]) => {
  for (let i in arr) {
    let rev = "";
    for (let j = arr[i].length - 1; j >= 0; j--) {
      rev += arr[i][j];
    }
    arr[i] = rev;
  }
  return arr;
};

export const reverseWords_2 = (arr = [""]) => {
  let word;
  for (let i in arr) {
    word = arr[i].split("");
    word.reverse();
    arr[i] = word.join("");
  }
  return arr;
};

export const reverseWords_3 = (arr = [""]) => {
  let word;
  const revArr = arr.map((w) => {
    word = w.split("");
    word.reverse();
    return word.join("");
  });
  return revArr;
};

// Convert full names into initials
export const initialNames_1 = (arr = [""]) => {
  let word;
  for (let i in arr) {
    word = arr[i].split(" ");
    arr[i] = word[0][0].toUpperCase() + "." + word[1][0].toUpperCase();
  }

  return arr;
};

export const initialNames_2 = (arr = [""]) => {
  for (let i in arr) {
    let [first, last] = [...arr[i].split(" ")];
    arr[i] = `${first[0].toUpperCase()}.${last[0].toUpperCase()}`;
  }
  return arr;
};

export const initialNames_3 = (arr = [""]) => {
  arr.forEach((val, i) => {
    let [f, l] = [...val.split(" ")];

    arr[i] = `${f[0].toUpperCase()}.${l[0].toUpperCase()}`;
  });
  return arr;
};

// Find the first product with a total price over 1000
export const productOver1000_1 = (
  arr = [{ name: "", price: 0, quantity: 0 }],
) => {
  for (let i in arr) {
    if (arr[i].price > 1000) {
      return arr[i];
    }
  }
};

export const productOver1000_2 = (
  arr = [{ name: "", price: 0, quantity: 0 }],
) => {
  return arr.filter((item) => item.price > 1000)[0];
};

export const productOver1000_3 = (
  arr = [{ name: "", price: 0, quantity: 0 }],
) => {
  return arr.find((item) => item.price > 1000);
};

// Find words with 5 letters or more and sort them
export const chooseAndSortWords_1 = (arr = [""], len = 5) => {
  const choosing = [];

  for (let i in arr) {
    if (arr[i].trim().length >= len) {
      choosing.push(arr[i]);
    }
  }

  for (let i = 0; i < choosing.length - 1; i++) {
    for (let j = i + 1; j < choosing.length; j++) {
      if (choosing[i] > choosing[j]) {
        [choosing[i], choosing[j]] = [choosing[j], choosing[i]];
      }
    }
  }
  return choosing;
};

export const chooseAndSortWords_2 = (arr = [""], len = 5) => {
  const choosing = arr.filter((item) => item.length >= len);
  return choosing.sort();
};

// Use reduce to sum only positive numbers • Input: [1, 11, -9, 20, -3, 8, -1] • Expected Output: 40
export const sumPositive = (arr = [0]) => {
  return arr.reduce((total, val) => {
    if (val > 0) {
      return total + val;
    }
    return total;
  }, 0);
};

// Extract names of students who passed • Input: [{name: "Sara", status: "pass"}, {name: "Ali", status: "fail"}, {name: "Lina", status: "pass"}] • Expected Output: ["Sara", "Lina"]
export const extractPassedStudents = (arr = [{ name: "", status: "" }]) => {
  return arr.filter((item) => item.status == "pass").map((item) => item.name);
};

// Extract products with price above the average • Input: [{name: "Table", price: 500}, {name: "Chair", price: 200}, {name: "Desk", price: 800}, {name: "Lamp", price: 150}] • Expected Output: [{name: "Table", price: 500}, {name: "Desk", price: 800}]
export const productsAboveAverage = (arr = [{ name: "", price: 0 }]) => {
  const sum = arr.reduce((total, val) => total + val.price, 0);
  const avg = Math.round(sum / arr.length);
  return arr.filter((item) => item.price > avg);
};

// Sort people by age descending and return their names • Input: [{name: "Ahmad", age: 25}, {name: "Omar", age: 30}, {name: "Layla", age: 22}] • Expected Output: ["Omar", "Ahmad", "Layla"]
export const sortNames = (arr = [{ name: "", age: 0 }]) => {
  arr.sort((a, b) => b.age - a.age);
  return arr.map((item) => item.name);
};