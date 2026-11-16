import User from "../models/userModel.js";
import Cohort from "../models/cohortModel.js";
import Session from "../models/sessionModel.js";
import Enrollment from "../models/enrollmentModel.js";
import EnrollmentResult from "../models/enrollmentResultModel.js";
import Attendance from "../models/attendanceModel.js";
import Course from "../models/courseModel.js";
import Level from "../models/levelModel.js";
import AppError from "../utils/AppError.js";

const PRESENT = ["present", "late", "excused"];

/* ---------- helper: دفعات المدرس ---------- */
const getTeacherCohortIds = async (teacherId) => {
  const cohorts = await Cohort.find({ teacherId, deletedAt: null })
    .select("_id")
    .lean();
  return cohorts.map((c) => c._id);
};

/* ============================================================
 * Dashboard
 * ============================================================ */
export const getTeacherStats = async (teacherId) => {
  const cohortIds = await getTeacherCohortIds(teacherId);

  const enrollments = await Enrollment.find({
    cohortId: { $in: cohortIds },
    deletedAt: null,
  }).lean();
  const enrollmentIds = enrollments.map((e) => e._id);
  const uniqueStudentIds = [
    ...new Set(enrollments.map((e) => String(e.studentId))),
  ];

  const now = new Date();
  const [upcomingSessions, results, attendances] = await Promise.all([
    Session.countDocuments({
      cohortId: { $in: cohortIds },
      status: "scheduled",
      sessionDate: { $gte: now },
    }),
    EnrollmentResult.find({
      enrollmentId: { $in: enrollmentIds },
      deletedAt: null,
    }).lean(),
    Attendance.find({ enrollmentId: { $in: enrollmentIds } }).lean(),
  ]);

  const pendingResults = results.filter((r) => !r.isActive).length;
  const averageScore = results.length
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 0;

  const totalAtt = attendances.length;
  const presentAtt = attendances.filter((a) =>
    PRESENT.includes(a.status),
  ).length;
  const averageAttendance = totalAtt
    ? Math.round((presentAtt / totalAtt) * 100)
    : 0;

  return {
    cohorts: cohortIds.length,
    students: uniqueStudentIds.length,
    upcomingSessions,
    averageAttendance,
    pendingResults,
    averageScore,
  };
};

/* ============================================================
 * مجموعات المدرس
 * ============================================================ */
export const listTeacherCohorts = async (teacherId) => {
  const cohorts = await Cohort.find({ teacherId, deletedAt: null })
    .populate("levelId", "title")
    .lean();

  const cohortIds = cohorts.map((c) => c._id);
  const [enrollments, sessions, results, attendances] = await Promise.all([
    Enrollment.find({ cohortId: { $in: cohortIds }, deletedAt: null }).lean(),
    Session.find({ cohortId: { $in: cohortIds } }).lean(),
    (async () => {
      const eIds = await Enrollment.distinct("_id", {
        cohortId: { $in: cohortIds },
        deletedAt: null,
      });
      return EnrollmentResult.find({
        enrollmentId: { $in: eIds },
        deletedAt: null,
      }).lean();
    })(),
    (async () => {
      const eIds = await Enrollment.distinct("_id", {
        cohortId: { $in: cohortIds },
        deletedAt: null,
      });
      return Attendance.find({ enrollmentId: { $in: eIds } }).lean();
    })(),
  ]);

  return cohorts.map((c) => {
    const cEnrollments = enrollments.filter(
      (e) => String(e.cohortId) === String(c._id),
    );
    const cEnrollmentIds = cEnrollments.map((e) => String(e._id));
    const cSessions = sessions.filter(
      (s) => String(s.cohortId) === String(c._id),
    );
    const cResults = results.filter((r) =>
      cEnrollmentIds.includes(String(r.enrollmentId)),
    );
    const cAttendances = attendances.filter((a) =>
      cEnrollmentIds.includes(String(a.enrollmentId)),
    );

    const avg = cResults.length
      ? Math.round(cResults.reduce((s, r) => s + r.score, 0) / cResults.length)
      : 0;
    const totalAtt = cAttendances.length;
    const presentAtt = cAttendances.filter((a) =>
      PRESENT.includes(a.status),
    ).length;
    const rate = totalAtt ? Math.round((presentAtt / totalAtt) * 100) : 0;

    return {
      id: String(c._id),
      _id: c._id,
      code: c.code,
      levelId: c.levelId?._id ? String(c.levelId._id) : c.levelId,
      levelTitle: c.levelId?.title || "",
      teacherId: String(c.teacherId),
      status: c.status,
      startDate: c.startDate,
      endDate: c.endDate,
      capacity: c.capacity,
      isActive: c.isActive,
      deletedAt: c.deletedAt,
      students: cEnrollments.length,
      sessions: cSessions.length,
      completedSessions: cSessions.filter((s) => s.status === "done").length,
      averageScore: avg,
      attendanceRate: rate,
    };
  });
};

/**
 * كتالوج المدرس: الدورات والمستويات المرتبطة بدفعاته فقط،
 * حتى يستطيع عرض اسم الدورة في الواجهة.
 */
export const listTeacherCatalog = async (teacherId) => {
  const cohortIds = await getTeacherCohortIds(teacherId);

  const cohorts = await Cohort.find({ _id: { $in: cohortIds } })
    .select("levelId")
    .lean();

  const levelIds = [
    ...new Set(cohorts.map((c) => String(c.levelId))),
  ].filter((id) => id && id !== "undefined");

  const levels = await Level.find({ _id: { $in: levelIds }, deletedAt: null })
    .sort("orderNumber")
    .lean();

  const courseIds = [
    ...new Set(levels.map((l) => String(l.courseId))),
  ].filter((id) => id && id !== "undefined");

  const courses = await Course.find({ _id: { $in: courseIds }, deletedAt: null })
    .sort("name")
    .lean();

  return {
    courses: courses.map((c) => ({
      id: String(c._id),
      _id: c._id,
      name: c.name,
      description: c.description,
      isActive: c.isActive,
      deletedAt: c.deletedAt,
      createdAt: c.createdAt,
    })),
    levels: levels.map((l) => ({
      id: String(l._id),
      _id: l._id,
      title: l.title,
      courseId: String(l.courseId),
      orderNumber: l.orderNumber,
      isActive: l.isActive,
      deletedAt: l.deletedAt,
    })),
  };
};

/* ============================================================
 * الجلسات القادمة
 * ============================================================ */
export const listUpcomingSessions = async (teacherId, limit = 5) => {
  const cohortIds = await getTeacherCohortIds(teacherId);

  const sessions = await Session.find({
    cohortId: { $in: cohortIds },
    status: "scheduled",
    sessionDate: { $gte: new Date() },
  })
    .sort("sessionDate")
    .limit(Number(limit) || 5)
    .lean();

  return sessions.map((s) => ({
    id: String(s._id),
    _id: s._id,
    cohortId: s.cohortId,
    sessionNumber: s.sessionNumber,
    sessionDate: s.sessionDate,
    topic: s.topic,
    status: s.status,
  }));
};

/* ============================================================
 * قائمة طلاب المدرس
 * ============================================================ */
export const listTeacherStudents = async (teacherId, { cohortId }) => {
  let cohortIds;
  if (cohortId) {
    const cohort = await Cohort.findOne({
      _id: cohortId,
      teacherId,
      deletedAt: null,
    });
    if (!cohort) throw new AppError("Cohort not found or not yours", 404);
    cohortIds = [cohort._id];
  } else {
    cohortIds = await getTeacherCohortIds(teacherId);
  }

  const enrollments = await Enrollment.find({
    cohortId: { $in: cohortIds },
    deletedAt: null,
  }).lean();

  const enrollmentIds = enrollments.map((e) => e._id);
  const studentIds = enrollments.map((e) => e.studentId);

  const [students, results, attendances] = await Promise.all([
    User.find({ _id: { $in: studentIds } })
      .select("fullName email study")
      .lean(),
    EnrollmentResult.find({
      enrollmentId: { $in: enrollmentIds },
      deletedAt: null,
    }).lean(),
    Attendance.find({ enrollmentId: { $in: enrollmentIds } }).lean(),
  ]);

  const studentMap = Object.fromEntries(
    students.map((s) => [String(s._id), s]),
  );

  return enrollments.map((e) => {
    const student = studentMap[String(e.studentId)];
    const eResults = results.filter(
      (r) => String(r.enrollmentId) === String(e._id),
    );
    const eAtt = attendances.filter(
      (a) => String(a.enrollmentId) === String(e._id),
    );

    const avg = eResults.length
      ? Math.round(eResults.reduce((s, r) => s + r.score, 0) / eResults.length)
      : 0;
    const totalAtt = eAtt.length;
    const presentAtt = eAtt.filter((a) => PRESENT.includes(a.status)).length;
    const rate = totalAtt ? Math.round((presentAtt / totalAtt) * 100) : 0;

    return {
      enrollmentId: String(e._id),
      id: String(e._id),
      studentId: String(e.studentId),
      cohortId: String(e.cohortId),
      status: e.status,
      enrolledAt: e.enrolledAt,
      fullName: student?.fullName || "",
      email: student?.email || "",
      study: student?.study || "",
      average: avg,
      attendance: rate,
    };
  });
};
