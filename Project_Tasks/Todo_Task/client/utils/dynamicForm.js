export const generateId = (len = 16) => {
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
  radioDiv.classList.add("radio-group");
  obj.options.map((option) => {
    const radioLabel = document.createElement("label");
    const radioInput = document.createElement("input");
    const radioId = generateId();
    radioLabel.htmlFor = radioId;
    radioLabel.innerHTML = option.label;
    radioInput.id = radioId;
    Object.keys(obj).map((item) => {
      if (item != "options" && item != "label") {
        radioInput.setAttribute(item, obj[item]);
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
      if (item != "options" && item != "label") {
        input.setAttribute(item, obj[item]);
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

const selectType = (obj = {}, data = {}, id = "") => {
  const select = document.createElement("select");
  select.id = id;
  const isMultiple = obj.multiple === true || obj.multiple === "true";
  Object.keys(obj).map((item) => {
    if (item != "options" && item != "label") {
      select.setAttribute(item, obj[item]);
    }
  });

  if (!isMultiple) {
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = !data[obj.name];
    placeholder.textContent = obj.label || `اختر ${obj.label || obj.name}`;
    select.append(placeholder);
  }

  obj.options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.text = option.label;

    // Mark as selected if in data
    if (isMultiple) {
      if (
        Array.isArray(data[obj.name]) &&
        data[obj.name].includes(option.value)
      ) {
        opt.selected = true;
      }
    } else {
      if (data[obj.name] == option.value) {
        opt.selected = true;
      }
    }
    select.append(opt);
  });

  select.addEventListener("change", (e) => {
    if (isMultiple) {
      data[obj.name] = Array.from(e.target.selectedOptions).map((o) => o.value);
    } else {
      inputChange(e.target.value, data, obj.name);
    }
  });

  return select;
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
        input.setAttribute(item, obj[item]);
      });

      label.append(input, p);
      // label.innerHTML = obj.label || obj.name;
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
        inputChange(e.target.value.trim(), data, obj.name),
      );
      attributes.map((item) => {
        textarea.setAttribute(item, obj[item]);
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

    // select
    if (obj.type == "select") {
      if (obj.options) {
        const select = selectType(obj, data, id);
        div.append(label, select);
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
      inputChange(e.target.value.trim(), data, obj.name),
    );

    attributes.map((item) => {
      input.setAttribute(item, obj[item]);
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

export const renderForm = ({
  id = "",
  fields = [],
  onSubmit = () => {},
  type = "json",
  buttons = {
    send: "send",
    cancel: "cancel",
  },
}) => {
  const form = document.getElementById(id);
  const data = {};

  fields.map((field) => {
    if (field.name) {
      if (
        field.type == "checkbox" ||
        (field.type === "select" && field.multiple)
      ) {
        data[field.name] = [];
      } else data[field.name] = field.value || field.defaultValue || null;
    }
    const myField = renderInput(field, data);
    form.appendChild(myField);
  });

  //   create buttons
  const div = document.createElement("div");
  div.classList.add("group-buttons");

  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = buttons.send;

  const cansel = document.createElement("input");
  cansel.type = "reset";
  cansel.value = buttons.cancel;

  const submitFunc = (e) => {
    // e.preventDefault();
    if (type == "json") {
      onSubmit(data);
      resetFunc();
      cansel.click();
      return;
    }
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    onSubmit(formData);
    resetFunc();
    cansel.click();
  };

  const resetFunc = () => {
    for (let key in data) {
      const field = fields.find((field) => field.name == key);
      if (
        field?.type == "checkbox" ||
        (field?.type === "select" && field.multiple)
      ) {
        data[key] = [];
      } else {
        data[key] = field?.defaultValue || null;
      }
    }
  };

  submit.addEventListener("click", submitFunc);
  cansel.addEventListener("click", resetFunc);

  div.append(submit, cansel);

  if (fields.length != 0) form.append(div);
};