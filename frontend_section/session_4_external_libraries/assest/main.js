const myHouse = [33.59300982291757, 36.433258645780036];

var map = L.map("b4f").setView(myHouse, 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);