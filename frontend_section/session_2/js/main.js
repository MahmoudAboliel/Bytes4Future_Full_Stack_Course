// fetch("https://jsonplaceholder.typicode.com/comments")
fetch("./data/users.json")
  .then((res) => res.json())
  .then((data) => {
    renderTableElement("users", data);
  });


const params = new URLSearchParams(window.location.search);
 