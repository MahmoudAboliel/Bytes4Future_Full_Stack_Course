export const renderTable = ({
  id = "",
  columns = [],
  data = [],
  comp = () => {},
  searchable = false,
}) => {
  const table = document.getElementById(id);
  if (!table) {
    console.error(`Element with id "${id}" not found`);
    return;
  }
  table.innerHTML = "";

  if (!data.length) {
    table.innerHTML = "<tbody><tr><td>لا توجد بيانات</td></tr></tbody>";
    return;
  }
  // create the head of the table
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  columns
    .sort((a, b) => a.order - b.order)
    .map((column) => {
      const th = document.createElement("th");
      th.textContent = column.label;
      th.dataset.key = column.name;
      tr.appendChild(th);
    });
  thead.appendChild(tr);
  table.appendChild(thead);

  // create the data to the table
  const tbody = document.createElement("tbody");

  data.sort(comp).map((row) => {
    const tr = document.createElement("tr");
    columns.map((col) => {
      const td = document.createElement("td");
      const value = row[col.name];

      if (col.type === "text") {
        td.textContent = value;
      } else if (col.type === "date") {
        td.textContent = value ? new Date(value).toDateString() : "--";
      } else if (col.type === "img") {
        const img = document.createElement("img");
        img.src = `.${value}`;
        img.loading = "lazy";

        img.alt = value.split("/").at(-1);
        td.append(img);
      } else if (col.type === "actions") {
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("actions-group");
        Object.values(col.actions).map((action) => {
          actionsDiv.append(action(row));
        });
        td.append(actionsDiv);
      }

      tr.append(td);
    });

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // add searching field
  if (searchable) {
    const inputSearch = document.createElement("input");
    inputSearch.type = "search";
    inputSearch.name = "search";
    inputSearch.placeholder = "searching...";

    inputSearch.addEventListener("input", (e) => {
      const text = e.target.value.toLowerCase();
      const trs = Array.from(table.querySelectorAll("tbody tr"));

      trs.forEach((tr) => {
        if (tr.textContent.toLowerCase().includes(text)) {
          tr.style.display = "";
        } else {
          tr.style.display = "none";
        }
      });
    });

    table.before(inputSearch);
  }
};
