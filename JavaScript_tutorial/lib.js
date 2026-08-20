export const isPrim = (x) => {
    if (x === 1) return true;
    if (x % 2 === 0) return false;
    for (let i = 2; i < x; i++) {
        if (x % i === 0) return false;
    }
    return true;
}

export const mode10 = (x, mode) => {
    return (x - mode) / 10
}

export const reverse = (num) => {
    let temp = num;
    let result = 0;

    while (temp > 0) {
        let digit = temp % 10;
        result = result * 10 + digit;
        temp = mode10(temp, digit);
    }

    return result
}