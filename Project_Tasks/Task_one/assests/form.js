const fileds = [
  {
    type: "text",
    name: "firstName",
    required: true,
    label: "First Name",
  },
  {
    type: "text",
    name: "lasttName",
    required: true,
    label: "Last Name",
  },
  {
    type: "number",
    name: "age",
    required: true,
    label: "Age",
  },
  {
    type: "radio",
    name: "gender",
    label: "Gender",
    options: [
      {
        value: "male",
        label: "Male",
      },
      {
        value: "female",
        label: "Female",
      },
    ],
    required: true,
  },
  {
    type: "number",
    name: "lat", // خط العرض
    label: "Lat",
    required: true,
  },
  {
    type: "number",
    name: "log", // خط الطول
    label: "Log",
    required: true,
  },
];

const users = [];
let done = false;

const onSubmit = (data = {}) => {
  if (!done) {
    users.push(data);
    console.log(users);
    if (users.length == 6) done = true;
  }
  if (done) {
    const form = document.getElementById("form-data");
    const myMap = document.getElementById("map");
    const draw = document.createElement("button");
    draw.innerHTML = "draw";
    draw.type = "button";
    draw.classList.add("draw-btn");

    draw.onclick = () => {
      myMap.classList.remove("hidden");
      form.classList.add('hidden');
    };

    form.append(draw);
    done = true;
    return;
  }
};
// renderForm({ id: "mainForm", fields: data, onSubmit, type: "formData" });
renderForm({
  id: "form-data",
  fields: fileds,
  onSubmit,
  type: "json",
  buttons: {
    send: "Add",
    cancel: "clear",
  },
});
