import jwt from "jsonwebtoken";
import "dotenv/config";

export const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already registered",
    });
  }

  const status = error.status || 500;

  return res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : error.message,
  });
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
};

export const handleUser = (user) => {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};

export const escapeRegex = (str = "") =>
  String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const ok = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

export const created = (res, data) => ok(res, data, 201);

export const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);