import { getUserById } from "../services/user.service.js";

const actions = ["backlog", "in_progress", "done", "archived", "delete"];

export const createCard = (task = {}) => {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add(
    "col",
    "card",
    "task-card",
    task.priority,
  );
  // urgent high medium low
  // append everything inside it
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardDiv.append(cardBody);

  // header
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("d-flex", "justify-content-between");
  const h5 = document.createElement("h5");
  h5.classList.add("card-title");
  h5.innerHTML = task.title;
  // dropdown and append it
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");
  dropdown.style.cursor = "pointer";
  const editSpan = document.createElement("span");
  editSpan.classList.add("dropdown-toggle");
  editSpan.setAttribute("data-bs-toggle", "dropdown");
  editSpan.setAttribute("aria-expanded", "false");
  editSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
      </svg> 
  `;
  const actionsUl = document.createElement("ul");
  actionsUl.classList.add("dropdown-menu");
  actions.map((action) => {
    const li = document.createElement("li");
    li.classList.add("dropdown-item");
    li.style.cursor = "pointer";
    li.style;
    li.innerHTML = action;
    li.onclick = async () => {
      console.log(action);
    };
    actionsUl.append(li);
  });
  dropdown.append(editSpan, actionsUl);
  cardHeader.append(h5, dropdown);

  // tags
  const tagsDiv = document.createElement("div");
  tagsDiv.classList.add("d-flex", "gap-1");
  task.tags.map((tag) => {
    const span = document.createElement("span");
    span.classList.add("badge", "text-bg-warning");
    span.innerHTML = tag;
    tagsDiv.append(span);
  });

  // description
  const description = document.createElement("p");
  description.classList.add("card-text");
  description.innerHTML = task.description;

  // status
  const statusDiv = document.createElement("div");
  statusDiv.classList.add("d-flex", "gap-1");
  const status = document.createElement("span");
  status.classList.add("badge", "text-bg-info", "text-light");
  status.innerHTML = task.status;
  const priority = document.createElement("span");
  priority.classList.add("badge", "text-bg-danger", "text-light");
  priority.innerHTML = task.priority;
  statusDiv.append(status, priority);

  // due date
  const dueDate = document.createElement("div");
  dueDate.classList.add("badge", "text-bg-secondary");
  dueDate.innerHTML = `due date: ${new Date(task.dueDate).toDateString()}`;

  // hr
  const hr = document.createElement("hr");

  // footer
  const cardFooter = document.createElement("div");
  cardFooter.classList.add("d-flex", "justify-content-between");

  // creator div append to footer
  const creatorDiv = document.createElement("div");
  const creator = document.createElement("p");
  creator.classList.add("creator");
  creator.innerHTML = `creator: ${task.creatorId.name}`;
  const createAt = document.createElement("p");
  createAt.classList.add("creator-date");
  createAt.innerHTML = `At: ${new Date(task.createdAt).toDateString()}`;
  creatorDiv.append(creator, createAt);

  // users image append to footer
  const imgsDiv = document.createElement("div");
  task.assigneeIds.map((user) => {
    const img = document.createElement("img");
    img.classList.add("user-image");
    img.src = user.avatarUrl;
    img.alt = user.avatarUrl.split("/").at(-1);
    imgsDiv.append(img);
  });

  cardFooter.append(creatorDiv, imgsDiv);

  // append everything to the card div body

  cardBody.append(
    cardHeader,
    tagsDiv,
    description,
    statusDiv,
    dueDate,
    hr,
    cardFooter,
  );

  return cardDiv;
};

export const initializeTask = async (task = {}) => {
  const creator = await getUserById(task.creatorId);

  const assigneeUsers = [];
  for (let i in task.assigneeIds) {
    const init = await getUserById(task.assigneeIds[i]);
    assigneeUsers.push(init);
  }

  return {
    ...task,
    creatorId: creator,
    assigneeIds: assigneeUsers,
  };
};
