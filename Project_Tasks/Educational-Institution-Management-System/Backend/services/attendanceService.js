import Attendance from "../models/attendanceModel.js";
import Session from "../models/sessionModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Cohort from "../models/cohortModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";

const shape = (a) => ({
  id: String(a._id),
  _id: a._id,
  sessionId: a.sessionId,
  enrollmentId: a.enrollmentId,
  status: a.status,
  createdAt: a.createdAt,
  updatedAt: a.updatedAt,
});

const ensureSessionOwnership = async (sessionId, teacherId) => {
  const session = await Session.findById(sessionId);
  if (!session) throw new AppError("Session not found", 404);

  const cohort = await Cohort.findOne({
    _id: session.cohortId,
    teacherId,
    deletedAt: null,
  });
  if (!cohort) throw new AppError("Session not yours", 403);
  return { session, cohort };
};

/* ============================================================
 * قائمة الحضور لجلسة
 * ============================================================ */
/**
 * كل سجلات الحضور — للسكرتيرة.
 * المدرس يستخدم `listAttendance` (مقيّد بجلساته) والطالب يستخدم `/student/attendance`.
 */
export const listAllAttendance = async ({
  cohortId,
  studentId,
  sessionId,
} = {}) => {
  const enrollmentFilter = { deletedAt: null };
  if (studentId) enrollmentFilter.studentId = studentId;
  if (cohortId) enrollmentFilter.cohortId = cohortId;

  const enrollments = await Enrollment.find(enrollmentFilter)
    .select("_id studentId")
    .lean();

  const enrollmentIds = enrollments.map((e) => e._id);
  const filter = { enrollmentId: { $in: enrollmentIds } };
  if (sessionId) filter.sessionId = sessionId;

  const items = await Attendance.find(filter).sort("-createdAt").lean();

  const studentIds = enrollments.map((e) => e.studentId);
  const students = await User.find({ _id: { $in: studentIds } })
    .select("fullName email")
    .lean();

  const studentMap = Object.fromEntries(
    students.map((s) => [String(s._id), s]),
  );

  return items.map((a) => {
    const enrollment = enrollments.find(
      (e) => String(e._id) === String(a.enrollmentId),
    );
    const student = enrollment
      ? studentMap[String(enrollment.studentId)]
      : null;
    return {
      ...shape(a),
      student: student
        ? {
            id: String(student._id),
            fullName: student.fullName,
            email: student.email,
          }
        : null,
    };
  });
};

export const listAttendance = async (teacherId, { sessionId }) => {
  if (!sessionId) throw new AppError("sessionId is required", 400);
  await ensureSessionOwnership(sessionId, teacherId);

  const items = await Attendance.find({ sessionId }).lean();
  const enrollmentIds = items.map((a) => a.enrollmentId);
  const enrollments = await Enrollment.find({
    _id: { $in: enrollmentIds },
  }).lean();
  const studentIds = enrollments.map((e) => e.studentId);
  const students = await User.find({ _id: { $in: studentIds } })
    .select("fullName email")
    .lean();

  const studentMap = Object.fromEntries(
    students.map((s) => [String(s._id), s]),
  );
  const enrollmentMap = Object.fromEntries(
    enrollments.map((e) => [String(e._id), e]),
  );

  return items.map((a) => {
    const enrollment = enrollmentMap[String(a.enrollmentId)];
    const student = enrollment
      ? studentMap[String(enrollment.studentId)]
      : null;
    return {
      ...shape(a),
      student: student
        ? {
            id: String(student._id),
            fullName: student.fullName,
            email: student.email,
          }
        : null,
    };
  });
};

/* ============================================================
 * Upsert الحضور (زر واحد)
 * ============================================================ */
export const upsertAttendance = async (
  teacherId,
  { sessionId, enrollmentId, status },
) => {
  await ensureSessionOwnership(sessionId, teacherId);

  const enrollment = await Enrollment.findOne({
    _id: enrollmentId,
    deletedAt: null,
  });
  if (!enrollment) throw new AppError("Enrollment not found", 404);

  // تأكد أن التسجيل يخص نفس الدفعة
  const session = await Session.findById(sessionId).select("cohortId").lean();
  if (String(enrollment.cohortId) !== String(session.cohortId))
    throw new AppError(
      "Enrollment does not belong to this session's cohort",
      400,
    );

  const attendance = await Attendance.findOneAndUpdate(
    { sessionId, enrollmentId },
    { sessionId, enrollmentId, status },
    { upsert: true, new: true, runValidators: true },
  );

  return shape(attendance);
};

/* ============================================================
 * ملخص الغياب (شريط "من غاب في آخر جلساتي")
 * ============================================================ */
export const getAttendanceSummary = async (teacherId, limit = 5) => {
  const cohorts = await Cohort.find({ teacherId, deletedAt: null })
    .select("_id")
    .lean();
  const cohortIds = cohorts.map((c) => c._id);

  const sessions = await Session.find({
    cohortId: { $in: cohortIds },
    status: "done",
  })
    .select("_id sessionDate")
    .lean();
  const sessionIds = sessions.map((s) => s._id);

  const enrollments = await Enrollment.find({
    cohortId: { $in: cohortIds },
    deletedAt: null,
  }).lean();
  const enrollmentIds = enrollments.map((e) => e._id);

  const absences = await Attendance.find({
    enrollmentId: { $in: enrollmentIds },
    sessionId: { $in: sessionIds },
    status: "absent",
  }).lean();

  // تجميع الغياب لكل تسجيل
  const absenceMap = {};
  for (const a of absences) {
    const key = String(a.enrollmentId);
    if (!absenceMap[key]) absenceMap[key] = { count: 0, lastDate: null };
    absenceMap[key].count++;

    const session = sessions.find((s) => String(s._id) === String(a.sessionId));
    if (session) {
      if (
        !absenceMap[key].lastDate ||
        session.sessionDate > absenceMap[key].lastDate
      )
        absenceMap[key].lastDate = session.sessionDate;
    }
  }

  const sorted = Object.entries(absenceMap)
    .map(([eid, data]) => {
      const enrollment = enrollments.find((e) => String(e._id) === eid);
      return {
        studentId: enrollment?.studentId ? String(enrollment.studentId) : null,
        enrollmentId: eid,
        absences: data.count,
        lastSessionDate: data.lastDate,
      };
    })
    .sort((a, b) => b.absences - a.absences)
    .slice(0, Number(limit) || 5);

  // جلب أسماء الطلاب
  const studentIds = sorted.map((s) => s.studentId).filter(Boolean);
  const students = await User.find({ _id: { $in: studentIds } })
    .select("fullName")
    .lean();
  const nameMap = Object.fromEntries(
    students.map((s) => [String(s._id), s.fullName]),
  );

  return sorted.map((s) => ({
    studentId: s.studentId,
    fullName: nameMap[s.studentId] || "",
    absences: s.absences,
    lastSessionDate: s.lastSessionDate,
  }));
};
