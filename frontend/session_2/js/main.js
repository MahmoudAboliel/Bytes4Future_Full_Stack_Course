// const BASE_URL = "https://jsonplaceholder.typicode.com/comments";
const BASE_URL = "http://localhost:3000";

fetch(`${BASE_URL}/users`)
  .then((res) => res.json())
  .then((users) => {
    fetch(`${BASE_URL}/posts`)
      .then((res) => res.json())
      .then((posts) => {
        fetch(`${BASE_URL}/albums`)
          .then((res) => res.json())
          .then((albums) => {
            fetch(`${BASE_URL}/todos`)
              .then((res) => res.json())
              .then((todos) => {
                const data = [];
                for (let i in users) {
                  const user = {};
                  const { id, name } = users[i];
                  user["Id"] = id;
                  user["Name"] = name;
                  user["Posts Count"] = posts.filter(
                    (post) => post.userId == id,
                  ).length;
                  user["Albums Count"] = albums.filter(
                    (album) => album.userId == id,
                  ).length;
                  user["Finished Jobs"] = todos.filter(
                    (todo) => todo.userId == id && todo.completed,
                  ).length;
                  user["Unfinished Jobs"] = todos.filter(
                    (todo) => todo.userId == id && !todo.completed,
                  ).length;
                  data.push(user);
                }
                renderTableElement("data", data);
              });
          });
      });
  });

// const params = new URLSearchParams(window.location.search);
