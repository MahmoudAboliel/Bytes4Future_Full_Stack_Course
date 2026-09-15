import { getUsers, addUser, deleteUser, updateUser } from "./user.service.js";
import { getTasks, addTask, deleteTask, updateTask } from "./task.service.js";

const usersDiv = document.getElementById("users");
updateUser("u-001", { name: "Ahmad Ali" });
const users = getUsers().data;
users.map(user => {
    const h3 = document.createElement('h3');
    h3.innerHTML = user.name;
    usersDiv.append(h3)

})

const tasksDiv = document.getElementById("tasks");
console.log(
  addTask({
    id: "t-009",
    title: "first test",
    description:
      "إنشاء تصميم UI/UX متجاوب للصفحة الرئيسية مع دعم الوضع الليلي.",
    assigneeIds: ["u-001", "u-002"],
    creatorId: "u-001",
    tags: ["ui", "design", "figma"],
    status: "in_progress",
    priority: "high",
    dueDate: "2026-09-25T18:00:00Z",
    completedAt: null,
    createdAt: "2026-09-10T08:30:00Z",
    updatedAt: "2026-09-13T12:00:00Z",
    order: 1,
  }),
);
updateTask("t-009", { title: "update title", status: "done" })
console.log(deleteTask("t-00"))
const tasks = getTasks().data;
tasks.map((user) => {
  const h3 = document.createElement("h3");
  const p = document.createElement("p");
  h3.innerHTML = user.title;
  p.innerHTML = user.status;
  tasksDiv.append(h3, p);
});