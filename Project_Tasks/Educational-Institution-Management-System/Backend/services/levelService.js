import Level from "../models/levelModel.js";
import Course from "../models/courseModel.js";
import AppError from "../utils/AppError.js";

const shape = (l) => ({
  id: String(l._id),
  _id: l._id,
  title: l.title,
  courseId: l.courseId,
  orderNumber: l.orderNumber,
  isActive: l.isActive,
  deletedAt: l.deletedAt,
  createdAt: l.createdAt,
  updatedAt: l.updatedAt,
});

export const listLevels = async ({ courseId, page = 1, limit = 50 }) => {
  const filter = { deletedAt: null };
  if (courseId) filter.courseId = courseId;

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(200, Math.max(1, Number(limit) || 50));

  const [items, total] = await Promise.all([
    Level.find(filter)
      .sort("orderNumber")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Level.countDocuments(filter),
  ]);

  return {
    items: items.map(shape),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const createLevel = async (data) => {
  const course = await Course.findOne({ _id: data.courseId, deletedAt: null });
  if (!course) throw new AppError("Course not found", 404);
  return shape(await Level.create(data));
};

export const updateLevel = async (id, data) => {
  const l = await Level.findOneAndUpdate({ _id: id, deletedAt: null }, data, {
    new: true,
    runValidators: true,
  });
  if (!l) throw new AppError("Level not found", 404);
  return shape(l);
};

export const deleteLevel = async (id) => {
  const l = await Level.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true },
  );
  if (!l) throw new AppError("Level not found", 404);
  return shape(l);
};
