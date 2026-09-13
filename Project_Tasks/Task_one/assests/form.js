fetch("./config.json")
  .then((res) => res.json())
  .then((formFields) => {
    const users = [];
    
    const onSubmit = (myObj = {}) => {
      const latValue = form.querySelector('input[name="lat"]').value;
      const lngValue = form.querySelector('input[name="lng"]').value;
      let sendObj = {
        ...myObj,
        id: generateId(),
        lat: Number(latValue),
        lng: Number(lngValue),
      };
      users.push(sendObj);
      console.log(sendObj)
    };

    renderForm({
      id: "form-data",
      fields: formFields,
      onSubmit,
      type: "json",
      buttons: {
        send: "Add",
        cancel: "clear",
      },
    });
    const form = document.getElementById("form-data");
    const container = document.getElementById("container-form");
    const myMap = document.getElementById("map");

    const draw = document.createElement("button");
    draw.innerHTML = "draw";
    draw.type = "button";
    draw.classList.add("draw-btn");
    draw.onclick = () => {
      myMap.classList.remove("hidden");
      container.classList.add("hidden");
      console.log(users);
      showMap(users);
    };

    form.appendChild(draw);
  })
  .catch((err) => {
    console.error(err);
  });
