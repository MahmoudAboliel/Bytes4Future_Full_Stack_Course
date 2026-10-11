export const actions = ["backlog", "in_progress", "done", "archived", "delete"];
export const status = ["backlog", "in_progress", "done", "archived"];
export const priority = ["urgent", "high", "medium", "low"];
export const roles = ["woner", "member", "guest"];

export const taskFields = (usersRes = []) => [
  {
    type: "text",
    name: "title",
    label: "Task title",
    required: true,
  },
  {
    type: "textarea",
    name: "description",
    label: "Task description",
    rows: 4,
    required: true,
  },
  {
    name: "priority",
    label: "Task priority",
    type: "select",
    required: true,
    options: priority.map((item) => ({
      label: item.charAt(0).toUpperCase() + item.slice(1),
      value: item,
    })),
  },
  {
    name: "assigneeIds",
    label: "Assignee Users",
    type: "select",
    multiple: true,
    size: 5, // اختياري: عرض 5 صفوف
    options: usersRes.map((user) => ({ label: user.name, value: user.id })),
  },
  {
    name: "tags",
    label: "Task tags",
    type: "text",
    placeholder: "html, css, js",
  },
  {
    name: "dueDate",
    label: "Task due date",
    type: "date",
    required: true,
  },
];

export const userFields = [
  {
    type: "text",
    name: "name",
    label: "User Name",
    required: true,
  },
  {
    type: "email",
    name: "email",
    label: "User email",
    required: true,
  },
  // {
  //   type: "file",
  //   name: "avatarUrl",
  //   label: "User avatar",
  //   required: true,
  // },
  {
    type: "select",
    name: "role",
    label: "User role",
    options: roles.map((item) => ({
      label: item.charAt(0).toUpperCase() + item.slice(1),
      value: item,
    })),
  },
];
