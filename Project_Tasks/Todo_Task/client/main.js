import { getTasks, addTask } from "./services/task.service.js";
import { createCard, initializeTask } from "./utils/lib.js";
import { renderForm } from "./utils/dynamicForm.js";
import { taskFields } from "./utils/constants.js";
import { getUsers } from "./services/user.service.js";

const backlogSection = document.getElementById("backlog-section");
const inProgressSection = document.getElementById("in-progress-section");
const doneSection = document.getElementById("done-section");
const archivedSection = document.getElementById("archived-section");

const tasksRes = await getTasks();
const usersRes = await getUsers();

for (let i in tasksRes) {
  const editTask = await initializeTask(tasksRes[i]);
  tasksRes[i] = editTask;
}

tasksRes.map((task) => {
  if (task.status == "backlog") backlogSection.append(createCard(task));
  else if (task.status == "in_progress")
    inProgressSection.append(createCard(task));
  else if (task.status == "done") doneSection.append(createCard(task));
  else archivedSection.append(createCard(task));
});

const onSubmit = async (data = {}) => {
  data["creatorId"] = "u-001";
  data["createdAt"] = new Date();
  data["status"] = "backlog";
  data["updatedAt"] = null;
  data["completedAt"] = null;
  data["tags"] = data["tags"]?.split(",").map((t) => t.trim());

  const result = await addTask(data);
  console.log(result);
};

renderForm({
  id: "addTask",
  fields: taskFields(usersRes),
  onSubmit,
  type: "json",
  buttons: {
    send: "Add",
    cancel: "clear",
  },
});

// const task = {
//   id: "t-001",
//   title: "تصميم واجهة الصفحة الرئيسية",
//   description: "إنشاء تصميم UI/UX متجاوب للصفحة الرئيسية مع دعم الوضع الليلي.",
//   assigneeIds: [
//     {
//       id: "u-001",
//       name: "Mahmoud Abulail",
//       email: "mahmoud.abulail@example.com",
//       avatarUrl: "./assests/images/patient_12.jpg",
//       role: "owner",
//       createdAt: "2025-01-10T08:00:00Z",
//       updatedAt: null,
//     },
//     {
//       id: "u-002",
//       name: "Sara Al-Ahmad",
//       email: "sara.ahmad@example.com",
//       avatarUrl: "./assests/images/patient_4.jpg",
//       role: "member",
//       createdAt: "2025-01-12T09:30:00Z",
//       updatedAt: null,
//     },
//   ],
//   creatorId: {
//     id: "u-005",
//     name: "Yousef Nasser",
//     email: "yousef.nasser@example.com",
//     avatarUrl: "./assests/images/patient_13.jpg",
//     role: "guest",
//     createdAt: "2025-02-05T14:20:00Z",
//     updatedAt: null,
//   },
//   tags: ["ui", "design", "figma"],
//   status: "in_progress",
//   priority: "high",
//   dueDate: "2026-09-25T18:00:00Z",
//   completedAt: null,
//   createdAt: "2026-09-10T08:30:00Z",
//   updatedAt: "2026-09-13T12:00:00Z",
//   order: 1,
// };

// console.log();
// backlogSection.append(createCard(task));
