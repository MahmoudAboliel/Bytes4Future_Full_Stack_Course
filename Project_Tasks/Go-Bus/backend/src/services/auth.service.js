// auth.service.js placeholder
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const register = async (data) => {
  const { name, phone, username, password } = data;

  if (!name || !phone || !username || !password) {
    throw new Error("Please fill all the fields");
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const existingPhone = await User.findOne({ phone });

  if (existingPhone) {
    throw new Error("Phone number already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    phone,
    username,
    password: passwordHash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "4h" },
  );

  return {
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      username: user.username,
      role: user.role,
    },
    token,
  };
};

export const login = async (data) => {
  const { username, password } = data;

  if (!username || !password) {
    throw new Error("Please enter username and password");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "4h" },
  );

  return {
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      username: user.username,
      role: user.role,
    },
    token,
  };
};
