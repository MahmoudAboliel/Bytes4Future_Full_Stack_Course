const parseTableElement = (id) => {
  const res = [];
  const root = document.getElementById(id);
  root.style.fontSize = "20px";

  const tableTitls = root.querySelectorAll("thead tr th");
  const tableTitlsArr = Array.from(tableTitls).map((el) => el.innerHTML);

  const dataRows = root.querySelectorAll("tbody tr");
  const dataRowsArr = Array.from(dataRows);

  dataRowsArr.map((el) => {
    const tableData = el.querySelectorAll("td");
    const tableDataArr = Array.from(tableData);

    const user = {};

    for (let i in tableTitlsArr) {
      user[tableTitlsArr[i]] = tableDataArr[i].innerHTML;
    }

    res.push(user);
  });
  return res;
};

const renderTableElement = (id = "", data = [], comp) => {
  const table = document.getElementById(id);
  table.style.fontSize = "20px";
  // create the head of the table
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const keys = Object.keys(data[0]);
  keys.map((key) => {
    const th = document.createElement("th");
    th.innerHTML = key;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  // create the data to the table
  const tbody = document.createElement("tbody");

  data.sort(comp);
  data.map((element) => {
    const tr = document.createElement("tr");
    const tds = Object.values(element);
    tds.map((td) => {
      const d = document.createElement("td");
      d.innerHTML = td;
      tr.appendChild(d);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const inputSearch = document.createElement("input");
  inputSearch.type = "search";
  inputSearch.placeholder = "searching...";
  inputSearch.style.padding = "8px";
  inputSearch.style.fontSize = "18px";
  inputSearch.style.marginBottom = "8px";

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
};
