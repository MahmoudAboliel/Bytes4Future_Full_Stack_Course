const onSubmit = (data = {}) => {
  console.log("from main.js file");
  console.log(data);
};

fetch("./config.json")
  .then((res) => res.json())
  .then((data) => {
    renderForm("mainForm", data, onSubmit);
  });
