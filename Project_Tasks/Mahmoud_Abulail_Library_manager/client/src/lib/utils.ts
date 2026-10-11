import type { Status } from "./types";

export { cn } from "cn";

export const getDateStatus = (returnDate: Date | string): Status => {
  const today = new Date();
  const due = new Date(returnDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const todayTime = today.getTime();
  const dueTime = due.getTime();

  if (dueTime > todayTime) return "safe";
  else if (dueTime === todayTime) return "due";
  return "late"; 
};
