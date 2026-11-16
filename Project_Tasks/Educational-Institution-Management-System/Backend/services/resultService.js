import EnrollmentResult from "../models/enrollmentResultModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Cohort from "../models/cohortModel.js";
import AppError from "../utils/AppError.js";

const shape = (r) => ({
  id: String(r._id),
  _id: r._id,
  enrollmentId: r.enrollmentId,
  kind: r.kind || "",
  score: r.score,
  maxScore: r.maxScore,
  grade: r.grade,
  notes: r.notes,
  isActive: r.isActive,
  deletedAt: r.deletedAt,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

const getTeacherCohortIds = async (teacherId) => {
  const cohorts = await Cohort.find({ teacherId, deletedAt: null })
    .select("_id")
    .lean();
  return cohorts.map((c) => c._id);
};

const getTeacherEnrollmentIds = async (teacherId) => {
  const cohortIds = await getTeacherCohortIds(teacherId);
  const enrollments = await Enrollment.find({
    cohortId: { $in: cohortIds },
    deletedAt: null,
  })
    .select("_id")
    .lean();
  return enrollments.map((e) => e._id);
};

const ensureEnrollmentOwnership = async (enrollmentId, teacherId) => {
  const enrollment = await Enrollment.findOne({
    _id: enrollmentId,
    deletedAt: null,
  });
  if (!enrollment) throw new AppError("Enrollment not found", 404);

  const cohort = await Cohort.findOne({
    _id: enrollment.cohortId,
    teacherId,
    deletedAt: null,
  });
  if (!cohort) throw new AppError("Enrollment not yours", 403);

  return enrollment;
};

const ensureResultOwnership = async (resultId, teacherId) => {
  const result = await EnrollmentResult.findOne({
    _id: resultId,
    deletedAt: null,
  });
  if (!result) throw new AppError("Result not found", 404);
  await ensureEnrollmentOwnership(result.enrollmentId, teacherId);
  return result;
};

/* ============================================================
 * قائمة النتائج
 * ============================================================ */
export const listResults = async (
  teacherId,
  { cohortId, enrollmentId, isActive, page = 1, limit = 20 },
) => {
  let enrollmentIds;

  if (enrollmentId) {
    await ensureEnrollmentOwnership(enrollmentId, teacherId);
    enrollmentIds = [enrollmentId];
  } else if (cohortId) {
    const cohort = await Cohort.findOne({
      _id: cohortId,
      teacherId,
      deletedAt: null,
    });
    if (!cohort) throw new AppError("Cohort not found or not yours", 404);
    const enrollments = await Enrollment.find({ cohortId, deletedAt: null })
      .select("_id")
      .lean();
    enrollmentIds = enrollments.map((e) => e._id);
  } else {
    enrollmentIds = await getTeacherEnrollmentIds(teacherId);
  }

  const filter = { enrollmentId: { $in: enrollmentIds }, deletedAt: null };
  if (isActive !== undefined)
    filter.isActive = isActive === "true" || isActive === true;

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(200, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    EnrollmentResult.find(filter)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    EnrollmentResult.countDocuments(filter),
  ]);

  return {
    items: items.map(shape),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

/* ============================================================
 * كل النتائج — للسكرتيرة.
 * المدرس يستخدم `listResults` (مقيّد بدفعاته) والطالب يستخدم `/student/grades`.
 * ============================================================ */
export const listAllResults = async ({
  cohortId,
  enrollmentId,
  isActive,
} = {}) => {
  let enrollmentIds;

  if (enrollmentId) {
    enrollmentIds = [enrollmentId];
  } else {
    const filter = { deletedAt: null };
    if (cohortId) filter.cohortId = cohortId;
    const enrollments = await Enrollment.find(filter).select("_id").lean();
    enrollmentIds = enrollments.map((e) => e._id);
  }

  const filter = { enrollmentId: { $in: enrollmentIds }, deletedAt: null };
  if (isActive !== undefined)
    filter.isActive = isActive === "true" || isActive === true;

  const items = await EnrollmentResult.find(filter).sort("-createdAt").lean();

  return {
    items: items.map(shape),
    meta: { page: 1, limit: items.length, total: items.length, pages: 1 },
  };
};

/* ============================================================
 * إنشاء / تعديل / حذف
 * ============================================================ */
export const createResult = async (teacherId, data) => {
  await ensureEnrollmentOwnership(data.enrollmentId, teacherId);
  const result = await EnrollmentResult.create(data);
  return shape(result);
};

export const updateResult = async (teacherId, id, data) => {
  await ensureResultOwnership(id, teacherId);
  const result = await EnrollmentResult.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return shape(result);
};

export const deleteResult = async (teacherId, id) => {
  await ensureResultOwnership(id, teacherId);
  const result = await EnrollmentResult.findOneAndUpdate(
    { _id: id },
    { deletedAt: new Date() },
    { new: true },
  );
  return shape(result);
};

/* ============================================================
 * اعتماد كل نتائج دفعة (approve-all)
 * ============================================================ */
export const approveAllResults = async (teacherId, cohortId) => {
  const cohort = await Cohort.findOne({
    _id: cohortId,
    teacherId,
    deletedAt: null,
  });
  if (!cohort) throw new AppError("Cohort not found or not yours", 404);

  const enrollments = await Enrollment.find({ cohortId, deletedAt: null })
    .select("_id")
    .lean();
  const enrollmentIds = enrollments.map((e) => e._id);

  const result = await EnrollmentResult.updateMany(
    { enrollmentId: { $in: enrollmentIds }, isActive: false, deletedAt: null },
    { isActive: true },
  );

  return { approved: result.modifiedCount };
};
