export const generateId = (len = 16) => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let id = "";
    for (let i = 0; i < len; i++) {
        id += letters[Math.floor(Math.random() * letters.length)];
    }
    return id;
};
