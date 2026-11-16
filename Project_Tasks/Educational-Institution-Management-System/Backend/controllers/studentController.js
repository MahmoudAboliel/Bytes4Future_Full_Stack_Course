import * as studentSvc from "../services/studentService.js";
import { ok, catchAsync } from "../utils/lib.js";

const studentId = (req) => req.user._id;

export const me = catchAsync(async (req, res) =>
  ok(res, await studentSvc.getProfile(studentId(req))),
);

export const myCohorts = catchAsync(async (req, res) =>
  ok(res, await studentSvc.listMyCohorts(studentId(req))),
);

export const myGrades = catchAsync(async (req, res) =>
  ok(res, await studentSvc.listMyGrades(studentId(req))),
);

export const myAttendance = catchAsync(async (req, res) =>
  ok(res, await studentSvc.listMyAttendance(studentId(req))),
);

export const myNotes = catchAsync(async (req, res) =>
  ok(res, await studentSvc.listMyNotes(studentId(req))),
);

/** كتالوج الدورات المعتمدة ومستوياتها (لاستكشاف الدورات). */
export const catalog = catchAsync(async (req, res) =>
  ok(res, await studentSvc.listMyCatalog()),
);

/** تحديث بيانات الطالب بنفسه. */
export const updateMe = catchAsync(async (req, res) =>
  ok(res, await studentSvc.updateProfile(studentId(req), req.body)),
);
