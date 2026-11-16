import * as statsSvc from "../services/teacherService.js";
import * as sessionsSvc from "../services/sessionService.js";
import * as attendanceSvc from "../services/attendanceService.js";
import * as resultsSvc from "../services/resultService.js";
import * as notesSvc from "../services/noteService.js";
import {catchAsync, ok, created } from "../utils/lib.js";
import AppError from "../utils/AppError.js";

const teacherId = (req) => req.user._id;

/* ---------- Dashboard ---------- */
export const stats = catchAsync(async (req, res) =>
  ok(res, await statsSvc.getTeacherStats(teacherId(req))),
);

export const myCohorts = catchAsync(async (req, res) =>
  ok(res, await statsSvc.listTeacherCohorts(teacherId(req))),
);

export const upcomingSessions = catchAsync(async (req, res) =>
  ok(
    res,
    await statsSvc.listUpcomingSessions(teacherId(req), req.query.limit || 5),
  ),
);

/* ---------- Catalog ---------- */
export const catalog = catchAsync(async (req, res) =>
  ok(res, await statsSvc.listTeacherCatalog(teacherId(req))),
);

/* ---------- Sessions ---------- */
export const listSessions = catchAsync(async (req, res) => {
  const { items, meta } = await sessionsSvc.listSessions(
    teacherId(req),
    req.query,
  );
  ok(res, { items, meta });
});

export const createSession = catchAsync(async (req, res) =>
  created(res, await sessionsSvc.createSession(teacherId(req), req.body)),
);

export const updateSession = catchAsync(async (req, res) =>
  ok(
    res,
    await sessionsSvc.updateSession(teacherId(req), req.params.id, req.body),
  ),
);

export const deleteSession = catchAsync(async (req, res) =>
  ok(res, await sessionsSvc.deleteSession(teacherId(req), req.params.id)),
);

/* ---------- Attendance ---------- */
export const listAttendance = catchAsync(async (req, res) =>
  ok(res, await attendanceSvc.listAttendance(teacherId(req), req.query)),
);

export const upsertAttendance = catchAsync(async (req, res) =>
  ok(res, await attendanceSvc.upsertAttendance(teacherId(req), req.body)),
);

export const attendanceSummary = catchAsync(async (req, res) =>
  ok(
    res,
    await attendanceSvc.getAttendanceSummary(
      teacherId(req),
      req.query.limit || 5,
    ),
  ),
);

/* ---------- Results ---------- */
export const listResults = catchAsync(async (req, res) => {
  const { items, meta } = await resultsSvc.listResults(
    teacherId(req),
    req.query,
  );
  ok(res, { items, meta });
});

export const createResult = catchAsync(async (req, res) =>
  created(res, await resultsSvc.createResult(teacherId(req), req.body)),
);

export const updateResult = catchAsync(async (req, res) =>
  ok(
    res,
    await resultsSvc.updateResult(teacherId(req), req.params.id, req.body),
  ),
);

export const deleteResult = catchAsync(async (req, res) =>
  ok(res, await resultsSvc.deleteResult(teacherId(req), req.params.id)),
);

export const approveAll = catchAsync(async (req, res) =>
  ok(
    res,
    await resultsSvc.approveAllResults(teacherId(req), req.body.cohortId),
  ),
);

/* ---------- Students ---------- */
export const listStudents = catchAsync(async (req, res) =>
  ok(res, await statsSvc.listTeacherStudents(teacherId(req), req.query)),
);

/* ---------- Notes ---------- */
/** ملاحظات المدرس نفسه فقط. */
export const listNotes = catchAsync(async (req, res) => {
  const { items, meta } = await notesSvc.listNotes({
    ...req.query,
    teacherId: teacherId(req),
  });
  ok(res, { items, meta });
});

export const getNote = catchAsync(async (req, res) => {
  const note = await notesSvc.getNote(req.params.id);
  if (String(note.teacherId) !== String(teacherId(req)))
    throw new AppError("Note not yours", 403);
  ok(res, note);
});

export const createNote = catchAsync(async (req, res) =>
  created(
    res,
    await notesSvc.createNote({
      ...req.body,
      teacherId: teacherId(req),
    }),
  ),
);

export const updateNote = catchAsync(async (req, res) => {
  const note = await notesSvc.getNote(req.params.id);
  if (String(note.teacherId) !== String(teacherId(req)))
    throw new AppError("Note not yours", 403);
  ok(res, await notesSvc.updateNote(req.params.id, req.body));
});

export const deleteNote = catchAsync(async (req, res) => {
  const note = await notesSvc.getNote(req.params.id);
  if (String(note.teacherId) !== String(teacherId(req)))
    throw new AppError("Note not yours", 403);
  ok(res, await notesSvc.deleteNote(req.params.id));
});
