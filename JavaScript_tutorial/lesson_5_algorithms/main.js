const power = (n, m) => {
  if (m == 0) return 1;
  if (m == 1) return n;

  // this is a bad code
  // if (m % 2 == 0) {
  //   let temp = m / 2;
  //   return power(n, temp) * power(n, temp);
  // } else {
  //   let temp = (m + 1) / 2;
  //   return power(n, temp) * power(n, temp - 1);
  // }
  let p = power(n, Math.floor(m / 2));
  if (m % 2 === 0) return p * p;
  return p * p * n;
};

console.log(power(2, 3));
