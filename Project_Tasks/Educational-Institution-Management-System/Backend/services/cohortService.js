import Cohort from "../models/cohortModel.js";
import Enrollment from "../models/enrollmentModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import { escapeRegex } from "../utils/lib.js";

const shape = (c) => ({
  id: String(c._id),
  _id: c._id,
  code: c.code,
  levelId: c.levelId,
  teacherId: c.teacherId,
  startDate: c.startDate,
  endDate: c.endDate,
  capacity: c.capacity,
  status: c.status,
  isActive: c.isActive,
  deletedAt: c.deletedAt,
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
});

export const listCohorts = async ({
  status,
  teacherId,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = { deletedAt: null };
  if (status) filter.status = status;
  if (teacherId) filter.teacherId = teacherId;
  if (search) filter.code = new RegExp(escapeRegex(search), "i");

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(200, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    Cohort.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Cohort.countDocuments(filter),
  ]);

  return {
    items: items.map(shape),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getCohort = async (id) => {
  const c = await Cohort.findOne({ _id: id, deletedAt: null }).lean();
  if (!c) throw new AppError("Cohort not found", 404);
  return shape(c);
};

export const createCohort = async (data) => {
  const teacher = await User.findOne({
    _id: data.teacherId,
    role: "teacher",
    deletedAt: null,
  });
  if (!teacher) throw new AppError("Teacher not found", 404);

  const c = await Cohort.create(data);
  return shape(c);
};

export const updateCohort = async (id, data) => {
  const c = await Cohort.findOneAndUpdate({ _id: id, deletedAt: null }, data, {
    new: true,
    runValidators: true,
  });
  if (!c) throw new AppError("Cohort not found", 404);
  return shape(c);
};

export const deleteCohort = async (id) => {
  const c = await Cohort.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true },
  );
  if (!c) throw new AppError("Cohort not found", 404);
  return shape(c);
};

export const listCohortEnrollments = async (cohortId) => {
  const cohort = await Cohort.findOne({ _id: cohortId, deletedAt: null });
  if (!cohort) throw new AppError("Cohort not found", 404);

  const items = await Enrollment.find({ cohortId, deletedAt: null })
    .populate("studentId", "fullName email phone study")
    .lean();

  return items.map((e) => ({
    id: String(e._id),
    _id: e._id,
    studentId: e.studentId?._id ? String(e.studentId._id) : e.studentId,
    student: e.studentId,
    cohortId: String(e.cohortId),
    status: e.status,
    enrolledAt: e.enrolledAt,
    isActive: e.isActive,
  }));
};
