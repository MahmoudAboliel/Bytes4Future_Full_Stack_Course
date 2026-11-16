import User from "../models/userModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Cohort from "../models/cohortModel.js";
import Session from "../models/sessionModel.js";
import Attendance from "../models/attendanceModel.js";
import EnrollmentResult from "../models/enrollmentResultModel.js";
import StudentNote from "../models/studentNoteModel.js";
import Course from "../models/courseModel.js";
import Level from "../models/levelModel.js";
import AppError from "../utils/AppError.js";

const PRESENT = ["present", "late", "excused"];

/* ============================================================
 * helper: كل تسجيلات الطالب
 * ============================================================ */
const getStudentEnrollments = (studentId) =>
  Enrollment.find({ studentId, deletedAt: null }).lean();

/* ============================================================
 * helper: حساب متوسط الدرجات ونسبة الحضور
 * ============================================================ */
const computeMetrics = (results, attendances) => {
  const average = results.length
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 0;

  const total = attendances.length;
  const present = attendances.filter((a) => PRESENT.includes(a.status)).length;
  const attendance = total ? Math.round((present / total) * 100) : 0;

  return { average, attendance };
};

/* ============================================================
 * 1) الملف الشخصي
 * ============================================================ */
export const getProfile = async (studentId) => {
  const student = await User.findOne({
    _id: studentId,
    role: "student",
    deletedAt: null,
  }).lean();
  if (!student) throw new AppError("Student not found", 404);

  const enrollments = await getStudentEnrollments(studentId);
  const enrollmentIds = enrollments.map((e) => e._id);

  const [results, attendances] = await Promise.all([
    EnrollmentResult.find({
      enrollmentId: { $in: enrollmentIds },
      deletedAt: null,
    }).lean(),
    Attendance.find({ enrollmentId: { $in: enrollmentIds } }).lean(),
  ]);

  const { average, attendance } = computeMetrics(results, attendances);

  return {
    id: String(student._id),
    fullName: student.fullName,
    email: student.email,
    phone: student.phone,
    study: student.study || "",
    birthDate: student.birthDate,
    cohorts: enrollments.length,
    average,
    attendance,
  };
};

/* ============================================================
 * 2) مجموعاتي
 * ============================================================ */
export const listMyCohorts = async (studentId) => {
  const enrollments = await getStudentEnrollments(studentId);
  if (!enrollments.length) return [];

  const cohortIds = enrollments.map((e) => e.cohortId);
  const enrollmentIds = enrollments.map((e) => e._id);

  const [cohorts, sessions, results, attendances] = await Promise.all([
    Cohort.find({ _id: { $in: cohortIds }, deletedAt: null })
      .populate("levelId", "title courseId")
      .populate("teacherId", "fullName")
      .lean(),
    Session.find({ cohortId: { $in: cohortIds } }).lean(),
    EnrollmentResult.find({
      enrollmentId: { $in: enrollmentIds },
      deletedAt: null,
    }).lean(),
    Attendance.find({ enrollmentId: { $in: enrollmentIds } }).lean(),
  ]);

  const cohortMap = Object.fromEntries(cohorts.map((c) => [String(c._id), c]));
  const now = new Date();

  // أسماء الدورات والمستويات لعرضها في الواجهة
  const levelIds = [
    ...new Set(cohorts.map((c) => String(c.levelId?._id ?? c.levelId))),
  ].filter((id) => id && id !== "undefined");
  const levels = await Level.find({ _id: { $in: levelIds } }).lean();
  const courseIds = [
    ...new Set(levels.map((l) => String(l.courseId))),
  ].filter((id) => id && id !== "undefined");
  const courses = await Course.find({ _id: { $in: courseIds } }).lean();

  const levelMap = Object.fromEntries(levels.map((l) => [String(l._id), l]));
  const courseMap = Object.fromEntries(
    courses.map((c) => [String(c._id), c]),
  );

  return enrollments
    .filter((e) => cohortMap[String(e.cohortId)]) // تجاهل دفعات محذوفة
    .map((e) => {
      const cohort = cohortMap[String(e.cohortId)];
      const levelId = String(cohort.levelId?._id ?? cohort.levelId);
      const level = levelMap[levelId];
      const course = level ? courseMap[String(level.courseId)] : null;
      const cSessions = sessions.filter(
        (s) => String(s.cohortId) === String(e.cohortId),
      );
      const doneSessions = cSessions.filter((s) => s.status === "done");

      const nextSession = cSessions
        .filter(
          (s) => s.status === "scheduled" && new Date(s.sessionDate) >= now,
        )
        .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate))[0];

      const eResults = results.filter(
        (r) => String(r.enrollmentId) === String(e._id),
      );
      const eAtt = attendances.filter(
        (a) => String(a.enrollmentId) === String(e._id),
      );
      const { average, attendance } = computeMetrics(eResults, eAtt);

      return {
        enrollmentId: String(e._id),
        cohortId: String(e.cohortId),
        code: cohort.code,
        status: cohort.status,
        levelId,
        levelTitle: cohort.levelId?.title || level?.title || "",
        courseId: level ? String(level.courseId) : "",
        courseName: course?.name || "",
        teacherId: String(cohort.teacherId?._id ?? cohort.teacherId),
        teacherName: cohort.teacherId?.fullName || "",
        sessionsDone: doneSessions.length,
        sessionsTotal: cSessions.length,
        average,
        attendance,
        nextSession: nextSession
          ? {
              id: String(nextSession._id),
              sessionNumber: nextSession.sessionNumber,
              sessionDate: nextSession.sessionDate,
              topic: nextSession.topic,
            }
          : null,
      };
    });
};

/**
 * كتالوج الطالب: الدورات المعتمدة ومستوياتها (لاستكشاف الدورات).
 */
export const listMyCatalog = async () => {
  const courses = await Course.find({
    isActive: true,
    deletedAt: null,
  })
    .sort("name")
    .lean();

  const courseIds = courses.map((c) => String(c._id));
  const levels = await Level.find({
    courseId: { $in: courseIds },
    deletedAt: null,
  })
    .sort("orderNumber")
    .lean();

  return {
    courses: courses.map((c) => ({
      id: String(c._id),
      _id: c._id,
      name: c.name,
      description: c.description,
      isActive: c.isActive,
      createdAt: c.createdAt,
    })),
    levels: levels.map((l) => ({
      id: String(l._id),
      _id: l._id,
      title: l.title,
      courseId: String(l.courseId),
      orderNumber: l.orderNumber,
      isActive: l.isActive,
    })),
  };
};

/**
 * تحديث ملف الطالب الشخصي (لنفسه فقط).
 */
export const updateProfile = async (studentId, data) => {
  const student = await User.findOneAndUpdate(
    { _id: studentId, role: "student", deletedAt: null },
    data,
    { new: true, runValidators: true },
  ).lean();

  if (!student) throw new AppError("Student not found", 404);

  return {
    id: String(student._id),
    fullName: student.fullName,
    email: student.email,
    phone: student.phone,
    study: student.study || "",
    birthDate: student.birthDate,
    role: student.role,
    isActive: student.isActive,
    createdAt: student.createdAt,
  };
};

/* ============================================================
 * 3) علاماتي
 * ============================================================ */
export const listMyGrades = async (studentId) => {
  const enrollments = await getStudentEnrollments(studentId);
  if (!enrollments.length) return [];

  const enrollmentIds = enrollments.map((e) => e._id);
  const cohortIds = enrollments.map((e) => e.cohortId);

  const [cohorts, results] = await Promise.all([
    Cohort.find({ _id: { $in: cohortIds } })
      .select("code")
      .lean(),
    EnrollmentResult.find({
      enrollmentId: { $in: enrollmentIds },
      deletedAt: null,
    })
      .sort("-createdAt")
      .lean(),
  ]);

  const cohortMap = Object.fromEntries(cohorts.map((c) => [String(c._id), c]));
  const enrollmentMap = Object.fromEntries(
    enrollments.map((e) => [String(e._id), e]),
  );

  return results.map((r) => {
    const enrollment = enrollmentMap[String(r.enrollmentId)];
    const cohort = enrollment ? cohortMap[String(enrollment.cohortId)] : null;
    return {
      id: String(r._id),
      enrollmentId: String(r.enrollmentId),
      cohortCode: cohort?.code || "",
      kind: r.kind || "",
      score: r.score,
      maxScore: r.maxScore,
      grade: r.grade,
      notes: r.notes || "",
      date: r.createdAt,
    };
  });
};

/* ============================================================
 * 4) حضوري
 * ============================================================ */
export const listMyAttendance = async (studentId) => {
  const enrollments = await getStudentEnrollments(studentId);
  if (!enrollments.length) return [];

  const enrollmentIds = enrollments.map((e) => e._id);
  const cohortIds = enrollments.map((e) => e.cohortId);

  const attendances = await Attendance.find({
    enrollmentId: { $in: enrollmentIds },
  })
    .sort("-createdAt")
    .lean();

  const sessionIds = attendances.map((a) => a.sessionId);

  const [cohorts, sessions] = await Promise.all([
    Cohort.find({ _id: { $in: cohortIds } })
      .select("code")
      .lean(),
    Session.find({ _id: { $in: sessionIds } }).lean(),
  ]);

  const cohortMap = Object.fromEntries(cohorts.map((c) => [String(c._id), c]));
  const enrollmentMap = Object.fromEntries(
    enrollments.map((e) => [String(e._id), e]),
  );
  const sessionMap = Object.fromEntries(
    sessions.map((s) => [String(s._id), s]),
  );

  return attendances.map((a) => {
    const enrollment = enrollmentMap[String(a.enrollmentId)];
    const cohort = enrollment ? cohortMap[String(enrollment.cohortId)] : null;
    const session = sessionMap[String(a.sessionId)];

    return {
      sessionId: String(a.sessionId),
      cohortCode: cohort?.code || "",
      sessionNumber: session?.sessionNumber || 0,
      sessionDate: session?.sessionDate || null,
      topic: session?.topic || "",
      status: a.status,
    };
  });
};

/* ============================================================
 * 5) ملاحظاتي (visibility = student فقط)
 * ============================================================ */
export const listMyNotes = async (studentId) => {
  const notes = await StudentNote.find({
    studentId,
    visibility: "student",
    deletedAt: null,
  })
    .populate("teacherId", "fullName")
    .sort("-createdAt")
    .lean();

  return notes.map((n) => ({
    id: String(n._id),
    note: n.note,
    teacherName: n.teacherId?.fullName || "",
    visibility: n.visibility,
    createdAt: n.createdAt,
  }));
};
