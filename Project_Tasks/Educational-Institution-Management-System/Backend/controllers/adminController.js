import * as usersSvc from "../services/userService.js";
import * as cohortsSvc from "../services/cohortService.js";
import * as coursesSvc from "../services/courseService.js";
import * as levelsSvc from "../services/levelService.js";
import * as approvalsSvc from "../services/ApprovalService.js";
import * as analyticsSvc from "../services/adminService.js";
import { ok, created, catchAsync } from "../utils/lib.js";

// ---- Dashboard ----
export const stats = catchAsync(async (req, res) =>
  ok(res, await analyticsSvc.getStats()),
);

export const activity = catchAsync(async (req, res) =>
  ok(res, await analyticsSvc.getActivity(req.query.limit || 5)),
);

// ---- Users ----
export const listUsers = catchAsync(async (req, res) => {
  const { items, meta } = await usersSvc.listUsers(req.query);
  ok(res, { items, meta });
});

export const getUser = catchAsync(async (req, res) =>
  ok(res, await usersSvc.getUser(req.params.id)),
);

export const createUser = catchAsync(async (req, res) =>
  created(res, await usersSvc.createUser(req.body)),
);

export const updateUser = catchAsync(async (req, res) =>
  ok(res, await usersSvc.updateUser(req.params.id, req.body)),
);

export const toggleUserActive = catchAsync(async (req, res) =>
  ok(res, await usersSvc.toggleActive(req.params.id, req.body.isActive)),
);

export const deleteUser = catchAsync(async (req, res) =>
  ok(res, await usersSvc.deleteUser(req.params.id)),
);

// ---- Approvals ----
export const listApprovals = catchAsync(async (req, res) =>
  ok(res, await approvalsSvc.listApprovals(req.query.collection)),
);

export const approve = catchAsync(async (req, res) =>
  ok(res, await approvalsSvc.approve(req.params.collection, req.params.id)),
);

export const reject = catchAsync(async (req, res) =>
  ok(res, await approvalsSvc.reject(req.params.collection, req.params.id)),
);

// ---- Reports ----
export const reportOverview = catchAsync(async (req, res) =>
  ok(res, await analyticsSvc.getOverview(req.query)),
);

export const reportCohort = catchAsync(async (req, res) =>
  ok(res, await analyticsSvc.getCohortReport(req.params.id)),
);

export const exportReport = catchAsync(async (req, res) => {
  const result = await analyticsSvc.exportReport(req.query);
  if (req.query.format === "csv") {
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="report.csv"');
    return res.send(result.csv);
  }
  ok(res, result.json);
});

// ---- Cohorts ----
export const listCohorts = catchAsync(async (req, res) => {
  const { items, meta } = await cohortsSvc.listCohorts(req.query);
  ok(res, { items, meta });
});

export const getCohort = catchAsync(async (req, res) =>
  ok(res, await cohortsSvc.getCohort(req.params.id)),
);

export const createCohort = catchAsync(async (req, res) =>
  created(res, await cohortsSvc.createCohort(req.body)),
);

export const updateCohort = catchAsync(async (req, res) =>
  ok(res, await cohortsSvc.updateCohort(req.params.id, req.body)),
);

export const deleteCohort = catchAsync(async (req, res) =>
  ok(res, await cohortsSvc.deleteCohort(req.params.id)),
);

export const listCohortEnrollments = catchAsync(async (req, res) =>
  ok(res, await cohortsSvc.listCohortEnrollments(req.params.id)),
);

// ---- Courses ----
export const listCourses = catchAsync(async (req, res) => {
  const { items, meta } = await coursesSvc.listCourses(req.query);
  ok(res, { items, meta });
});

export const createCourse = catchAsync(async (req, res) =>
  created(res, await coursesSvc.createCourse(req.body)),
);

export const updateCourse = catchAsync(async (req, res) =>
  ok(res, await coursesSvc.updateCourse(req.params.id, req.body)),
);

export const deleteCourse = catchAsync(async (req, res) =>
  ok(res, await coursesSvc.deleteCourse(req.params.id)),
);

// ---- Levels ----
export const listLevels = catchAsync(async (req, res) => {
  const { items, meta } = await levelsSvc.listLevels(req.query);
  ok(res, { items, meta });
});

export const createLevel = catchAsync(async (req, res) =>
  created(res, await levelsSvc.createLevel(req.body)),
);

export const updateLevel = catchAsync(async (req, res) =>
  ok(res, await levelsSvc.updateLevel(req.params.id, req.body)),
);

export const deleteLevel = catchAsync(async (req, res) =>
  ok(res, await levelsSvc.deleteLevel(req.params.id)),
);
