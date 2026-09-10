const data = [
  {
    firstName: "Mahmoud",
    lastName: "Abulail",
    gender: "Male",
    age: 28,
    lat: 33.53780809176344,
    log: 36.29944960210091,
  },
  {
    firstName: "Kreem",
    lastName: "Ali",
    gender: "Male",
    age: 25,
    lat: 33.54236085884103,
    log: 36.32032746572462,
  },
  {
    firstName: "Masen",
    lastName: "Mohamd",
    gender: "Male",
    age: 31,
    lat: 33.52283285549563,
    log: 36.31571491445891,
  },
  {
    firstName: "Nada",
    lastName: "Ismaeel",
    gender: "Female",
    age: 24,
    lat: 33.52789234703519,
    log: 36.28634024587206,
  },
  {
    firstName: "Sara",
    lastName: "Khaleel",
    gender: "Female",
    age: 21,
    lat: 33.526172153123056,
    log: 36.27359503842735,
  },
  {
    firstName: "Farah",
    lastName: "Ahmad",
    gender: "Female",
    age: 19,
    lat: 33.50694412829554,
    log: 36.29386598741084,
  },
];

let latCenter = 0;
let logCenter = 0;
const bounds = [];
let point2;
let distance;
let win = "";
let loss = "";

data.map((user) => {
  latCenter += user.lat;
  logCenter += user.log;
  bounds.push([user.lat, user.log]);
});
const centerLoc = [latCenter / data.length, logCenter / data.length];
const centerPoint = L.latLng(...centerLoc);

data.forEach((user) => {
  point2 = L.latLng(user.lat, user.log);
  distance = centerPoint.distanceTo(point2);
  user["distance"] = distance;
});

const male = data
  .filter((user) => user.gender == "Male")
  .map((loc) => ({ point: [loc.lat, loc.log], distance: loc.distance }));
const female = data
  .filter((user) => user.gender == "Female")
  .map((loc) => ({ point: [loc.lat, loc.log], distance: loc.distance }));
console.log(male);
// initialize the map
var map = L.map("map");
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
// select the center and appropariate zoom
map.fitBounds(bounds, {
  padding: [30, 30],
});
// set circle at the center
var center = L.circle(centerLoc, {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.2,
  radius: 300,
}).addTo(map);
// add user location
data.forEach((user) => {
  L.marker([user.lat, user.log]).addTo(map);
});
// drawing polygon
var polygon = L.polygon(male.point).addTo(map);
var polygon = L.polygon(female.point).addTo(map);
// var polygon = L.polygon([
//   [33.5119, 36.3067],
//   [33.5097, 36.3063],
//   [33.5131, 36.2974],
// ]).addTo(map);
