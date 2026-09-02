const generateId = (len = 16) => {
  const letters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  let id = "";
  for (let i = 0; i < len; i++) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }
  return id;
};

const renderInput = (obj = {}, data) => {
  const attributes = Object.keys(obj);
  const div = document.createElement("div");
  div.classList = "group-field";

  if (attributes.includes("name")) {
    // generate id
    const id = generateId();
    // create elements
    const label = document.createElement("label");
    // set attribute
    label.htmlFor = id;
    label.innerHTML = attributes.includes("label") ? obj.label : obj.name;

    const input = document.createElement("input");
    input.id = id;
    input.value = data[obj.name];
    input.addEventListener("input", (e) => {
      data[obj.name] = e.target.value;
    });

    attributes.map((item) => {
      input[item] = obj[item];
    });

    div.appendChild(label);
    div.appendChild(input);

    return div;
  } else {
    div.innerHTML = "the field is wrong";
    div.style.color = "red";
    return div;
  }
};

const renderForm = (id, fields = [], onSubmit) => {
  const form = document.getElementById(id);
  const data = {};

  fields.map((field) => {
    if (field.name) {
      if (field.type == "number" || field.type == "range") {
        data[field.name] = field.defaultValue ?? field.min ?? 0;
      } else {
        data[field.name] = field.defaultValue ?? "";
      }
    }
    const myField = renderInput(field, data);
    form.appendChild(myField);
  });

  //   create buttons
  const div = document.createElement("div");
  div.classList = "group-buttons";

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "send";
  submit.onclick = (e) => {
    // e.preventDefault();
    onSubmit(data);
  };

  const cansel = document.createElement("input");
  cansel.type = "button";
  cansel.value = "cancel";
  cansel.onclick = (e) => {
    e.preventDefault();
    const myData = Array.from(form.querySelectorAll("input"));

    for (let i in myData) {
      if (!["submit", "button"].includes(myData[i].type)) {
        if (myData[i].type == "number" || myData[i].type == "range") {
          myData[i].value = myData[i].defaultValue ?? myData[i].min ?? 0;
        } else {
          myData[i].value = myData[i].defaultValue ?? "";
        }
      }
    }

    for (let key in data) {
      if (data.type == "number" || data.type == "range") data[key] == 0;
      else data[key] = "";
    }
  };

  div.append(submit, cansel);

  if (fields.length != 0) form.append(div);
};
