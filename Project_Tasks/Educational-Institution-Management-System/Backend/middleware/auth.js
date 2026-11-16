import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/lib.js";

export const protect = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new AppError("Not authenticated", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    _id: decoded.id,
    isActive: true,
    deletedAt: null,
  }).select("-password");

  if (!user) return next(new AppError("User not found or inactive", 401));
  req.user = user;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("Forbidden", 403));
    next();
  };
