/**
 * Selectors / formatting helpers.
 *
 * Field names follow the Mongoose schema models in Backend/models:
 *   Course:   name, description, isActive, deletedAt
 *   Level:    title, courseId, orderNumber, isActive, deletedAt
 *   Cohort:   code, levelId, teacherId, startDate, endDate, capacity, status
 *   Session:  cohortId, sessionNumber, sessionDate, topic, status (scheduled|done|cancelled)
 *   Enrollment: studentId, cohortId, status, enrolledAt
 *   EnrollmentResult: enrollmentId, score, maxScore, grade, notes, isActive
 *   Attendance: sessionId, enrollmentId, status (present|absent|late|excused)
 *   StudentNote: studentId, teacherId, note, visibility (teacherOnly|admin|student)
 *   User: fullName, email, role, phone, isActive, birthDate, study, specialization, bio
 */

/* ----------------------------- generic lookups ---------------------------- */

export const byId = (list = [], id) =>
  id == null ? undefined : list.find((item) => item.id === id);

/** Records not soft-deleted. */
export const alive = (record) => record && !record.deletedAt;

export const usersByRole = (users = [], role) =>
  users.filter((user) => alive(user) && user.role === role);

export const userByName = (users = [], id) => byId(users, id);

/* ----------------------------- relations ----------------------------- */

export const levelsByCourse = (levels = [], courseId) =>
  levels
    .filter((level) => alive(level) && level.courseId === courseId)
    .sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));

export const cohortsByLevel = (cohorts = [], levelId) =>
  cohorts.filter((cohort) => alive(cohort) && cohort.levelId === levelId);

export const cohortsByTeacher = (cohorts = [], teacherUserId) =>
  cohorts.filter(
    (cohort) => alive(cohort) && cohort.teacherId === teacherUserId,
  );

export const sessionsByCohort = (sessions = [], cohortId) =>
  sessions
    .filter((session) => alive(session) && session.cohortId === cohortId)
    .sort((a, b) =>
      String(a.sessionDate ?? "").localeCompare(String(b.sessionDate ?? "")),
    );

export const enrollmentsByCohort = (enrollments = [], cohortId) =>
  enrollments.filter(
    (enrollment) =>
      alive(enrollment) &&
      enrollment.cohortId === cohortId &&
      enrollment.status !== "withdrawn",
  );

export const enrollmentsByStudent = (enrollments = [], userId) =>
  enrollments.filter(
    (enrollment) => alive(enrollment) && enrollment.studentId === userId,
  );

export const attendanceBySession = (attendance = [], sessionId) =>
  attendance.filter((record) => record.sessionId === sessionId);

export const resultByEnrollment = (results = [], enrollmentId) =>
  results.find((record) => record.enrollmentId === enrollmentId);

export const levelForCohort = (levels = [], cohort) =>
  cohort ? byId(levels, cohort.levelId) : undefined;

export const courseForCohort = (courses = [], levels = [], cohort) => {
  const level = levelForCohort(levels, cohort);
  return level ? byId(courses, level.courseId) : undefined;
};

export const cohortEnrollmentCount = (enrollments = [], cohortId) =>
  enrollmentsByCohort(enrollments, cohortId).length;

export const attendanceForStudent = (
  attendance = [],
  enrollments = [],
  userId,
) => {
  const ids = new Set(enrollmentsByStudent(enrollments, userId).map((e) => e.id));
  return attendance.filter((record) => ids.has(record.enrollmentId));
};

export const resultsForStudent = (results = [], enrollments = [], userId) => {
  const ids = new Set(enrollmentsByStudent(enrollments, userId).map((e) => e.id));
  return results.filter(
    (record) => ids.has(record.enrollmentId) && record.isActive !== false,
  );
};

/* ----------------------------- notes visibility ---------------------------- */

export const canSeeNote = (note, role, viewerUserId) => {
  if (!note) return false;
  if (role === "admin") return true;
  if (role === "secretary") return note.visibility === "admin";
  if (role === "teacher")
    return (
      note.teacherId === viewerUserId ||
      note.visibility === "teacherOnly" ||
      note.visibility === "student"
    );
  if (role === "student")
    return note.visibility === "student" && note.studentId === viewerUserId;
  return false;
};

/* ----------------------------- grading ---------------------------- */

export const percentage = (score, max) =>
  Number(max) > 0 ? (Math.round((Number(score) / Number(max)) * 1000) / 10) : 0;

export const gradeFromPct = (pct) => {
  if (pct >= 90) return "ممتاز";
  if (pct >= 80) return "جيد جداً";
  if (pct >= 70) return "جيد";
  if (pct >= 60) return "مقبول";
  return "غير مجتاز";
};

/* ----------------------------- labels ---------------------------- */

export const roleLabel = {
  admin: "مدير",
  secretary: "سكرتير",
  teacher: "مدرب",
  student: "طالب",
};

export const visibilityLabel = {
  teacherOnly: "خاص بالمدرب",
  admin: "للإدارة",
  student: "مرئي للطالب",
};

export const accountStatusLabel = (isActive) =>
  isActive ? "نشط" : "معطّل";

export const approvalLabel = (record) => {
  if (record?.deletedAt) return "مرفوض";
  if (record?.isActive) return "معتمد";
  return "قيد المراجعة";
};

export const cohortStatusLabel = {
  planned: "مخططة",
  active: "نشطة",
  completed: "منتهية",
  cancelled: "ملغاة",
};

export const sessionStatusLabel = {
  scheduled: "مجدول",
  done: "منتهية",
  cancelled: "ملغاة",
};

export const attendanceStatusLabel = {
  present: "حاضر",
  absent: "غائب",
  late: "متأخر",
  excused: "بعذر",
};

export const enrollmentStatusLabel = {
  active: "نشط",
  withdrawn: "منسحب",
  completed: "منتهي",
};

/* ----------------------------- formatting ---------------------------- */

export const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      calendar: "gregory",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export const formatDateShort = (value) => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("ar", {
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export const toISODate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export const initials = (name = "") =>
  String(name)
    .replace(/^(د\.|أ\.|د )/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

/** Deterministic avatar color (the schema has no avatar_color field). */
const AVATAR_COLORS = [
  "#1572FE",
  "#12B76A",
  "#C08CEE",
  "#EEAC5C",
  "#2E90FA",
  "#F79009",
  "#292940",
];

export const avatarColor = (seed = "") => {
  const text = String(seed);
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 997;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

/** Display title for a session (schema has `topic` + `sessionNumber`, no title). */
export const sessionTitle = (session) =>
  session?.topic || (session?.sessionNumber != null ? `جلسة رقم ${session.sessionNumber}` : "جلسة");
