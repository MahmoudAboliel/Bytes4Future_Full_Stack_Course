let response;

fetch("https://jsonplaceholder.typicode.com/posts/1", {
  method: "GET",
})
  .then((res) => res.json())
  .then(data => {
    response = data
  });


console.log(response)
