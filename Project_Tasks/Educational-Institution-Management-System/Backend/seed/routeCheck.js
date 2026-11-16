import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Attendance from "../models/attendanceModel.js";
import Cohort from "../models/cohortModel.js";
import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";
import EnrollmentResult from "../models/enrollmentResultModel.js";
import Level from "../models/levelModel.js";
import Session from "../models/sessionModel.js";
import StudentNote from "../models/studentNoteModel.js";
import User from "../models/userModel.js";

const baseUrl = (
  process.env.ROUTE_CHECK_BASE_URL ||
  `http://localhost:${process.env.PORT || 4000}`
).replace(/\/+$/, "");
const password = "RouteCheck-Only-2026";
const suffix = `${Date.now().toString(36)}${Math.random()
  .toString(36)
  .slice(2, 7)}`;
const label = `routecheck-${suffix}`;
const results = [];

let tokens = {};
let fixtures = {};

const logResult = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "[PASS]" : "[FAIL]"} ${name}${detail ? ` — ${detail}` : ""}`);
};

const request = async (
  name,
  method,
  path,
  { token = tokens.admin, body, expected = "success" } = {},
) => {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    const passed =
      expected === "success"
        ? response.status >= 200 && response.status < 300
        : response.status >= 400 && response.status < 500;
    const responseDetail =
      typeof data === "string"
        ? data.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200)
        : JSON.stringify(data);
    const detail = `HTTP ${response.status}${
      passed ? "" : `: ${responseDetail}`
    }`;
    logResult(`${method} ${path} (${name})`, passed, detail);

    return { ok: passed, status: response.status, data };
  } catch (error) {
    logResult(`${method} ${path} (${name})`, false, error.message);
    return { ok: false, status: 0, data: null };
  }
};

const dataOf = (response) => response?.data?.data;
const missingId = () => new mongoose.Types.ObjectId().toString();

const login = async (role, email) => {
  const response = await request(`login ${role}`, "POST", "/api/auth/login", {
    token: null,
    body: { email, password },
  });
  const token = dataOf(response)?.token;
  if (!response.ok || !token) {
    throw new Error(`Could not obtain a token for the test ${role} account.`);
  }
  tokens[role] = token;
};

const createTestUser = async (role, index) => {
  const user = {
    fullName: `${label} ${role}`,
    email: `${label}.${role}${index}@example.test`,
    phone: `+1555${String(index).padStart(7, "0")}`,
    role,
    password: await bcrypt.hash(password, 10),
    isActive: true,
    birthDate: new Date("1990-01-01"),
    deletedAt: null,
  };
  if (role === "student") user.study = "Route check";
  if (role === "teacher") {
    user.specialization = "Route check";
    user.bio = "Test-only account created by the route checker";
  }
  return User.create(user);
};

const prepareTestData = async () => {
  const admin = await createTestUser("admin", 1);
  const secretary = await createTestUser("secretary", 2);
  const teacher = await createTestUser("teacher", 3);
  const student = await createTestUser("student", 4);
  const secondStudent = await createTestUser("student", 5);

  const course = await Course.create({
    name: `${label} Course`,
    description: "Test-only route-check course",
    isActive: true,
  });
  const level = await Level.create({
    title: `${label} Level`,
    courseId: course._id,
    orderNumber: 1,
    isActive: true,
  });
  const cohort = await Cohort.create({
    code: label,
    levelId: level._id,
    teacherId: teacher._id,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    capacity: 50,
    status: "active",
    isActive: true,
  });
  const enrollment = await Enrollment.create({
    studentId: student._id,
    cohortId: cohort._id,
    status: "active",
    enrolledAt: new Date(),
    isActive: true,
  });
  const session = await Session.create({
    cohortId: cohort._id,
    sessionNumber: 1,
    sessionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    topic: `${label} Session`,
    status: "scheduled",
  });
  await Attendance.create({
    sessionId: session._id,
    enrollmentId: enrollment._id,
    status: "present",
  });
  const result = await EnrollmentResult.create({
    enrollmentId: enrollment._id,
    kind: "route-check",
    score: 80,
    maxScore: 100,
    grade: "B",
    notes: "Test-only result",
    isActive: false,
  });
  const note = await StudentNote.create({
    studentId: student._id,
    teacherId: teacher._id,
    note: `${label} note`,
    visibility: "student",
  });

  fixtures = {
    admin,
    secretary,
    teacher,
    student,
    secondStudent,
    course,
    level,
    cohort,
    enrollment,
    session,
    result,
    note,
  };
};

const runChecks = async () => {
  const loginResponse = await request("login admin", "POST", "/api/auth/login", {
    token: null,
    body: {
      email: fixtures.admin.email,
      password,
    },
  });
  tokens.admin = dataOf(loginResponse)?.token;
  if (!loginResponse.ok || !tokens.admin) {
    throw new Error("Could not log in as the test admin.");
  }

  await login("secretary", fixtures.secretary.email);
  await login("teacher", fixtures.teacher.email);
  await login("student", fixtures.student.email);

  await request("auth profile", "GET", "/api/auth/me");
  await request("auth profile rejects missing token", "GET", "/api/auth/me", {
    token: null,
    expected: "error",
  });
  await request("register test-only user", "POST", "/api/auth/register", {
    token: null,
    body: {
      fullName: `${label} registered`,
      email: `${label}.registered@example.test`,
      phone: "+15550000005",
      role: "student",
      password,
      birthDate: "2005-01-01",
      study: "Route check",
    },
  });

  const id = (name) => fixtures[name]._id.toString();
  const absent = missingId();
  const userBody = {
    fullName: `${label} API user`,
    email: `${label}.api-user@example.test`,
    phone: "+15550000006",
    role: "student",
    password,
    birthDate: "2005-01-01",
    study: "Route check",
    isActive: true,
  };
  const courseBody = {
    name: `${label} API Course`,
    description: "Created while checking API routes",
    isActive: true,
  };
  const levelBody = {
    title: `${label} API Level`,
    courseId: id("course"),
    orderNumber: 2,
    isActive: true,
  };
  const cohortBody = {
    code: `${label}-api`,
    levelId: id("level"),
    teacherId: id("teacher"),
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 10,
    status: "planned",
    isActive: true,
  };

  // Admin
  await request("admin stats", "GET", "/api/admin/stats");
  await request("admin activity", "GET", "/api/admin/activity?limit=3");
  await request("admin users list", "GET", "/api/admin/users");
  await request("admin user detail", "GET", `/api/admin/users/${id("student")}`);
  await request("admin create user", "POST", "/api/admin/users", {
    body: userBody,
  });
  await request("admin update test user", "PUT", `/api/admin/users/${id("student")}`, {
    body: { fullName: `${label} updated student` },
  });
  await request("admin delete does not find unrelated id", "DELETE", `/api/admin/users/${absent}`, {
    expected: "error",
  });
  await request("admin toggle test user", "PATCH", `/api/admin/users/${id("student")}/active`, {
    body: { isActive: false },
  });
  await request("admin restore test user", "PATCH", `/api/admin/users/${id("student")}/active`, {
    body: { isActive: true },
  });
  await request("admin approvals list", "GET", "/api/admin/approvals");
  await request("admin approve missing id", "POST", `/api/admin/approvals/results/${absent}/approve`, {
    expected: "error",
  });
  await request("admin reject missing id", "POST", `/api/admin/approvals/results/${absent}/reject`, {
    expected: "error",
  });
  await request("admin report overview", "GET", "/api/admin/reports/overview");
  await request("admin cohort report", "GET", `/api/admin/reports/cohorts/${id("cohort")}`);
  await request("admin JSON report export", "GET", "/api/admin/reports/export");
  await request("admin CSV report export", "GET", "/api/admin/reports/export?format=csv");
  await request("admin cohorts list", "GET", "/api/admin/cohorts");
  await request("admin create cohort", "POST", "/api/admin/cohorts", { body: cohortBody });
  await request("admin cohort detail", "GET", `/api/admin/cohorts/${id("cohort")}`);
  await request("admin update test cohort", "PUT", `/api/admin/cohorts/${id("cohort")}`, {
    body: { code: `${label}-updated` },
  });
  await request("admin delete missing cohort", "DELETE", `/api/admin/cohorts/${absent}`, {
    expected: "error",
  });
  await request("admin cohort enrollments", "GET", `/api/admin/cohorts/${id("cohort")}/enrollments`);
  await request("admin courses list", "GET", "/api/admin/courses");
  await request("admin create course", "POST", "/api/admin/courses", { body: courseBody });
  await request("admin update test course", "PUT", `/api/admin/courses/${id("course")}`, {
    body: { description: `${label} updated description` },
  });
  await request("admin delete missing course", "DELETE", `/api/admin/courses/${absent}`, {
    expected: "error",
  });
  await request("admin levels list", "GET", "/api/admin/levels");
  await request("admin create level", "POST", "/api/admin/levels", { body: levelBody });
  await request("admin update test level", "PUT", `/api/admin/levels/${id("level")}`, {
    body: { title: `${label} Updated Level` },
  });
  await request("admin delete missing level", "DELETE", `/api/admin/levels/${absent}`, {
    expected: "error",
  });

  // Secretary
  await request("secretary stats", "GET", "/api/secretary/stats", { token: tokens.secretary });
  await request("secretary students list", "GET", "/api/secretary/students", { token: tokens.secretary });
  await request("secretary students not in cohort", "GET", `/api/secretary/students?notIn=${id("cohort")}`, {
    token: tokens.secretary,
  });
  await request("secretary create student", "POST", "/api/secretary/students", {
    token: tokens.secretary,
    body: {
      ...userBody,
      email: `${label}.secretary-student@example.test`,
      phone: "+15550000007",
    },
  });
  await request("secretary student detail", "GET", `/api/secretary/students/${id("student")}`, {
    token: tokens.secretary,
  });
  await request("secretary update test student", "PUT", `/api/secretary/students/${id("student")}`, {
    token: tokens.secretary,
    body: { fullName: `${label} secretary-updated student` },
  });
  await request("secretary delete missing student", "DELETE", `/api/secretary/students/${absent}`, {
    token: tokens.secretary,
    expected: "error",
  });
  await request("secretary teachers list", "GET", "/api/secretary/teachers", { token: tokens.secretary });
  await request("secretary create teacher", "POST", "/api/secretary/teachers", {
    token: tokens.secretary,
    body: {
      ...userBody,
      email: `${label}.api-teacher@example.test`,
      role: "teacher",
      specialization: "Route check",
      bio: "Test-only teacher",
    },
  });
  await request("secretary update test teacher", "PUT", `/api/secretary/teachers/${id("teacher")}`, {
    token: tokens.secretary,
    body: { bio: `${label} updated bio` },
  });
  await request("secretary delete missing teacher", "DELETE", `/api/secretary/teachers/${absent}`, {
    token: tokens.secretary,
    expected: "error",
  });
  await request("secretary cohorts list", "GET", "/api/secretary/cohorts", { token: tokens.secretary });
  await request("secretary create cohort", "POST", "/api/secretary/cohorts", {
    token: tokens.secretary,
    body: { ...cohortBody, code: `${label}-secretary` },
  });
  await request("secretary cohort detail", "GET", `/api/secretary/cohorts/${id("cohort")}`, {
    token: tokens.secretary,
  });
  await request("secretary update test cohort", "PUT", `/api/secretary/cohorts/${id("cohort")}`, {
    token: tokens.secretary,
    body: { code: `${label}-secretary-updated` },
  });
  await request("secretary delete missing cohort", "DELETE", `/api/secretary/cohorts/${absent}`, {
    token: tokens.secretary,
    expected: "error",
  });
  await request("secretary cohort enrollments", "GET", `/api/secretary/cohorts/${id("cohort")}/enrollments`, {
    token: tokens.secretary,
  });
  await request("secretary create enrollment", "POST", "/api/secretary/enrollments", {
    token: tokens.secretary,
    body: {
      studentId: id("secondStudent"),
      cohortId: id("cohort"),
      status: "active",
    },
  });
  await request("secretary patch enrollment", "PATCH", `/api/secretary/enrollments/${id("enrollment")}`, {
    token: tokens.secretary,
    body: { status: "withdrawn" },
  });
  await request("secretary restore test enrollment", "PATCH", `/api/secretary/enrollments/${id("enrollment")}`, {
    token: tokens.secretary,
    body: { status: "active" },
  });
  await request("secretary courses list", "GET", "/api/secretary/courses", { token: tokens.secretary });
  await request("secretary create course", "POST", "/api/secretary/courses", {
    token: tokens.secretary,
    body: { ...courseBody, name: `${label} Secretary Course` },
  });
  await request("secretary update test course", "PUT", `/api/secretary/courses/${id("course")}`, {
    token: tokens.secretary,
    body: { description: `${label} secretary-updated description` },
  });
  await request("secretary delete missing course", "DELETE", `/api/secretary/courses/${absent}`, {
    token: tokens.secretary,
    expected: "error",
  });
  await request("secretary levels list", "GET", "/api/secretary/levels", { token: tokens.secretary });
  await request("secretary create level", "POST", "/api/secretary/levels", {
    token: tokens.secretary,
    body: { ...levelBody, title: `${label} Secretary Level`, orderNumber: 3 },
  });
  await request("secretary update test level", "PUT", `/api/secretary/levels/${id("level")}`, {
    token: tokens.secretary,
    body: { title: `${label} Secretary Updated Level` },
  });
  await request("secretary delete missing level", "DELETE", `/api/secretary/levels/${absent}`, {
    token: tokens.secretary,
    expected: "error",
  });
  await request("secretary notes list", "GET", "/api/secretary/notes", { token: tokens.secretary });
  await request("secretary create note", "POST", "/api/secretary/notes", {
    token: tokens.secretary,
    body: {
      studentId: id("student"),
      teacherId: id("teacher"),
      note: `${label} API note`,
      visibility: "student",
    },
  });
  await request("secretary note detail", "GET", `/api/secretary/notes/${id("note")}`, {
    token: tokens.secretary,
  });
  await request("secretary update test note", "PUT", `/api/secretary/notes/${id("note")}`, {
    token: tokens.secretary,
    body: { note: `${label} updated note` },
  });
  await request("secretary delete missing note", "DELETE", `/api/secretary/notes/${absent}`, {
    token: tokens.secretary,
    expected: "error",
  });

  // Teacher
  await request("teacher stats", "GET", "/api/teacher/stats", { token: tokens.teacher });
  await request("teacher cohorts", "GET", "/api/teacher/cohorts", { token: tokens.teacher });
  await request("teacher upcoming sessions", "GET", "/api/teacher/sessions/upcoming", {
    token: tokens.teacher,
  });
  await request("teacher sessions list", "GET", "/api/teacher/sessions", { token: tokens.teacher });
  await request("teacher create session", "POST", "/api/teacher/sessions", {
    token: tokens.teacher,
    body: {
      cohortId: id("cohort"),
      sessionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      topic: `${label} API Session`,
    },
  });
  await request("teacher update test session", "PUT", `/api/teacher/sessions/${id("session")}`, {
    token: tokens.teacher,
    body: { topic: `${label} updated session` },
  });
  await request("teacher delete missing session", "DELETE", `/api/teacher/sessions/${absent}`, {
    token: tokens.teacher,
    expected: "error",
  });
  await request("teacher attendance list", "GET", `/api/teacher/attendance?sessionId=${id("session")}`, {
    token: tokens.teacher,
  });
  await request("teacher upsert test attendance", "POST", "/api/teacher/attendance", {
    token: tokens.teacher,
    body: {
      sessionId: id("session"),
      enrollmentId: id("enrollment"),
      status: "late",
    },
  });
  await request("teacher attendance summary", "GET", "/api/teacher/attendance/summary", {
    token: tokens.teacher,
  });
  await request("teacher results list", "GET", "/api/teacher/results", { token: tokens.teacher });
  await request("teacher create result", "POST", "/api/teacher/results", {
    token: tokens.teacher,
    body: {
      enrollmentId: id("enrollment"),
      kind: "route-check-api",
      score: 85,
      maxScore: 100,
      grade: "B",
      notes: "Created by route checker",
    },
  });
  await request("teacher approve all test results", "POST", "/api/teacher/results/approve-all", {
    token: tokens.teacher,
    body: { cohortId: id("cohort") },
  });
  await request("teacher update test result", "PUT", `/api/teacher/results/${id("result")}`, {
    token: tokens.teacher,
    body: { score: 82, grade: "B", notes: "Updated by route checker" },
  });
  await request("teacher delete missing result", "DELETE", `/api/teacher/results/${absent}`, {
    token: tokens.teacher,
    expected: "error",
  });
  await request("teacher students", "GET", "/api/teacher/students", { token: tokens.teacher });

  // Student
  await request("student profile", "GET", "/api/student/me", { token: tokens.student });
  await request("student cohorts", "GET", "/api/student/cohorts", { token: tokens.student });
  await request("student grades", "GET", "/api/student/grades", { token: tokens.student });
  await request("student attendance", "GET", "/api/student/attendance", { token: tokens.student });
  await request("student notes", "GET", "/api/student/notes", { token: tokens.student });
};

const main = async () => {
  if (process.env.ROUTE_CHECK_CONFIRM !== "YES") {
    throw new Error(
      "This checker creates persistent test records. Set ROUTE_CHECK_CONFIRM=YES to confirm.",
    );
  }
  if (!process.env.DB_URI) {
    throw new Error("DB_URI is missing. Set it in Backend/.env before running the checker.");
  }

  const readiness = await fetch(`${baseUrl}/api/auth/me`);
  if (readiness.status !== 401) {
    throw new Error(
      `Expected the backend to be running at ${baseUrl} (GET /api/auth/me returned HTTP ${readiness.status}).`,
    );
  }

  await mongoose.connect(process.env.DB_URI);
  await prepareTestData();
  console.log(`Created persistent test data with prefix "${label}".`);
  await runChecks();

  const passed = results.filter((result) => result.ok).length;
  const failed = results.length - passed;
  console.log(`\nRoute check complete: ${passed} passed, ${failed} failed.`);
  console.log(`Test records were left in the database (prefix: ${label}).`);
  if (failed) process.exitCode = 1;
};

main()
  .catch((error) => {
    console.error(`Route checker stopped: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
