/**

// return the first element with the same ID
const x = document.getElementById("root");

// return all elements with same name such as HTML collection
const y = document.getElementsByName("user-name");

// return all elements with same tag as HTML Collection
const z = document.getElementsByTagName("div");
console.log(z);

document.getElementsByClassName()

// using the CSS selectors
// return the first element 
const a = document.querySelector("div > .prime");
// return all elements as Node List
const b = document.querySelectorAll("div.prime");
console.log(b);

// to work with HTML Collection or Node List we should converting to Array
const res = Array.from(b);
res.map((e) => {
    console.log(e);
})

 */

const parseElement = (id) => {
  const res = [];
  const root = document.getElementById(id);
  const lis = root.querySelectorAll("li");
  const lisArray = Array.from(lis);
  lisArray.map((el) => {
    res.push(el.innerHTML);
  });
  return res;
};

// console.log(parseElement("root1"));

const renderElement = (id = "", data = [], colors = []) => {
  const root = document.getElementById(id);
  root.style.display = "flex";
  root.style.gap = "30px";
  data.map((item, i) => {
    const temp = document.createElement("div");
    temp.innerHTML = item;
    // styling
    temp.style.width = "60px";
    temp.style.height = "60px";
    temp.style.fontSize = "40px";
    temp.style.textAlign = "center";
    temp.style.lineHeight = "1.6";
    temp.style.backgroundColor = colors[i];
    root.appendChild(temp);
    // root.append()
  });
};

// const data = [3, 5, 22, 66, 15];
const data = parseElement("root1");
// document.getElementById("root1").innerHTML = "";
const colors = ["blue", "green", "yellow", "red", "gray"];
renderElement("root2", data, colors);




// ===========================================================
// edit table
const parseTableElement = (id) => {
  const res = [];
  const root = document.getElementById(id);

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
  const tableBody = document.querySelector(`#${id} tbody`);
  tableBody.innerHTML = "";
  data.sort(comp);

  data.map((item) => {
    const tr = document.createElement("tr");
    for (let i in item) {
      // console.log(item[i]);
      const td = document.createElement("td");
      td.innerHTML = item[i];
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  });
};

const userData = parseTableElement("user-table");
renderTableElement("user-table", userData, (a, b) => b.mark - a.mark);