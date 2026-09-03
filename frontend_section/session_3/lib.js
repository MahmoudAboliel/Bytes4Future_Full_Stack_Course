const generateId = (len = 16) => {
  const letters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  let id = "";
  for (let i = 0; i < len; i++) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }
  return id;
};

const inputChange = (value, data, name) => (data[name] = value);

const radioType = (obj = {}, data = {}) => {
  const radioDiv = document.createElement("div");

  obj.options.map((option) => {
    const radioLabel = document.createElement("label");
    const radioInput = document.createElement("input");
    const radioId = generateId();
    radioLabel.htmlFor = radioId;
    radioLabel.innerHTML = option.label;
    radioInput.id = radioId;
    radioInput.type = obj.type;
    radioInput.name = obj.name;
    radioInput.value = option.value;
    radioInput.addEventListener("input", (e) =>
      inputChange(e.target.value, data, obj.name),
    );
    radioDiv.append(radioInput, radioLabel);
  });

  return radioDiv;
};

const checkboxType = (obj = {}, data = {}) => {
  const checkboxDiv = document.createElement("div");
  obj.options.map((option) => {
    const id = generateId();
    const optionDiv = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerHTML = option.label;

    input.id = id;
    input.type = obj.type;
    input.name = obj.name;
    input.value = option.value;
    input.addEventListener("change", (e) => {
      const item = e.target;
      if (item.checked && !data[obj.name].includes(item.value))
        data[obj.name].push(item.value);
      else if (!item.checked && data[obj.name].includes(item.value))
        data[obj.name].splice(data[obj.name].indexOf(item.value), 1);
    });

    optionDiv.append(input, label);
    checkboxDiv.append(optionDiv);
  });

  return checkboxDiv;
};

const renderInput = (obj = {}, data) => {
  const attributes = Object.keys(obj);
  const div = document.createElement("div");
  div.classList.add("group-field");

  if (attributes.includes("name")) {
    // generate id
    const id = generateId();
    // create elements
    const label = document.createElement("label");
    // set attribute
    label.htmlFor = id;
    label.innerHTML = attributes.includes("label") ? obj.label : obj.name;

    // radio type
    if (obj.type == "radio") {
      if (obj.options) {
        const radioDiv = radioType(obj, data);
        div.append(label, radioDiv);
        return div;
      } else {
        div.innerHTML = "the field is wrong";
        div.style.color = "red";
        return div;
      }
    }
    // textarea
    if (obj.type == "textarea") {
      const textarea = document.createElement("textarea");
      textarea.id = id;
      textarea.value = data[obj.name];
      textarea.addEventListener("input", (e) =>
        inputChange(e.target.value, data, obj.name),
      );
      attributes.map((item) => {
        textarea[item] = obj[item];
      });
      div.append(label, textarea);
      return div;
    }

    // checkbox
    if (obj.type == "checkbox") {
      if (obj.options) {
        const checkboxDiv = checkboxType(obj, data);
        div.append(label, checkboxDiv);
        return div;
      } else {
        div.innerHTML = "the field is wrong";
        div.style.color = "red";
        return div;
      }
    }

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
      if (field.type == "checkbox") data[field.name] = [];
      else data[field.name] = field.value ?? field.defaultValue ?? null;
    }
    const myField = renderInput(field, data);
    form.appendChild(myField);
  });

  //   create buttons
  const div = document.createElement("div");
  div.classList.add("group-buttons");

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "send";
  submit.onclick = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  const cansel = document.createElement("input");
  cansel.type = "button";
  cansel.value = "cancel";
  cansel.onclick = (e) => {
    // remove data from UI
    e.preventDefault();
    const myData = Array.from(form.querySelectorAll("input"));

    for (let i in myData) {
      if (!["submit", "button"].includes(myData[i].type)) {
        if (myData[i].type == "range") {
          myData[i].value = myData[i].min;
        } else if (myData[i].type == "radio" || myData[i].type == "checkbox") {
          myData[i].checked = false;
        } else {
          myData[i].value = myData[i].defaultValue ?? null;
        }
      }
    }

    // remove data from back
    for (let key in data) {
      const field = fields.find((field) => field.name == key);
      if (field.type == "checkbox") data[key] = [];
      else data[key] = null;
    }
  };

  div.append(submit, cansel);

  if (fields.length != 0) form.append(div);
};
