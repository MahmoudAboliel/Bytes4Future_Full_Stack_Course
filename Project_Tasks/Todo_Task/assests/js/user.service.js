import { request } from "./api.js";

export const getUsers = async () => {
  const result = await request("users");
  return result;
};

// const u = await getUsers();
// console.log(u);

export const addUser = async (user = {}) => {
  const users = await getUsers();
  const checkUser = users.data?.find(u => u.email == user.email);
  if (checkUser) {
    return {
      status: 400,
      message: "this user already exists.",
    };
  }

  const result = await request("users", "POST", user);

  return result;
};

// const x = await addUser({ name: "ali", email: "ali@gmail.com" });
// console.log(x);

export const deleteUser = async (userId = "") => {
  const result = await request(`users/${userId}`, "DELETE");
  return result;
};
// const y = await deleteUser("1");
// console.log(y);

export const updateUser = async (userId = "", data = {}) => {
  const result = await request(`users/${userId}`, "PUT", data);
  return result;
};
// const z = await updateUser("i33PhyqfD5E", { name: "ali mohamd" });
// console.log(z);
