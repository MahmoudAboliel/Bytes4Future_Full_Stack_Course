import Enrollment from "../models/enrollmentModel.js";
import Cohort from "../models/cohortModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";

const shape = (e) => ({
  id: String(e._id),
  _id: e._id,
  studentId: e.studentId?._id ? String(e.studentId._id) : e.studentId,
  student: e.studentId?.fullName ? e.studentId : null,
  cohortId: e.cohortId?._id ? String(e.cohortId._id) : e.cohortId,
  status: e.status,
  enrolledAt: e.enrolledAt,
  isActive: e.isActive,
  createdAt: e.createdAt,
  updatedAt: e.updatedAt,
});

/**
 * عدد التسجيلات النشطة في الدفعة (لحارس السعة)
 */
const countActiveEnrollments = (cohortId) =>
  Enrollment.countDocuments({
    cohortId,
    status: "active",
    deletedAt: null,
  });

/**
 * إنشاء تسجيل جديد (مع حارس السعة ومنع التكرار)
 */
export const createEnrollment = async ({
  studentId,
  cohortId,
  status,
  enrolledAt,
}) => {
  // 1) التحقق من الطالب
  const student = await User.findOne({
    _id: studentId,
    role: "student",
    deletedAt: null,
  });
  if (!student) throw new AppError("Student not found", 404);

  // 2) التحقق من الدفعة
  const cohort = await Cohort.findOne({ _id: cohortId, deletedAt: null });
  if (!cohort) throw new AppError("Cohort not found", 404);
  if (cohort.status === "cancelled")
    throw new AppError("Cannot enroll in a cancelled cohort", 409);

  // 3) منع التكرار (تسجيل نشط لنفس الطالب في نفس الدفعة)
  const existing = await Enrollment.findOne({
    studentId,
    cohortId,
    status: "active",
    deletedAt: null,
  });
  if (existing)
    throw new AppError("Student already enrolled in this cohort", 409);

  // 4) حارس السعة
  if (cohort.capacity) {
    const active = await countActiveEnrollments(cohortId);
    if (active >= cohort.capacity) throw new AppError("لا توجد مقاعد.", 409);
  }

  // 5) الإنشاء
  const enrollment = await Enrollment.create({
    studentId,
    cohortId,
    status: status || "active",
    enrolledAt: enrolledAt || new Date(),
    isActive: true,
  });

  return shape(
    await enrollment.populate("studentId", "fullName email phone study"),
  );
};

/**
 * سحب التسجيل أو إعادة تفعيله
 */
export const patchEnrollment = async (id, { status }) => {
  const enrollment = await Enrollment.findOne({ _id: id, deletedAt: null });
  if (!enrollment) throw new AppError("Enrollment not found", 404);

  // عند إعادة التفعيل، تحقق من السعة مجددًا
  if (status === "active" && enrollment.status !== "active") {
    const cohort = await Cohort.findById(enrollment.cohortId);
    if (cohort?.capacity) {
      const active = await countActiveEnrollments(enrollment.cohortId);
      // نستثني هذا التسجيل إن كان نشطًا سابقًا — لكنه ليس كذلك الآن
      if (active >= cohort.capacity) throw new AppError("لا توجد مقاعد.", 409);
    }
  }

  enrollment.status = status;
  await enrollment.save();

  return shape(
    await enrollment.populate("studentId", "fullName email phone study"),
  );
};

/**
 * كل التسجيلات — للسكرتيرة (للعرض في صفحة الطلاب وصفحة الدفعات).
 */
export const listEnrollments = async ({ cohortId, studentId, status } = {}) => {
  const filter = { deletedAt: null };
  if (cohortId) filter.cohortId = cohortId;
  if (studentId) filter.studentId = studentId;
  if (status) filter.status = status;

  const items = await Enrollment.find(filter)
    .populate("studentId", "fullName email phone study")
    .sort("-createdAt")
    .lean();

  return items.map((e) => ({
    id: String(e._id),
    _id: e._id,
    studentId: e.studentId?._id ? String(e.studentId._id) : e.studentId,
    student: e.studentId?.fullName ? e.studentId : null,
    cohortId: String(e.cohortId),
    status: e.status,
    enrolledAt: e.enrolledAt,
    isActive: e.isActive,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  }));
};

/**
 * قائمة الطلاب غير المسجّلين في دفعة معيّنة
 * GET /api/secretary/students?notIn=:cohortId
 */
export const listStudentsNotInCohort = async (cohortId) => {
  const cohort = await Cohort.findOne({ _id: cohortId, deletedAt: null });
  if (!cohort) throw new AppError("Cohort not found", 404);

  // كل تسجيلات هذه الدفعة (بما فيها المسحوبة — لأن المسحوب قد يُعاد تفعيله)
  const enrolledIds = await Enrollment.distinct("studentId", {
    cohortId,
    deletedAt: null,
    status: { $ne: "withdrawn" }, // نستثني فقط النشط والمكتمل
  });

  const students = await User.find({
    role: "student",
    deletedAt: null,
    _id: { $nin: enrolledIds },
  })
    .select("_id fullName email phone study isActive")
    .sort("fullName")
    .lean();

  return students.map((s) => ({
    id: String(s._id),
    _id: s._id,
    fullName: s.fullName,
    email: s.email,
    phone: s.phone,
    study: s.study,
    isActive: s.isActive,
  }));
};
