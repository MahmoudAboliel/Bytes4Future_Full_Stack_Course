export const operatingOnArray = (arr = [], func) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = func(arr[i]);
  }
};

export const sortingArray = (arr = [], comp) => {
  let temp;
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
