export const myForEach = (arr = [], func = (x) => x) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = func(arr[i]);
  }
};

export const myMap = (arr = [], func = (x) => x) => {
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    temp.push(func(arr[i]));
  }
  return temp;
};

export const sortingArray = (arr = [], comp = (x, y) => x > y) => {
  // let temp;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (comp(arr[i], arr[j])) {
        // if (arr[i] > arr[j]) {
        // temp = arr[i];
        // arr[i] = arr[j];
        // arr[j] = temp;
        [arr[i], arr[j]] = [arr[j], arr[i]]; 
      }
    }
  }
};

export const arrayFilter = (arr = [], func = (x) => x) => {
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    if (func(arr[i])) temp.push(arr[i]);
  }
  return temp;
};
