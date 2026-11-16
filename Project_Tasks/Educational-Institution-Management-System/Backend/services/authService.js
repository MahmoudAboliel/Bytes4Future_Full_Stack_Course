import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateToken, handleUser } from "../utils/lib.js";

export const registerUser = async (user) => {
  const existingUser = await User.findOne({ email: user.email });

  if (existingUser) {
    throw Object.assign(new Error("Email already registered"), {
      status: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(user.password, 12);

  const createUser = await User.create({ ...user, password: hashedPassword });

  return {
    user: handleUser(createUser),
    token: generateToken(createUser),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw Object.assign(new Error("Invalid email or password"), {
      status: 401,
    });
  }

  if (!user.isActive) {
    throw Object.assign(new Error("Account is pending approval"), {
      status: 403,
    });
  }

  return {
    user: handleUser(user),
    token: generateToken(user),
  };
};

export const authenticateToken = async (token) => {
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw Object.assign(new Error("Invalid or expired token"), {
      status: 401,
    });
  }

  if (typeof payload !== "object" || typeof payload.id !== "string") {
    throw Object.assign(new Error("Invalid token payload"), { status: 401 });
  }

  const user = await User.findById(payload.id).lean();

  if (!user) {
    throw Object.assign(new Error("User not found"), {
      status: 404,
    });
  }

  const { password, _id, ...rest } = user;
  return { ...rest, id: _id };
};

export async function logoutUser(userId) {}
