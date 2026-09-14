import { tasks } from "./database.js";

const myTasks = [...tasks];

export const getTasks = () => ({
  data: myTasks,
  status: 200,
  message: "get tasks successfully.",
});

export const addTask = (task = {}) => {
  myTasks.push(user);
  return { status: 201, message: "add task successfully." };
};

export const deleteUser = (userId = "") => {
  const userIndex = myUsers.findIndex((e) => e.id == userId);
  myUsers.splice(userIndex, 1);
  return { status: 200, message: "delete user successfully." };
};

export const updateUser = (userId = "", data = {}) => {
  for (let i in myUsers) {
    if (myUsers[i].id == userId) {
      myUsers[i] = { ...myUsers[i], ...data };
      return {
        data: myUsers[i],
        status: 200,
        message: "update user successfully.",
      };
    }
  }
  return {
    status: 400,
    message: "this user is not found.",
  };
};
