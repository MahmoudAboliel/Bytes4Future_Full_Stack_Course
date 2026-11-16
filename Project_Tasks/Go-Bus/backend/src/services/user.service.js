// user.service.js placeholder

import { User } from "../models/User.model.js";

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getAllUsers = async () => {
  const users = await User.find().select("-password");

  return users;
};

export const updateUser = async (userId, data) => {
  const { name, phone, username } = data;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (username !== undefined) user.username = username;

  await user.save();

  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    username: user.username,
    role: user.role,
  };
};

export const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(userId);

  return { message: "User deleted successfully" };
};
