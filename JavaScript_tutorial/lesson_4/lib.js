export const init = (n = 0) => {
  const array = new Array(n);
  for (let i = 0; i < n; i++) {
    let row = new Array(n);
    row.fill(0);
    array[i] = row;
  }

  return array;
};

export const pascalAngle_1 = (n = 0) => {
  //   const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  const matrix = init(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (j === 0 || i === j) {
        matrix[i][j] = 1;
        continue;
      }
      if (i > j) {
        matrix[i][j] = matrix[i - 1][j] + matrix[i - 1][j - 1];
      }
    }
  }
  return matrix;
};

export const pascalAngle_2 = (n = 0) => {
  const matrix = [];
  
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j <= i; j++) {

      if (j === 0 || i === j) {
        row[j] = 1;
        continue;
      } else {
        row[j] = matrix[i - 1][j] + matrix[i - 1][j - 1];
      }
    }
    matrix.push(row);
  }
  return matrix;
};

export const pascalAngle_3 = (line, col) => {
  if (col === 0 || line === col) return 1;
  return pascalAngle_3(line - 1, col) + pascalAngle_3(line - 1, col - 1);
};
