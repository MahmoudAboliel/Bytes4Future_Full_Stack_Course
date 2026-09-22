export const generateId = (len: number = 16): string => {
  const letters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  let id = "";
  for (let i = 0; i < len; i++) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }
  return id;
};
