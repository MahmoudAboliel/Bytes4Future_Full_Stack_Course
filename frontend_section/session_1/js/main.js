const myData = parseTableElement("table1");
renderTableElement("table2", myData, (a, b) => b.mark - a.mark);

// const text = document.getElementById("table1");
// console.log(typeof text.textContent);
