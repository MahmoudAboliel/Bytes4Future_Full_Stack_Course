import User from "../models/userModel.js";
import Cohort from "../models/cohortModel.js";
import Session from "../models/sessionModel.js";
import Enrollment from "../models/enrollmentModel.js";
import EnrollmentResult from "../models/enrollmentResultModel.js";
import Attendance from "../models/attendanceModel.js";
import AppError from "../utils/AppError.js";

const PRESENT = ["present", "late", "excused"];

// ---------- Dashboard ----------
export const getStats = async () => {
  const [
    students,
    activeStudents,
    teachers,
    cohorts,
    activeCohorts,
    sessions,
    pendingUsers,
    pendingCourses,
    pendingLevels,
    pendingCohorts,
    pendingResults,
    avgAgg,
    attAgg,
  ] = await Promise.all([
    User.countDocuments({ role: "student", deletedAt: null }),
    User.countDocuments({ role: "student", isActive: true, deletedAt: null }),
    User.countDocuments({ role: "teacher", deletedAt: null }),
    Cohort.countDocuments({ deletedAt: null }),
    Cohort.countDocuments({ status: "active", deletedAt: null }),
    Session.countDocuments({}),
    User.countDocuments({ isActive: false, deletedAt: null }),
    (await import("../models/courseModel.js")).default.countDocuments({
      isActive: false,
      deletedAt: null,
    }),
    (await import("../models/levelModel.js")).default.countDocuments({
      isActive: false,
      deletedAt: null,
    }),
    Cohort.countDocuments({ isActive: false, deletedAt: null }),
    EnrollmentResult.countDocuments({ isActive: false, deletedAt: null }),
    EnrollmentResult.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: null, avg: { $avg: "$score" } } },
    ]),
    Attendance.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const total = attAgg.reduce((s, r) => s + r.count, 0);
  const present = attAgg
    .filter((r) => PRESENT.includes(r._id))
    .reduce((s, r) => s + r.count, 0);
  const attendanceRate = total ? Math.round((present / total) * 100) : 0;

  return {
    students,
    activeStudents,
    teachers,
    cohorts,
    activeCohorts,
    sessions,
    pendingApprovals:
      pendingUsers +
      pendingCourses +
      pendingLevels +
      pendingCohorts +
      pendingResults,
    averageScore: Math.round(avgAgg[0]?.avg || 0),
    attendanceRate,
  };
};

export const getActivity = async (limit = 5) => {
  const sessions = await Session.find({})
    .sort("-sessionDate")
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

// ---------- Reports ----------
export const getOverview = async ({ from, to } = {}) => {
  const dateMatch = {};
  if (from) dateMatch.$gte = new Date(from);
  if (to) dateMatch.$lte = new Date(to);

  const [
    students,
    activeStudents,
    cohorts,
    activeCohorts,
    sessions,
    results,
    avgAgg,
    attAgg,
  ] = await Promise.all([
    User.countDocuments({ role: "student", deletedAt: null }),
    User.countDocuments({ role: "student", isActive: true, deletedAt: null }),
    Cohort.countDocuments({ deletedAt: null }),
    Cohort.countDocuments({ status: "active", deletedAt: null }),
    Session.countDocuments(
      Object.keys(dateMatch).length ? { sessionDate: dateMatch } : {},
    ),
    EnrollmentResult.countDocuments({ deletedAt: null }),
    EnrollmentResult.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: null, avg: { $avg: "$score" } } },
    ]),
    Attendance.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const total = attAgg.reduce((s, r) => s + r.count, 0);
  const present = attAgg
    .filter((r) => PRESENT.includes(r._id))
    .reduce((s, r) => s + r.count, 0);
  const attendanceRate = total ? Math.round((present / total) * 100) : 0;

  // Top cohorts
  const [cohortAverages, cohortAttendances, allCohorts] = await Promise.all([
    EnrollmentResult.aggregate([
      { $match: { deletedAt: null } },
      {
        $lookup: {
          from: "enrollments",
          localField: "enrollmentId",
          foreignField: "_id",
          as: "e",
        },
      },
      { $unwind: "$e" },
      { $group: { _id: "$e.cohortId", average: { $avg: "$score" } } },
    ]),
    Attendance.aggregate([
      {
        $lookup: {
          from: "enrollments",
          localField: "enrollmentId",
          foreignField: "_id",
          as: "e",
        },
      },
      { $unwind: "$e" },
      {
        $group: {
          _id: "$e.cohortId",
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $in: ["$status", PRESENT] }, 1, 0] } },
        },
      },
    ]),
    Cohort.find({ deletedAt: null }).select("code").lean(),
  ]);

  const avgMap = Object.fromEntries(
    cohortAverages.map((c) => [String(c._id), c.average]),
  );
  const attMap = Object.fromEntries(
    cohortAttendances.map((c) => [
      String(c._id),
      c.total ? Math.round((c.present / c.total) * 100) : 0,
    ]),
  );

  const topCohorts = allCohorts
    .map((c) => ({
      cohortId: String(c._id),
      code: c.code,
      average: Math.round(avgMap[String(c._id)] || 0),
      attendance: attMap[String(c._id)] || 0,
    }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);

  return {
    students,
    activeStudents,
    cohorts,
    activeCohorts,
    sessions,
    results,
    averageScore: Math.round(avgAgg[0]?.avg || 0),
    attendanceRate,
    topCohorts,
  };
};

export const getCohortReport = async (id) => {
  const cohort = await Cohort.findOne({ _id: id, deletedAt: null }).lean();
  if (!cohort) throw new AppError("Cohort not found", 404);

  const enrollments = await Enrollment.find({
    cohortId: id,
    deletedAt: null,
  }).lean();
  const enrollmentIds = enrollments.map((e) => e._id);

  const [results, attendances, students, sessionsCount] = await Promise.all([
    EnrollmentResult.find({
      enrollmentId: { $in: enrollmentIds },
      deletedAt: null,
    }).lean(),
    Attendance.find({ enrollmentId: { $in: enrollmentIds } }).lean(),
    User.find({ _id: { $in: enrollments.map((e) => e.studentId) } })
      .select("fullName")
      .lean(),
    Session.countDocuments({ cohortId: id }),
  ]);

  const nameMap = Object.fromEntries(
    students.map((s) => [String(s._id), s.fullName]),
  );

  const studentRows = enrollments.map((e) => {
    const eRes = results.filter(
      (r) => String(r.enrollmentId) === String(e._id),
    );
    const eAtt = attendances.filter(
      (a) => String(a.enrollmentId) === String(e._id),
    );

    const avg = eRes.length
      ? Math.round(eRes.reduce((s, r) => s + r.score, 0) / eRes.length)
      : 0;

    const present = eAtt.filter((a) => PRESENT.includes(a.status)).length;
    const rate = eAtt.length ? Math.round((present / eAtt.length) * 100) : 0;

    return {
      enrollmentId: String(e._id),
      fullName: nameMap[String(e.studentId)] || "",
      average: avg,
      attendance: rate,
    };
  });

  const avg = studentRows.length
    ? Math.round(
        studentRows.reduce((s, r) => s + r.average, 0) / studentRows.length,
      )
    : 0;
  const att = studentRows.length
    ? Math.round(
        studentRows.reduce((s, r) => s + r.attendance, 0) / studentRows.length,
      )
    : 0;

  return {
    cohortId: String(cohort._id),
    code: cohort.code,
    studentsCount: enrollments.length,
    sessions: sessionsCount,
    averageScore: avg,
    attendanceRate: att,
    students: studentRows,
  };
};

export const exportReport = async ({ from, to, format = "json" }) => {
  const overview = await getOverview({ from, to });

  if (format === "csv") {
    const rows = [
      ["metric", "value"],
      ["students", overview.students],
      ["activeStudents", overview.activeStudents],
      ["cohorts", overview.cohorts],
      ["activeCohorts", overview.activeCohorts],
      ["sessions", overview.sessions],
      ["results", overview.results],
      ["averageScore", overview.averageScore],
      ["attendanceRate", overview.attendanceRate],
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    return { csv };
  }

  return { json: overview };
};
