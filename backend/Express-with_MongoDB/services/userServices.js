import User from "../models/userModel.js";

export const getAll = (skip, limit, sort) =>
  User.find({}).sort(sort).skip(skip).limit(limit);

export const getCount = () => User.countDocuments();

export const create = (data) => User.create(data)