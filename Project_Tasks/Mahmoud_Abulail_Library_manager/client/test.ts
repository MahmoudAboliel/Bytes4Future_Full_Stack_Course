// const createBoard = () => Array.from({ length: 6 }, () => Array(7).fill(null));

// const x = createBoard().flat(1);
// console.log(x);

// const d = [
//   [0, 1, 2, 3, 4, 5, 6],
//   [7, 8, 9, 10, 11, 12, 13],
//   [14, 15, 16, 17, 18, 19, 20],
//   [21, 22, 23, 24, 25, 26, 27],
//   [28, 29, 30, 31, 32, 33, 34],
//   [35, 36, 37, 38, 39, 40, 41],

//   [0, 7, 14, 21, 28, 35],
//   [1, 8, 15, 22, 29, 36],
//   [2, 9, 16, 23, 30, 37],
//   [3, 10, 17, 24, 31, 38],
//   [4, 11, 18, 25, 32, 39],
//   [5, 12, 19, 26, 33, 40],
//   [6, 13, 20, 27, 34, 41],

//   [14, 22, 30, 38],
//   [7, 15, 23, 31, 39],
//   [0, 8, 16, 24, 32, 40],
//   [1, 9, 17, 25, 33, 41],
//   [2, 10, 18, 26, 34],
//   [3, 11, 19, 27],

//   [3, 9, 15, 21],
//   [4, 10, 16, 22, 28],
//   [5, 11, 17, 23, 29, 35],
//   [6, 12, 18, 24, 30, 36],
//   [13, 19, 25, 31, 37],
//   [20, 26, 32, 38],
// ];


// const t = [
//   [ 0,  1,  2,  3,  4,  5,  6],
//   [ 7,  8,  9, 10, 11, 12, 13],
//   [14, 15, 16, 17, 18, 19, 20],
//   [21, 22, 23, 24, 25, 26, 27],
//   [28, 29, 30, 31, 32, 33, 34],
//   [35, 36, 37, 38, 39, 40, 41],
// ];

// const mycol = t[3];
// const myrow = [];
// for (let i = 0; i < 6; i++) {
//     for (let j = 0; j < 7; j++) {
//         if (j === 0) {
//             myrow.push(t[i][j]);
//         }
//     }
// }

// const myd1 = [];
// for (let i = 0; i < 6; i++) {
//   for (let j = 0; j < 7; j++) {
//     if (i + j === 2 + 2) {
//       myd1.push(t[i][j]);
//     }
//   }
// }

// const myd2 = [];
// for (let i = 0; i < 6; i++) {
//   for (let j = 0; j < 7; j++) {
//     if (i - j === 2 - 2) {
//       myd2.push(t[i][j]);
//     }
//   }
// }
// console.log(myd2);

// const xx = [ 0,  1,  2,  3,  4,  5,  6];
// console.log(typeof(xx[-5]))

// const initialMaze: number[][] = [
//   [0, 1, 0, 0, 0],
//   [0, 1, 0, 1, 0],
//   [0, 0, 0, 1, 0],
//   [1, 1, 0, 0, 0],
//   [0, 0, 0, 1, 2],
// ];

// console.log(initialMaze[3 - 0][4 + 0]);
// const now = new Date().toISOString().slice(0, 10);
// const tomorrow = new Date("2026-1-10").toISOString().slice(0, 10);
// console.log(now < tomorrow)
// console.log(tomorrow)

const isRotate = (str1="", str2="") => {
  const s1 = str1.split(" ");
  let test;
  let f;
  let e;
  for (let i = 0; i < s1.length; i++) {
    f = s1.slice(0, i);
    e = s1.slice(i)
    test = [...e, ...f];
    if (test.join(" ") === str2) {
      return true;
    }
  }

  return false;
}

isRotate("w1 w2 w3 w4 w5");