export const avarge = (arr) => {
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    res = res + arr[i];
  }
  return res / arr.length;
};

export const snakeCase = (str) => {
  let temp = "";

  for (let i = 0; i < str.length; i++) {
    if (str[i] === " ") temp = temp + "_";
    else temp = temp + str[i];
  }
  return temp;
};

export const letterConventer = (char) => {
  let letters = {
    a: "A", b: "B", c: "C", d: "D", e: "E", f: "F", g: "G", h: "H", i: "I", j: "J", k: "K", l: "L", m: "M", n: "N", o: "O", p: "P", q: "Q", r: "R", s: "S", t: "T", u: "U", v: "V",  w: "W", x: "X", y: "Y", z: "Z", A: "A", B: "B", C: "C", D: "D", E: "E", F: "F", G: "G", H: "H", I: "I", J: "J", K: "K", L: "L", M: "M", N: "N", O: "O", P: "P", Q: "Q", R: "R", S: "S", T: "T", U: "U", V: "V", W: "W", X: "X", Y: "Y", Z: "Z", " ": ""
  };

  return letters[char];
};

export const camelCase = (str) => {
  let temp = "";

  for (let i = 0; i < str.length; i++) {
    if (str[i] === " ") continue;

    if (str[i - 1] === " ") {
      temp = temp + letterConventer(str[i]);
    } else {
      temp = temp + str[i];
    }
  }
  return temp;
};

export const myMaximum = (arr) => {
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }

  return max;
};

export const HCF = (n1, n2) => {
  let fact1 = [];
  let fact2 = [];
  let shared = [];

  for (let i = 1; i <= n1; i++) {
    if (n1 % i === 0) fact1.push(i);
  }
  for (let i = 1; i <= n2; i++) {
    if (n2 % i === 0) fact2.push(i);
  }

  for (let i = 0; i < fact1.length; i++) {
    for (let j = 0; j < fact2.length; j++) {
      if (fact1[i] === fact2[j]) {
        shared.push(fact1[i]);
      }
    }
  }

  return myMaximum(shared);
};
