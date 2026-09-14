import { getUsers, addUser, deleteUser, updateUser } from "./user.service.js";
import { getTasks, addTask } from "./task.service.js";

const usersDiv = document.getElementById("users");
updateUser("u-001", { name: "Ahmad Ali" });
const users = getUsers().data;
users.map(user => {
    const h3 = document.createElement('h3');
    h3.innerHTML = user.name;
    usersDiv.append(h3)

})

const tasksDiv = document.getElementById("tasks");
console.log(addTask({ name: "new task" }));
// updateUser("u-001", { name: "Ahmad Ali" });
const tasks = getTasks().data;
tasks.map((user) => {
  const h3 = document.createElement("h3");
  h3.innerHTML = user.title;
  tasksDiv.append(h3);
});