import StudentNote from "../models/studentNoteModel.js";
import AppError from "../utils/AppError.js";
import {escapeRegex} from "../utils/lib.js";

const shape = (n) => ({
  id: String(n._id),
  _id: n._id,
  studentId: n.studentId?._id ? String(n.studentId._id) : n.studentId,
  student: n.studentId?.fullName ? n.studentId : null,
  teacherId: n.teacherId?._id ? String(n.teacherId._id) : n.teacherId,
  teacher: n.teacherId?.fullName ? n.teacherId : null,
  note: n.note,
  visibility: n.visibility,
  createdAt: n.createdAt,
  updatedAt: n.updatedAt,
});

const populateOpts = [
  { path: "studentId", select: "fullName email" },
  { path: "teacherId", select: "fullName email" },
];

export const listNotes = async ({
  studentId,
  teacherId,
  visibility,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = { deletedAt: null };
  if (studentId) filter.studentId = studentId;
  if (teacherId) filter.teacherId = teacherId;
  if (visibility) filter.visibility = visibility;
  if (search) filter.note = new RegExp(escapeRegex(search), "i");

  page = Math.max(1, Number(page) || 1);
  limit = Math.min(200, Math.max(1, Number(limit) || 20));

  const [items, total] = await Promise.all([
    StudentNote.find(filter)
      .populate(populateOpts)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    StudentNote.countDocuments(filter),
  ]);

  return {
    items: items.map(shape),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getNote = async (id) => {
  const note = await StudentNote.findOne({ _id: id, deletedAt: null })
    .populate(populateOpts)
    .lean();
  if (!note) throw new AppError("Note not found", 404);
  return shape(note);
};

export const createNote = async (data) => {
  const note = await StudentNote.create(data);
  return shape(await note.populate(populateOpts));
};

export const updateNote = async (id, data) => {
  const note = await StudentNote.findOneAndUpdate(
    { _id: id, deletedAt: null },
    data,
    { new: true, runValidators: true },
  ).populate(populateOpts);
  if (!note) throw new AppError("Note not found", 404);
  return shape(note);
};

export const deleteNote = async (id) => {
  const note = await StudentNote.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true },
  );
  if (!note) throw new AppError("Note not found", 404);
  return shape(note);
};
