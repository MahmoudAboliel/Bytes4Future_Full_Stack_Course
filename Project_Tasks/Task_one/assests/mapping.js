const damascusLocation = [33.5138, 36.2765];

const showMap = (users = []) => {
  let labelMap = "";
  let latCenter = 0;
  let lngCenter = 0;
  const bounds = [];
  let distance;
  let male = [];
  let female = [];
  let win = "";
  let farthestId;
  let youngestId;

  users.map((user) => {
    latCenter += user.lat;
    lngCenter += user.lng;
    bounds.push([user.lat, user.lng]);
  });

  const centerLoc = [latCenter / users.length, lngCenter / users.length];

  // init map
  const map = initMap("map", labelMap);

  users.forEach((user) => {
    distance = map.distance(centerLoc, [user.lat, user.lng]);
    user["distance"] = Number(distance);

    if (user.gender == "male") {
      male.push(user);
    } else {
      female.push(user);
    }
  });

  const areaMale = calculateArea(male);
  const areaFemale = calculateArea(female);
  areaMale > areaFemale ? (win = "male") : (win = "female");
  labelMap = `the winner team is: ${win}`;

  if (win == "male") {
    farthestId = selectFarthestWinner(male);
    youngestId = selectYoungestLoser(female);
  } else {
    farthestId = selectFarthestWinner(female);
    youngestId = selectYoungestLoser(male);
  }

  // select the center and appropariate zoom
  map.fitBounds(bounds || [damascusLocation], {
    padding: [50, 50],
  });

  // set circle at the center
  L.circle(centerLoc, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.2,
    radius: 50,
  }).addTo(map);

  // add user location
  users.map((user) => {
    const marker = L.marker([user.lat, user.lng]).addTo(map);
    if (user.id == farthestId || user.id == youngestId) {
      marker
        .bindPopup(
          ` 
            <b>${user.firstName} ${user.lastName}</b>
            <br>Age: ${user.age}
            <br>Gender: ${user.gender}
          `,
          {
            autoClose: false,
            closeOnClick: true,
          },
        )
        .openPopup();
      // <br>Distance: ${user.distance}
    }
  });

  // drawing polygon
  var polygon = L.polygon(
    male.map((user) => [user.lat, user.lng]),
    { color: win == "male" ? "green" : "red" },
  ).addTo(map);

  var polygon = L.polygon(
    female.map((user) => [user.lat, user.lng]),
    { color: win == "female" ? "green" : "red" },
  ).addTo(map);
};


const d = [
  {
    id: "jNH5VRyTyaVjStx#",
    firstName: "Mahmoud",
    lastName: "Abulail",
    gender: "male",
    age: 28,
    lat: 33.53780809176344,
    lng: 36.29944960210091,
  },
  {
    id: "kOJ6WSzUzbWkTuy$",
    firstName: "Kreem",
    lastName: "Ali",
    gender: "male",
    age: 25,
    lat: 33.54236085884103,
    lng: 36.32032746572462,
  },
  {
    id: "lPK7XT0VzcXlUvz%",
    firstName: "Masen",
    lastName: "Mohamd",
    gender: "male",
    age: 31,
    lat: 33.52283285549563,
    lng: 36.31571491445891,
  },
  {
    id: "mQL8YU1WzdYmVw&",
    firstName: "Nada",
    lastName: "Ismaeel",
    gender: "female",
    age: 24,
    lat: 33.52789234703519,
    lng: 36.28634024587206,
  },
  {
    id: "nRM9ZV2XaeZnWx*",
    firstName: "Sara",
    lastName: "Khaleel",
    gender: "female",
    age: 21,
    lat: 33.526172153123056,
    lng: 36.27359503842735,
  },
  {
    id: "oSN0AW3YbfAoXy#",
    firstName: "Farah",
    lastName: "Ahmad",
    gender: "female",
    age: 19,
    lat: 33.50694412829554,
    lng: 36.29386598741084,
  },
];


// showMap(d)