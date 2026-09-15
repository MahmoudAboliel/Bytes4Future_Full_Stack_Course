import { users } from "./database.js";

const myUsers = [...users];

export const getUsers = () => ({
  data: myUsers,
  status: 200,
  message: "get users successfully.",
});

export const addUser = (user = {}) => {
  myUsers.push(user);
  return { status: 201, message: "add user successfully." };
};

export const deleteUser = (userId = "") => {
  const userIndex = myUsers.findIndex((e) => e.id == userId);
  if (userIndex == -1)
    return {
      status: 400,
      message: "this user is not found.",
    };
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
