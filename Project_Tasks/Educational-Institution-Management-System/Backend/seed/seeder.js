import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Models
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Level from "../models/levelModel.js";
import Cohort from "../models/cohortModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Session from "../models/sessionModel.js";
import EnrollmentResult from "../models/enrollmentResultModel.js";
import Attendance from "../models/attendanceModel.js";
import StudentNote from "../models/studentNoteModel.js";

dotenv.config();

// ============================================================
// بيانات البذر
// ============================================================

const USERS = [
  // ---------- Admin ----------
  {
    fullName: "أحمد محمود الخالدي",
    email: "admin@manara.edu",
    phone: "0501000001",
    role: "admin",
    birthDate: new Date("1985-01-15"),
  },
  // ---------- Secretary ----------
  {
    fullName: "سارة خالد العبادي",
    email: "secretary@manara.edu",
    phone: "0501000002",
    role: "secretary",
    birthDate: new Date("1992-03-20"),
  },
  // ---------- Teachers ----------
  {
    fullName: "د. محمد بن سالم",
    email: "m.b@manara.edu",
    phone: "0501000003",
    role: "teacher",
    birthDate: new Date("1980-07-10"),
    specialization: "الرياضيات",
    bio: "دكتوراه في الرياضيات التطبيقية، خبرة 15 عامًا في التدريس.",
  },
  {
    fullName: "فاطمة يوسف الزعبي",
    email: "f.z@manara.edu",
    phone: "0501000004",
    role: "teacher",
    birthDate: new Date("1987-11-05"),
    specialization: "اللغة الإنجليزية",
    bio: "ماجستير في اللغويات التطبيقية، متخصصة في تعليم الإنجليزية كلغة ثانية.",
  },
  {
    fullName: "عبدالله الشمري",
    email: "a.s@manara.edu",
    phone: "0501000005",
    role: "teacher",
    birthDate: new Date("1983-04-22"),
    specialization: "العلوم",
    bio: "ماجستير في الأحياء، مدرّس العلوم لجميع المراحل.",
  },
  // ---------- Students (10) ----------
  {
    fullName: "علي حسين الطراونة",
    email: "ali.s@manara.edu",
    phone: "0502000001",
    role: "student",
    birthDate: new Date("2005-02-14"),
    study: "الصف الحادي عشر - علمي",
  },
  {
    fullName: "نور محمد الشمري",
    email: "noor.s@manara.edu",
    phone: "0502000002",
    role: "student",
    birthDate: new Date("2006-08-09"),
    study: "الصف العاشر - أدبي",
  },
  {
    fullName: "يوسف خالد العنزي",
    email: "yousef.s@manara.edu",
    phone: "0502000003",
    role: "student",
    birthDate: new Date("2005-12-30"),
    study: "الصف الحادي عشر - علمي",
  },
  {
    fullName: "دانة الفهيد",
    email: "dana.s@manara.edu",
    phone: "0502000004",
    role: "student",
    birthDate: new Date("2007-05-18"),
    study: "الصف التاسع",
  },
  {
    fullName: "محمد العمري",
    email: "mohammad.s@manara.edu",
    phone: "0502000005",
    role: "student",
    birthDate: new Date("2006-01-25"),
    study: "الصف العاشر - علمي",
  },
  {
    fullName: "لينا الشهري",
    email: "lina.s@manara.edu",
    phone: "0502000006",
    role: "student",
    birthDate: new Date("2007-09-12"),
    study: "الصف التاسع",
  },
  {
    fullName: "خالد المطيري",
    email: "khaled.s@manara.edu",
    phone: "0502000007",
    role: "student",
    birthDate: new Date("2005-06-20"),
    study: "الصف الحادي عشر - أدبي",
  },
  {
    fullName: "ريم القحطاني",
    email: "reem.s@manara.edu",
    phone: "0502000008",
    role: "student",
    birthDate: new Date("2006-11-03"),
    study: "الصف العاشر - علمي",
  },
  {
    fullName: "سلمان الدوسري",
    email: "salman.s@manara.edu",
    phone: "0502000009",
    role: "student",
    birthDate: new Date("2005-03-08"),
    study: "الصف الحادي عشر - علمي",
  },
  {
    fullName: "أمل الزهراني",
    email: "amal.s@manara.edu",
    phone: "0502000010",
    role: "student",
    birthDate: new Date("2007-07-28"),
    study: "الصف التاسع",
  },
];

const COURSES = [
  {
    name: "الرياضيات",
    description: "دورة رياضيات شاملة تغطي الجبر والهندسة والتحليل.",
  },
  {
    name: "اللغة الإنجليزية",
    description: "دورة لغة إنجليزية لجميع المستويات، قراءة وكتابة ومحادثة.",
  },
  {
    name: "العلوم",
    description: "دورة علوم تشمل الفيزياء والكيمياء والأحياء.",
  },
];

// ============================================================
// Seeder
// ============================================================

const seedDB = async () => {
  const startTime = Date.now();

  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ Connected to MongoDB");

    // ---------- 1) حذف كل البيانات القديمة ----------
    console.log("\n🗑️  Clearing existing data...");
    await Promise.all([
      StudentNote.deleteMany({}),
      Attendance.deleteMany({}),
      EnrollmentResult.deleteMany({}),
      Session.deleteMany({}),
      Enrollment.deleteMany({}),
      Cohort.deleteMany({}),
      Level.deleteMany({}),
      Course.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("✅ All collections cleared");

    // ---------- 2) كلمة مرور موحدة لكل المستخدمين ----------
    const passwordHash = await bcrypt.hash("manara", 10);

    // ---------- 3) Users (isActive: true للجميع) ----------
    const users = await User.insertMany(
      USERS.map((u) => ({ ...u, password: passwordHash, isActive: true })),
    );
    const admin = users.find((u) => u.role === "admin");
    const secretary = users.find((u) => u.role === "secretary");
    const teachers = users.filter((u) => u.role === "teacher");
    const students = users.filter((u) => u.role === "student");
    console.log(
      `✅ Users: ${users.length} (1 admin, 1 secretary, ${teachers.length} teachers, ${students.length} students)`,
    );

    const mathTeacher = teachers.find((t) => t.specialization === "الرياضيات");
    const engTeacher = teachers.find(
      (t) => t.specialization === "اللغة الإنجليزية",
    );
    const sciTeacher = teachers.find((t) => t.specialization === "العلوم");

    // ---------- 4) Courses (isActive: true) ----------
    const courses = await Course.insertMany(
      COURSES.map((c) => ({ ...c, isActive: true })),
    );
    console.log(`✅ Courses: ${courses.length}`);

    const mathCourse = courses.find((c) => c.name === "الرياضيات");
    const engCourse = courses.find((c) => c.name === "اللغة الإنجليزية");
    const sciCourse = courses.find((c) => c.name === "العلوم");

    // ---------- 5) Levels (isActive: true) ----------
    const levels = await Level.insertMany([
      {
        title: "المستوى الأول - جبر",
        courseId: mathCourse._id,
        orderNumber: 1,
        isActive: true,
      },
      {
        title: "المستوى الثاني - هندسة",
        courseId: mathCourse._id,
        orderNumber: 2,
        isActive: true,
      },
      {
        title: "المستوى الثالث - تحليل",
        courseId: mathCourse._id,
        orderNumber: 3,
        isActive: true,
      },
      {
        title: "المستوى التمهيدي",
        courseId: engCourse._id,
        orderNumber: 1,
        isActive: true,
      },
      {
        title: "المستوى المتوسط",
        courseId: engCourse._id,
        orderNumber: 2,
        isActive: true,
      },
      {
        title: "المستوى الأول - أحياء",
        courseId: sciCourse._id,
        orderNumber: 1,
        isActive: true,
      },
      {
        title: "المستوى الثاني - كيمياء",
        courseId: sciCourse._id,
        orderNumber: 2,
        isActive: true,
      },
    ]);
    console.log(`✅ Levels: ${levels.length}`);

    const mathL1 = levels.find((l) => l.title === "المستوى الأول - جبر");
    const mathL2 = levels.find((l) => l.title === "المستوى الثاني - هندسة");
    const engL1 = levels.find((l) => l.title === "المستوى التمهيدي");
    const engL2 = levels.find((l) => l.title === "المستوى المتوسط");
    const sciL1 = levels.find((l) => l.title === "المستوى الأول - أحياء");

    // ---------- 6) Cohorts (isActive: true) ----------
    const cohorts = await Cohort.insertMany([
      {
        code: "MATH-101",
        levelId: mathL1._id,
        teacherId: mathTeacher._id,
        startDate: new Date("2026-01-10"),
        endDate: new Date("2026-03-10"),
        capacity: 20,
        status: "active",
        isActive: true,
      },
      {
        code: "MATH-201",
        levelId: mathL2._id,
        teacherId: mathTeacher._id,
        startDate: new Date("2026-03-15"),
        endDate: new Date("2026-05-15"),
        capacity: 20,
        status: "planned",
        isActive: true,
      },
      {
        code: "ENG-101",
        levelId: engL1._id,
        teacherId: engTeacher._id,
        startDate: new Date("2026-01-05"),
        endDate: new Date("2026-03-20"),
        capacity: 18,
        status: "active",
        isActive: true,
      },
      {
        code: "ENG-201",
        levelId: engL2._id,
        teacherId: engTeacher._id,
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-06-01"),
        capacity: 18,
        status: "planned",
        isActive: true,
      },
      {
        code: "SCI-101",
        levelId: sciL1._id,
        teacherId: sciTeacher._id,
        startDate: new Date("2026-01-15"),
        endDate: new Date("2026-03-25"),
        capacity: 25,
        status: "active",
        isActive: true,
      },
    ]);
    const math101 = cohorts.find((c) => c.code === "MATH-101");
    const eng101 = cohorts.find((c) => c.code === "ENG-101");
    const sci101 = cohorts.find((c) => c.code === "SCI-101");
    console.log(`✅ Cohorts: ${cohorts.length}`);

    // ---------- 7) Enrollments (isActive: true) ----------
    const enrollments = await Enrollment.insertMany([
      // MATH-101 (5 طلاب)
      {
        studentId: students[0]._id,
        cohortId: math101._id,
        status: "active",
        enrolledAt: new Date("2026-01-08"),
        isActive: true,
      },
      {
        studentId: students[1]._id,
        cohortId: math101._id,
        status: "active",
        enrolledAt: new Date("2026-01-08"),
        isActive: true,
      },
      {
        studentId: students[2]._id,
        cohortId: math101._id,
        status: "active",
        enrolledAt: new Date("2026-01-08"),
        isActive: true,
      },
      {
        studentId: students[3]._id,
        cohortId: math101._id,
        status: "active",
        enrolledAt: new Date("2026-01-08"),
        isActive: true,
      },
      {
        studentId: students[4]._id,
        cohortId: math101._id,
        status: "active",
        enrolledAt: new Date("2026-01-08"),
        isActive: true,
      },
      // ENG-101 (4 طلاب)
      {
        studentId: students[0]._id,
        cohortId: eng101._id,
        status: "active",
        enrolledAt: new Date("2026-01-03"),
        isActive: true,
      },
      {
        studentId: students[1]._id,
        cohortId: eng101._id,
        status: "active",
        enrolledAt: new Date("2026-01-03"),
        isActive: true,
      },
      {
        studentId: students[5]._id,
        cohortId: eng101._id,
        status: "active",
        enrolledAt: new Date("2026-01-03"),
        isActive: true,
      },
      {
        studentId: students[6]._id,
        cohortId: eng101._id,
        status: "active",
        enrolledAt: new Date("2026-01-03"),
        isActive: true,
      },
      // SCI-101 (3 طلاب)
      {
        studentId: students[7]._id,
        cohortId: sci101._id,
        status: "active",
        enrolledAt: new Date("2026-01-12"),
        isActive: true,
      },
      {
        studentId: students[8]._id,
        cohortId: sci101._id,
        status: "active",
        enrolledAt: new Date("2026-01-12"),
        isActive: true,
      },
      {
        studentId: students[9]._id,
        cohortId: sci101._id,
        status: "active",
        enrolledAt: new Date("2026-01-12"),
        isActive: true,
      },
    ]);

    const mathEnrollments = enrollments.slice(0, 5);
    const engEnrollments = enrollments.slice(5, 9);
    const sciEnrollments = enrollments.slice(9, 12);
    console.log(`✅ Enrollments: ${enrollments.length}`);

    // ---------- 8) Sessions ----------
    const sessions = await Session.insertMany([
      // MATH-101: 6 جلسات (3 منتهية، 3 قادمة)
      {
        cohortId: math101._id,
        sessionNumber: 1,
        sessionDate: new Date("2026-01-12"),
        topic: "مقدمة في الجبر",
        status: "done",
      },
      {
        cohortId: math101._id,
        sessionNumber: 2,
        sessionDate: new Date("2026-01-19"),
        topic: "المعادلات الخطية",
        status: "done",
      },
      {
        cohortId: math101._id,
        sessionNumber: 3,
        sessionDate: new Date("2026-01-26"),
        topic: "المتباينات",
        status: "done",
      },
      {
        cohortId: math101._id,
        sessionNumber: 4,
        sessionDate: new Date("2026-02-02"),
        topic: "الدوال التربيعية",
        status: "scheduled",
      },
      {
        cohortId: math101._id,
        sessionNumber: 5,
        sessionDate: new Date("2026-02-09"),
        topic: "اللوغاريتمات",
        status: "scheduled",
      },
      {
        cohortId: math101._id,
        sessionNumber: 6,
        sessionDate: new Date("2026-02-16"),
        topic: "مراجعة شاملة",
        status: "scheduled",
      },
      // ENG-101: 4 جلسات (2 منتهية، 2 قادمة)
      {
        cohortId: eng101._id,
        sessionNumber: 1,
        sessionDate: new Date("2026-01-07"),
        topic: "Introduction to English",
        status: "done",
      },
      {
        cohortId: eng101._id,
        sessionNumber: 2,
        sessionDate: new Date("2026-01-14"),
        topic: "Present Simple Tense",
        status: "done",
      },
      {
        cohortId: eng101._id,
        sessionNumber: 3,
        sessionDate: new Date("2026-01-21"),
        topic: "Past Simple Tense",
        status: "scheduled",
      },
      {
        cohortId: eng101._id,
        sessionNumber: 4,
        sessionDate: new Date("2026-01-28"),
        topic: "Future Tense",
        status: "scheduled",
      },
    ]);
    const mathSessions = sessions.slice(0, 6);
    const engSessions = sessions.slice(6, 10);
    console.log(`✅ Sessions: ${sessions.length}`);

    // ---------- 9) Attendance (للجلسات المنتهية فقط) ----------
    const presentDistribution = [
      "present",
      "present",
      "present",
      "present",
      "late",
      "absent",
    ];
    const attendanceData = [];

    // MATH-101 — 3 جلسات × 5 طلاب
    for (const s of mathSessions.slice(0, 3)) {
      mathEnrollments.forEach((e, i) => {
        attendanceData.push({
          sessionId: s._id,
          enrollmentId: e._id,
          status: presentDistribution[i % presentDistribution.length],
        });
      });
    }
    // ENG-101 — جلستان × 4 طلاب
    for (const s of engSessions.slice(0, 2)) {
      engEnrollments.forEach((e, i) => {
        attendanceData.push({
          sessionId: s._id,
          enrollmentId: e._id,
          status: presentDistribution[i % presentDistribution.length],
        });
      });
    }

    const attendances = await Attendance.insertMany(attendanceData);
    console.log(`✅ Attendance: ${attendances.length}`);

    // ---------- 10) Enrollment Results ----------
    // ملاحظة: حقل kind ليس موجودًا في الموديل الأصلي — إن أضفته سيُحفظ، وإلا فسيُتجاهل تلقائيًا
    const results = await EnrollmentResult.insertMany([
      {
        enrollmentId: mathEnrollments[0]._id,
        kind: "اختبار قصير",
        score: 87,
        maxScore: 100,
        grade: "ممتاز",
        notes: "أداء ممتاز ومنتظم.",
        isActive: true,
      },
      {
        enrollmentId: mathEnrollments[1]._id,
        kind: "اختبار قصير",
        score: 92,
        maxScore: 100,
        grade: "ممتاز",
        notes: "إجابات دقيقة وسريعة.",
        isActive: true,
      },
      {
        enrollmentId: mathEnrollments[2]._id,
        kind: "اختبار قصير",
        score: 76,
        maxScore: 100,
        grade: "جيد جداً",
        notes: "يحتاج مراجعة المعادلات.",
        isActive: true,
      },
      {
        enrollmentId: mathEnrollments[3]._id,
        kind: "اختبار قصير",
        score: 65,
        maxScore: 100,
        grade: "جيد",
        notes: "تحسن ملحوظ مقارنة بالبداية.",
        isActive: true,
      },
      {
        enrollmentId: mathEnrollments[4]._id,
        kind: "اختبار قصير",
        score: 58,
        maxScore: 100,
        grade: "مقبول",
        notes: "يحتاج متابعة فردية.",
        isActive: true,
      },
      {
        enrollmentId: engEnrollments[0]._id,
        kind: "منتصف الفصل",
        score: 77,
        maxScore: 100,
        grade: "جيد جداً",
        notes: "مشاركة جيدة في الصف.",
        isActive: true,
      },
      {
        enrollmentId: engEnrollments[1]._id,
        kind: "منتصف الفصل",
        score: 85,
        maxScore: 100,
        grade: "ممتاز",
        notes: "أداء قوي في المحادثة.",
        isActive: true,
      },
      {
        enrollmentId: sciEnrollments[0]._id,
        kind: "اختبار قصير",
        score: 90,
        maxScore: 100,
        grade: "ممتاز",
        notes: "متميز في الجانب العملي.",
        isActive: true,
      },
    ]);
    console.log(`✅ Enrollment Results: ${results.length}`);

    // ---------- 11) Student Notes ----------
    const notes = await StudentNote.insertMany([
      {
        studentId: students[0]._id,
        teacherId: mathTeacher._id,
        note: "أداء منتظم، يحتاج مراجعة الدوال التربيعية.",
        visibility: "teacherOnly",
      },
      {
        studentId: students[1]._id,
        teacherId: mathTeacher._id,
        note: "متميزة جداً، يُنصح بالانضمام لدورة متقدمة.",
        visibility: "teacherOnly",
      },
      {
        studentId: students[2]._id,
        teacherId: mathTeacher._id,
        note: "تحتاج حضوراً أكثر انتظاماً.",
        visibility: "teacherOnly",
      },
      {
        studentId: students[0]._id,
        teacherId: engTeacher._id,
        note: "تحسّن ملحوظ في مهارة المحادثة.",
        visibility: "student",
      },
      {
        studentId: students[5]._id,
        teacherId: engTeacher._id,
        note: "ضعف في الكتابة، يحتاج تدريباً إضافياً.",
        visibility: "teacherOnly",
      },
      {
        studentId: students[7]._id,
        teacherId: sciTeacher._id,
        note: "شغف واضح بالعلوم، أداء متميز.",
        visibility: "student",
      },
    ]);
    console.log(`✅ Student Notes: ${notes.length}`);

    // ---------- ملخص ----------
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n🎉 Seeding completed successfully in " + elapsed + "s");
    console.log("─────────────────────────────────────────");
    console.log(`🔑 Password for all users: manara`);
    console.log(`📧 Admin:      admin@manara.edu`);
    console.log(`📧 Secretary:  secretary@manara.edu`);
    console.log(`📧 Teacher:    m.b@manara.edu`);
    console.log(`📧 Student:    ali.s@manara.edu`);
    console.log("─────────────────────────────────────────");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:");
    console.error(error);
    process.exit(1);
  }
};

seedDB();
