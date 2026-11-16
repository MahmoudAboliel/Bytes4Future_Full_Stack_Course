import Session from "../models/sessionModel.js";
import Cohort from "../models/cohortModel.js";
import AppError from "../utils/AppError.js";
import { escapeRegex } from "../utils/lib.js";

const shape = (s) => ({
  id: String(s._id),
  _id: s._id,
  cohortId: s.cohortId,
  sessionNumber: s.sessionNumber,
  sessionDate: s.sessionDate,
  topic: s.topic,
  status: s.status,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

const ensureCohortOwnership = async (cohortId, teacherId) => {
  const cohort = await Cohort.findOne({
    _id: cohortId,
    teacherId,
    deletedAt: null,
  });
  if (!cohort) throw new AppError("Cohort not found or not yours", 404);
  return cohort;
};

const ensureSessionOwnership = async (sessionId, teacherId) => {
  const session = await Session.findById(sessionId);
  if (!session) throw new AppError("Session not found", 404);
  await ensureCohortOwnership(session.cohortId, teacherId);
  return session;
};

const getTeacherCohortIds = async (teacherId) => {
  const cohorts = await Cohort.find({ teacherId, deletedAt: null })
    .select("_id")
    .lean();
  return cohorts.map((c) => c._id);
};

export const listSessions = async (
  teacherId,
  { cohortId, status, search, page = 1, limit = 20 },
) => {
  const cohortIds = await getTeacherCohortIds(teacherId);
  const filter = { cohortId: { $in: cohortIds } };

  if (cohortId) {
    await ensureCohortOwnership(cohortId, teacherId);
    filter.cohortId = cohortId;
  }
  if (status) filter.status = status;
  if (search) filter.topic = new RegExp(escapeRegex(search), "i");

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(200, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    Session.find(filter)
      .sort("-sessionDate")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Session.countDocuments(filter),
  ]);

  return {
    items: items.map(shape),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

/**
 * كل الجلسات — للسكرتيرة (لا يوجد مسار جلسات للسكرتيرة في الراوتر).
 */
export const listAllSessions = async ({
  cohortId,
  status,
  search,
  page = 1,
  limit = 200,
} = {}) => {
  const filter = {};
  if (cohortId) filter.cohortId = cohortId;
  if (status) filter.status = status;
  if (search) filter.topic = new RegExp(escapeRegex(search), "i");

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(200, Math.max(1, Number(limit) || 200));

  const [items, total] = await Promise.all([
    Session.find(filter)
      .sort("-sessionDate")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Session.countDocuments(filter),
  ]);

  return {
    items: items.map(shape),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const createSession = async (teacherId, data) => {
  await ensureCohortOwnership(data.cohortId, teacherId);

  let sessionNumber = data.sessionNumber;
  if (!sessionNumber) {
    const last = await Session.findOne({ cohortId: data.cohortId })
      .sort("-sessionNumber")
      .select("sessionNumber")
      .lean();
    sessionNumber = (last?.sessionNumber || 0) + 1;
  }

  const session = await Session.create({ ...data, sessionNumber });
  return shape(session);
};

export const updateSession = async (teacherId, id, data) => {
  await ensureSessionOwnership(id, teacherId);
  const session = await Session.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return shape(session);
};

export const deleteSession = async (teacherId, id) => {
  await ensureSessionOwnership(id, teacherId);
  const session = await Session.findByIdAndDelete(id);
  return shape(session);
};
