import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import AppError from "../utils/lib.js";
import { escapeRegex } from "../utils/lib.js";

const shape = (u) => ({
  id: String(u._id),
  _id: u._id,
  fullName: u.fullName,
  email: u.email,
  role: u.role,
  phone: u.phone,
  isActive: u.isActive,
  birthDate: u.birthDate,
  study: u.study ?? null,
  specialization: u.specialization ?? null,
  bio: u.bio ?? null,
  deletedAt: u.deletedAt,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

export const listUsers = async ({
  role,
  status,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = { deletedAt: null };
  if (role) filter.role = role;
  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;
  if (search) {
    const re = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ fullName: re }, { email: re }, { phone: re }];
  }

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(200, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    items: items.map(shape),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getUser = async (id) => {
  const user = await User.findOne({ _id: id, deletedAt: null }).lean();
  if (!user) throw new AppError("User not found", 404);
  return shape(user);
};

export const createUser = async (data) => {
  const { password, ...rest } = data;
  const passwordHash = await bcrypt.hash(password, 10);

  const exists = await User.exists({ email: rest.email, deletedAt: null });
  if (exists) throw new AppError("Email already in use", 409);

  const user = await User.create({ ...rest, password: passwordHash });
  return shape(user);
};

export const updateUser = async (id, data) => {
  const { password, ...rest } = data;
  if (password) rest.password = await bcrypt.hash(password, 10);

  const user = await User.findOneAndUpdate({ _id: id, deletedAt: null }, rest, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError("User not found", 404);
  return shape(user);
};

export const toggleActive = async (id, isActive) => {
  const user = await User.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { isActive },
    { new: true },
  );
  if (!user) throw new AppError("User not found", 404);
  return shape(user);
};

export const deleteUser = async (id) => {
  const user = await User.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true },
  );
  if (!user) throw new AppError("User not found", 404);
  return shape(user);
};

// import { User } from "../models/userModel";
// export const getAllUsers = () => User.find();
// export const getUserById = (uid) => User.findById(uid);
// export const createNewUser = (userData) => User.create(userData);
// export const updateUser = (uid, userData) =>
//   User.findByIdAndUpdate(uid, userData);
// export const deleteUser = (uid) => User.findByIdAndDelete(uid);
