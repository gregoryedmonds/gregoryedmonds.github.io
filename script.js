//  JavaScript script page

//  JavaScript form example
//  Accessing DOM to get elements
const name = document.getElementById("name");
const password = document.getElementById("password");
const form = document.getElementById("form");
const errorElement = document.getElementById("error");

//  Event listener for form
form.addEventListener("submit", (e) => {
  //  Array for error messages
  let messages = [];

  //  name validation
  if (name.value === "" || name.value == null) {
    messages.push("Name cannot be blank");
  }
  //  password validation
  if (password.value.length <= 6) {
    messages.push("Password must be at least 6 characters long");
  }

  //  Prevents submit button from linking to sucess page unless form is valid
  if (messages.length > 0) {
    e.preventDefault();

    //  Joins error messages
    errorElement.innerText = messages.join(", ");
  }
});

//  'Where the ISS at?' API and 'Leaflet' library
//  Made using guide at "https://leafletjs.com/examples/quick-start/"
//  Making a map and tiles
const mymap = L.map("mapid").setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

// Making a marker with a custom icon
const issIcon = L.icon({
  iconUrl: "images/iss.png",
  iconSize: [50, 32],
  iconAnchor: [25, 16],
});
let marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap);

mymap.on("zoomend", function () {
  const zoom = mymap.getZoom() + 1;
  const w = 25 * zoom;
  const h = 16 * zoom;
  issIcon.options.iconSize = [w, h];
  issIcon.options.iconAnchor = [w / 2, h / 2];
  mymap.removeLayer(marker);
  let latlng = marker.getLatLng();
  marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap);
  marker.setLatLng(latlng);
});

const api_url = "https://api.wheretheiss.at/v1/satellites/25544";

let firstTime = true;

async function getISS() {
  const response = await fetch(api_url);
  const data = await response.json();
  const { latitude, longitude } = data;

  marker.setLatLng([latitude, longitude]);
  if (firstTime) {
    mymap.setView([latitude, longitude], 2);
    firstTime = false;
  }
  document.getElementById("lat").textContent = latitude.toFixed(2);
  document.getElementById("lon").textContent = longitude.toFixed(2);
}

getISS();
setInterval(getISS, 1000);
