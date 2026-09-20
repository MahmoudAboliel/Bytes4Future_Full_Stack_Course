import { renderTable } from "../../utils/renderTable.js";
import { renderForm } from "../../utils/dynamicForm.js";
import {
  getUsers,
  getUserById,
  addUser,
  deleteUser,
  updateUser,
} from "../../services/user.service.js";
import { userFields } from "../../utils/constants.js";

const usersRes = await getUsers();

console.log(usersRes);
const columns = [
  {
    label: "Id",
    name: "id",
    order: 1,
    type: "text",
  },
  {
    label: "Avatar",
    name: "avatarUrl",
    order: 2,
    type: "img",
  },
  {
    label: "Name",
    name: "name",
    order: 3,
    type: "text",
  },
  {
    label: "Email",
    name: "email",
    order: 4,
    type: "text",
  },
  {
    label: "Role",
    name: "role",
    order: 5,
    type: "text",
  },
  {
    label: "Created At",
    name: "createdAt",
    order: 6,
    type: "date",
  },
  {
    label: "Updated At",
    name: "updatedAt",
    order: 7,
    type: "date",
  },
  {
    label: "Actions",
    name: "actions",
    order: 8,
    type: "actions",
    actions: {
      edit: (row) => {
        const el = document.createElement("button");
        el.innerHTML = "edit";
        el.classList.add("click-btn");
        el.addEventListener("click", () => {
          console.log("edit:", row.id);
        });
        return el;
      },
      delete: (row) => {
        const el = document.createElement("button");
        el.innerHTML = "delete";
        el.classList.add("click-btn");
        el.addEventListener("click", () => {
          console.log("delete:", row.id);
        });
        return el;
      },
    },
  },
];

renderTable({
  id: "users-table",
  columns,
  data: usersRes,
  searchable: true,
  comp: () => {},
});

const onSubmit = async (data = {}) => {
  const newData = {
    ...data,
    createdAt: new Date(),
    updatedAt: null,
    avatarUrl: `../assests/images/${data.avatarUrl.name}`,
  };
  
  const result = await addUser(newData);
  console.log(result);
};

renderForm({
  id: "addUser",
  fields: userFields,
  onSubmit,
  type: "json",
  buttons: {
    send: "Add",
    cancel: "clear",
  },
});
