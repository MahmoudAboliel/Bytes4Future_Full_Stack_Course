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

const data = [
  [33.5119, 36.3067],
  [33.5131, 36.2974],
  [33.5152, 36.2768],
  [33.5097, 36.3063],
  [33.5125, 36.2913],
  [33.5422, 36.2942],
];
const users = [];
let done = false;
let latCenter = 33.5119 + 33.5131 + 33.5152 + 33.5097 + 33.5125 + 33.5422;
let logCenter = 36.3067 + 36.2974 + 36.2768 + 36.3063 + 36.2913 + 36.2942;

const onSubmit = (data = {}) => {
  if (users.length == 6 && !done) {
    const form = document.getElementById("form-data");
    const draw = document.createElement("button");
    draw.innerHTML = "draw";
    draw.type = "button";
    draw.classList.add("draw-btn");
    draw.onclick = () => {
      users.map((item) => {
        latCenter += item.lat;
        logCenter += item.log;
      });

      console.log(latCenter / 6, logCenter / 6);
    };
    form.append(draw);
    done = true;
    return;
  }
  if (users.length < 6) {
    users.push(data);
    console.log(users);
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
