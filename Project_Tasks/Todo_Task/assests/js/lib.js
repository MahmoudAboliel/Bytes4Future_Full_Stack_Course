export const createCard = (task = {}) => {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add(
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
  const h5 = document.createElement("h5");
  h5.classList.add("card-title");
  h5.innerHTML = task.title;
  // dropdown and append it
  cardHeader.append(h5);

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
