 var map = L.map('map').setView([28.61, 77.23], 12);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
       maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
// public/js/map.js

function initMap(coordinates, title, location) {
  if (!coordinates || coordinates.length < 2) {
    console.error("Invalid coordinates:", coordinates);
    return;
  }

  // Initialize the map
  const map = L.map('map').setView([coordinates[1], coordinates[0]], 12);

  // Add OpenStreetMap tiles
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Add a marker
  L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup(`<b>${title}</b><br>${location}`)
    .openPopup();
}
