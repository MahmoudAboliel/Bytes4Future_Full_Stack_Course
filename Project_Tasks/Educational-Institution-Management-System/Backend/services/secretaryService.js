import User from "../models/userModel.js";
import Cohort from "../models/cohortModel.js";
import Session from "../models/sessionModel.js";
import StudentNote from "../models/studentNoteModel.js";
import EnrollmentResult from "../models/enrollmentResultModel.js";
import Course from "../models/courseModel.js";
import Level from "../models/levelModel.js";

const THIRTY_DAYS_AGO = () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

export const getSecretaryStats = async () => {
  const since = THIRTY_DAYS_AGO();

  const [
    students,
    newStudents,
    teachers,
    activeCohorts,
    sessions,
    notes,
    pendingUsers,
    pendingCourses,
    pendingLevels,
    pendingCohorts,
    pendingResults,
  ] = await Promise.all([
    User.countDocuments({ role: "student", deletedAt: null }),
    User.countDocuments({
      role: "student",
      deletedAt: null,
      createdAt: { $gte: since },
    }),
    User.countDocuments({ role: "teacher", deletedAt: null }),
    Cohort.countDocuments({ status: "active", deletedAt: null }),
    Session.countDocuments({}),
    StudentNote.countDocuments({ deletedAt: null }),
    User.countDocuments({ isActive: false, deletedAt: null }),
    Course.countDocuments({ isActive: false, deletedAt: null }),
    Level.countDocuments({ isActive: false, deletedAt: null }),
    Cohort.countDocuments({ isActive: false, deletedAt: null }),
    EnrollmentResult.countDocuments({ isActive: false, deletedAt: null }),
  ]);

  return {
    students,
    newStudents,
    teachers,
    activeCohorts,
    sessions,
    notes,
    pendingApprovals:
      pendingUsers +
      pendingCourses +
      pendingLevels +
      pendingCohorts +
      pendingResults,
  };
};
