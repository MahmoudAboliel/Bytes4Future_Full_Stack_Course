const initMap = (id, label) => {
  // initialize the map
  let map = L.map(id);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">' +
      label +
      "</a>",
  }).addTo(map);
  return map;
};

// This function for internet
const calculateArea = (users) => {
  if (users.length < 3) return 0;

  const formattedCoords = users.map((user) => [user.lng, user.lat]);
  formattedCoords.push(formattedCoords[0]);

  const polygon = turf.polygon([formattedCoords]);
  const unkinkedPolygons = turf.unkinkPolygon(polygon);

  let totalArea = 0;

  unkinkedPolygons.features.forEach((feature) => {
    totalArea += turf.area(feature);
  });

  return totalArea;
};

const selectFarthestWinner = (users) => {
  const distances = users.map((user) => user.distance);
  const maxDistance = Math.max(...distances);
  const farthest = users.find((user) => user.distance == maxDistance);
  return farthest?.id || null;
};

const selectYoungestLoser = (users) => {
  const ages = users.map((user) => user.age);
  const youngestAge = Math.min(...ages);
  const youngest = users.find((user) => user.age == youngestAge);
  return youngest?.id || null;
};
