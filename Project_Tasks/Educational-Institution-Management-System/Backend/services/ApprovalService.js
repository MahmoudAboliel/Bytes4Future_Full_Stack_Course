import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Level from "../models/levelModel.js";
import Cohort from "../models/cohortModel.js";
import EnrollmentResult from "../models/enrollmentResultModel.js";
import AppError from "../utils/AppError.js";

const REGISTRY = {
  users: {
    model: User,
    kind: "مستخدم",
    titleField: "fullName",
    metaField: "role",
  },
  courses: { model: Course, kind: "مادة", titleField: "name", metaField: null },
  levels: { model: Level, kind: "مستوى", titleField: "title", metaField: null },
  cohorts: {
    model: Cohort,
    kind: "مجموعة",
    titleField: "code",
    metaField: null,
  },
  results: {
    model: EnrollmentResult,
    kind: "علامة",
    titleField: "grade",
    metaField: null,
  },
};

const shape = (collection, doc) => {
  const cfg = REGISTRY[collection];
  return {
    id: String(doc._id),
    _id: doc._id,
    collection,
    entityId: doc._id,
    title: doc[cfg.titleField] ?? "",
    kind: cfg.kind,
    meta: cfg.metaField ? (doc[cfg.metaField] ?? "") : "",
    createdAt: doc.createdAt,
  };
};

export const listApprovals = async (collection) => {
  const targets = collection ? [collection] : Object.keys(REGISTRY);

  const groups = await Promise.all(
    targets.map(async (c) => {
      const cfg = REGISTRY[c];
      if (!cfg) throw new AppError(`Unknown collection: ${c}`, 400);
      const docs = await cfg.model
        .find({ isActive: false, deletedAt: null })
        .sort("-createdAt")
        .lean();
      return docs.map((d) => shape(c, d));
    }),
  );

  return groups
    .flat()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const approve = async (collection, id) => {
  const cfg = REGISTRY[collection];
  if (!cfg) throw new AppError(`Unknown collection: ${collection}`, 400);

  const doc = await cfg.model.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { isActive: true },
    { new: true },
  );
  if (!doc) throw new AppError("Item not found", 404);
  return shape(collection, doc);
};

export const reject = async (collection, id) => {
  const cfg = REGISTRY[collection];
  if (!cfg) throw new AppError(`Unknown collection: ${collection}`, 400);

  const update =
    collection === "users"
      ? { isActive: false }
      : { isActive: true, deletedAt: new Date() };

  const doc = await cfg.model.findOneAndUpdate(
    { _id: id, deletedAt: null },
    update,
    { new: true },
  );
  if (!doc) throw new AppError("Item not found", 404);
  return shape(collection, doc);
};
