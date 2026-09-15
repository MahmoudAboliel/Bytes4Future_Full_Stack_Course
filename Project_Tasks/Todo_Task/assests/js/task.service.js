import { tasks } from "./database.js";

const myTasks = [...tasks];

export const getTasks = () => ({
  data: myTasks,
  status: 200,
  message: "get tasks successfully.",
});

export const addTask = (task = {}) => {
  myTasks.push(task);
  return { status: 201, message: "add task successfully." };
};

export const deleteTask = (taskId = "") => {
  const taskIndex = myTasks.findIndex((e) => e.id == taskId);
  if (taskIndex == -1)
    return {
      status: 400,
      message: "this task is not found.",
    };
  myTasks.splice(taskIndex, 1);
  return { status: 200, message: "delete task successfully." };
};

export const updateTask = (taskId = "", data = {}) => {
  for (let i in myTasks) {
    if (myTasks[i].id == taskId) {
      myTasks[i] = { ...myTasks[i], ...data };
      return {
        data: myTasks[i],
        status: 200,
        message: "update task successfully.",
      };
    }
  }
  return {
    status: 400,
    message: "this task is not found.",
  };
};
