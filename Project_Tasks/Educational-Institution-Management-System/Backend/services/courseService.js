import Course from "../models/courseModel.js";
import AppError from "../utils/AppError.js";
import { escapeRegex } from "../utils/lib.js";

const shape = (c) => ({
  id: String(c._id),
  _id: c._id,
  name: c.name,
  description: c.description,
  isActive: c.isActive,
  deletedAt: c.deletedAt,
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
});

export const listCourses = async ({ search, page = 1, limit = 20 }) => {
  const filter = { deletedAt: null };
  if (search) filter.name = new RegExp(escapeRegex(search), "i");

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(200, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    Course.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Course.countDocuments(filter),
  ]);

  return {
    items: items.map(shape),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const createCourse = async (data) => shape(await Course.create(data));

export const updateCourse = async (id, data) => {
  const c = await Course.findOneAndUpdate({ _id: id, deletedAt: null }, data, {
    new: true,
    runValidators: true,
  });
  if (!c) throw new AppError("Course not found", 404);
  return shape(c);
};

export const deleteCourse = async (id) => {
  const c = await Course.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true },
  );
  if (!c) throw new AppError("Course not found", 404);
  return shape(c);
};
