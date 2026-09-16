import { request } from "../utils/api.js";

export const getTasks = async () => {
  const result = await request("tasks");
  return result.data;
};

// const t = await getTasks();
// console.log(t);

export const addTask = async (task = {}) => {
  const result = await request("tasks", "POST", task);
  return result;
};

// const x = await addTask({title: "one"});
// console.log(x);

export const deleteTask = async (taskId = "") => {
  const result = await request(`tasks/${taskId}`, "DELETE");
  return result;
};

// const y = await deleteTask("YDHws_bzdLk");
// console.log(y);

export const updateTask = async (taskId = "", data = {}) => {
  const result = await request(`tasks/${taskId}`, "PUT", data);
  return result;
};

// const z = await updateTask("YDHws_bzdLk", { title: "two" });
// console.log(z);