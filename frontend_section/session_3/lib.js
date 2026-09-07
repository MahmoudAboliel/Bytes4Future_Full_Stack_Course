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
    Object.keys(obj).map((item) => {
      if (item != "options") {
        radioInput[item] = obj[item];
      }
    });
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
    Object.keys(obj).map((item) => {
      if (item != "options") {
        input[item] = obj[item];
      }
    });
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

    // file type
    if (obj.type == "file") {
      const input = document.createElement("input");
      const label = document.createElement("label");
      const p = document.createElement("p");
      p.classList.add("file-text");
      p.innerHTML = "choose a file...";
      label.classList.add("file-field");
      attributes.map((item) => {
        input[item] = obj[item];
      });

      label.append(input, p);
      // label.innerHTML = obj.label ?? obj.name;
      input.style.display = "none";
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) {
          return;
        }
        p.innerHTML = file.name;
        data[obj.name] = file;
      });
      div.append(label);
      return div;
    }
    // create elements
    const label = document.createElement("label");
    // set attribute
    label.htmlFor = id;
    label.innerHTML = attributes.includes("label") ? obj.label : obj.name;

    // radio type
    if (obj.type == "radio") {
      if (obj.options) {
        const radioDiv = radioType(obj, data);
        label.removeAttribute("for");
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
        label.removeAttribute("for");
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
    input.addEventListener("input", (e) =>
      inputChange(e.target.value, data, obj.name),
    );

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

const renderForm = ({
  id = "",
  fields = [],
  onSubmit = () => {},
  type = "json",
}) => {
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
    if (type == "json") {
      onSubmit(data);
      return;
    }
    const formData = new FormData();
    for (let key in data) {
      formData[key] = data[key];
    }
    onSubmit(formData);
  };

  const cansel = document.createElement("input");
  cansel.type = "button";
  cansel.value = "cancel";
  cansel.onclick = (e) => {
    // remove data from UI
    e.preventDefault();
    const myData = Array.from(form.querySelectorAll("input"));

    myData.map((field) => {
      if (!["submit", "button"].includes(field.type)) {
        if (field.type == "range") {
          field.value = field.defaultValue ?? field.min ?? null;
        } else if (field.type == "radio" || field.type == "checkbox") {
          field.checked = false;
        } else if (field.type == "file") {
          const pragraphs = Array.from(form.querySelectorAll(".file-text"));
          pragraphs.map((p) => (p.innerHTML = "choose a file..."));
        } else {
          field.value = field.defaultValue ?? null;
        }
      }
    });

    // remove data from back
    for (let key in data) {
      const field = fields.find((field) => field.name == key);
      if (field.type == "checkbox") data[key] = [];
      else data[key] = field.defaultValue ?? null;
    }
  };

  div.append(submit, cansel);

  if (fields.length != 0) form.append(div);
};
