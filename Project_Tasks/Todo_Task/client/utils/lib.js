import { getUserById } from "../services/user.service.js";
import { updateTask, deleteTask } from "../services/task.service.js";
import { actions } from "./constants.js";

export const createCard = (task = {}) => {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "task-card", task.priority);
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
    if (task.status != action) {
      const li = document.createElement("li");
      li.classList.add("dropdown-item");
      li.style.cursor = "pointer";
      li.style.fontSize = "14px";
      li.innerHTML = action;
      li.onclick = async () => {
        if (action != "delete") {
          await updateTask(task.id, {
            ...task,
            creatorId: task.creatorId.id,
            assigneeIds: task.assigneeIds.map((u) => u.id),
            status: action,
          });
        }
      };
      actionsUl.append(li);
    }
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

  const accordionDiv = document.createElement("div");
  accordionDiv.classList.add("accordion", "accordion-flush");
  accordionDiv.style.margin = "8px 0";
  accordionDiv.id = `accordionExample`;
  accordionDiv.innerHTML = `
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne${task.id}" aria-expanded="false" aria-controls="collapseOne">
        Accordion Item #1
      </button>
    </h2>
    <div id="collapseOne${task.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the first item’s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo${task.id}" aria-expanded="false" aria-controls="collapseTwo">
        Accordion Item #2
      </button>
    </h2>
    <div id="collapseTwo${task.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the second item’s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  `;

  // status & priority
  const statusDiv = document.createElement("div");
  statusDiv.classList.add("d-flex", "gap-1");
  const status = document.createElement("span");
  status.classList.add(
    "badge",
    `text-bg-${task.status == "backlog" ? "info" : task.status == "in_progress" ? "success" : "secondary"}`,
    "text-light",
  );
  status.innerHTML = task.status;
  const priority = document.createElement("span");
  priority.classList.add(
    "badge",
    `text-bg-${task.priority == "low" ? "info" : task.priority == "medium" ? "warning" : "danger"}`,
    "text-light",
  );
  priority.innerHTML = `${task.priority == "low" ? "🌱" : task.priority == "medium" ? "⚡" : "🔥"}${task.priority}`;
  statusDiv.append(status, priority);

  // due date
  const dueDate = document.createElement("div");
  dueDate.classList.add("badge", "text-bg-secondary");
  dueDate.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-check" viewBox="0 0 16 16">
    <path d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5z"/>
  </svg>
  due date: ${new Date(task.dueDate).toDateString()}
  `;

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
    const fullDetails = document.createElement("div");
    fullDetails.classList.add("assignee-etails", "hidden");
    fullDetails.innerHTML = `
      <div style="position: relative; width: fit-content; display: flex; align-items: center; gap: 8px; padding: 10px; box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3); border-radius: 8px;">
        <img src="${user.avatarUrl}" style="width: 60px; height: 60px; border-radius: 50%;" alt="">
        <div>
          <h5 style="margin: 0;">${user.name}</h5>
          <p style="margin: 0; color: gray;">${user.email}</p>
        </div>
      </div>
    `;

    const img = document.createElement("img");
    img.classList.add("user-image");
    img.src = user.avatarUrl;
    img.alt = user.avatarUrl.split("/").at(-1);

    img.addEventListener("mouseenter", () => {
      fullDetails.classList.remove("hidden")
    });
    img.addEventListener("mouseleave", () => {
      fullDetails.classList.add("hidden")
    });
    
    imgsDiv.append(img, fullDetails);

  });

  cardFooter.append(creatorDiv, imgsDiv);

  // append everything to the card div body

  cardBody.append(
    cardHeader,
    tagsDiv,
    description,
    // accordionDiv,
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
