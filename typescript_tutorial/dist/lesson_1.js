"use strict";
// const arr: (number | string)[] = [1, 2, 3, "Mahmoud"];
// const arr2: Array<number | string> = [1, 2, 3, "Mahmoud"];
Object.defineProperty(exports, "__esModule", { value: true });
const calculator = (startTime, finalTime) => {
    let minutes = 0;
    let [hs, ms] = startTime.split(":");
    let [he, me] = finalTime.split(":");
    minutes = (Number(he) - Number(hs)) * 60;
    minutes = minutes + Number(me) - Number(ms);
    return minutes;
};
console.log('You have:', calculator("1:30", "5:00"), 'minutes');
