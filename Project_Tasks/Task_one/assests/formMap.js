const form = document.getElementById('form-data');

let formMap = L.map("form-map").setView(damascusLocation, 10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(formMap);

formMap.on('click', (e) => {
    const latField = form.querySelector('input[name="lat"]');
    const lngField = form.querySelector('input[name="lng"]');
    latField.value = e.latlng.lat;
    lngField.value = e.latlng.lng;
});