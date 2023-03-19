let today = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[today.getDay()];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[today.getMonth()];
let date = today.getDate();
let hour = today.getHours();
let minutes = today.getMinutes();
let year = today.getFullYear();

let currentDay = document.querySelector(".todays-date");
currentDay.innerHTML = ` ${day} ${month} ${date}, ${year} ${hour}:${minutes
  .toString()
  .padStart(2, "0")}`;

function displayForcast() {
  let forcastElement = document.querySelector("#forcast");

  let forcastHTML = "";
  let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  days.forEach(function (day) {
    forcastHTML =
      forcastHTML +
      `    
  <div class="row mt-3 text-center align-items-center daily">
          <div class="col-4 align-items-center"><p>${day}</p></div>
          <div class="col-4 align-items-center">
            <img
              src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/few-clouds-day.png"
              alt="current-conditions"
              id="daily-icon"
            />
            <p class="daily-description"></p>
          </div>
          <div class="col-4 align-items-center">
            <p> <span class="forcast-high">High ° </span> 
            <span class="forcast-min"> Low ° </span></p>
          </div>
        </div>
        `;
  });

  forcastElement.innerHTML = forcastHTML;
}

function showForcast(response) {
  console.log(response);
  let todaysHigh = document.querySelector(".today-high");
  todaysHigh.innerHTML = Math.round(response.data.daily[0].temperature.maximum);
  let todaysLow = document.querySelector(".today-low");
  todaysLow.innerHTML = Math.round(response.data.daily[0].temperature.minimum);
}

function changeCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#location");
  let h1 = document.querySelector(".current-location");
  let apiKey = "f4b9t1e40f9ae2fof04248f3cac60e36";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityInput.value}&key=${apiKey}&units=metric`;
  h1.innerHTML = cityInput.value;

  axios.get(apiUrl).then(showForcast);

  showCurrentTemp(cityInput.value);
}

function showCurrentTemp(city) {
  let apiKey = "f4b9t1e40f9ae2fof04248f3cac60e36";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(updateCurrentTemp);
}

function updateCurrentTemp(response) {
  console.log({ response });
  cTemp = response.data.temperature.current;
  let todaysTemp = document.querySelector(".todays-temp");
  todaysTemp.innerHTML = Math.round(cTemp);
  let humidityIndicator = document.querySelector("#humidity");
  humidityIndicator.innerHTML = response.data.temperature.humidity;
  let windIndicator = document.querySelector("#wind");
  windIndicator.innerHTML = response.data.wind.speed;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
  let weatherDescription = document.querySelector(".weather-description");
  weatherDescription.innerHTML = response.data.condition.description;
}

function currentLocationTemp(response) {
  console.log(response);
  let todaysHigh = document.querySelector(".today-high");
  todaysHigh.innerHTML = Math.round(response.data.daily[0].temperature.maximum);
  let todaysLow = document.querySelector(".today-low");
  todaysLow.innerHTML = Math.round(response.data.daily[0].temperature.minimum);
}

function displayCurrentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "f4b9t1e40f9ae2fof04248f3cac60e36";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(currentLocationTemp);

  displayCurrentLocationTemp(lat, lon);
}

function displayCurrentLocationTemp(lat, lon) {
  let apiKey = "f4b9t1e40f9ae2fof04248f3cac60e36";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}`;
  axios.get(apiUrl).then(updateCurrentLocationUi);
}

function updateCurrentLocationUi(response) {
  console.log({ response });
  cTemp = response.data.temperature.current;
  let todaysTemp = document.querySelector(".todays-temp");
  todaysTemp.innerHTML = Math.round(cTemp);
  let local = document.querySelector(".current-location");
  local.innerHTML = response.data.city;
  let humidityIndicator = document.querySelector("#humidity");
  humidityIndicator.innerHTML = response.data.temperature.humidity;
  let windIndicator = document.querySelector("#wind");
  windIndicator.innerHTML = response.data.wind.speed;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
  let weatherDescription = document.querySelector(".weather-description");
  weatherDescription.innerHTML = response.data.condition.description;
}

function currentLocation() {
  navigator.geolocation.getCurrentPosition(displayCurrentLocation);
}

let currentPosition = document.querySelector("#current-location-button");
currentPosition.addEventListener("click", currentLocation);

let city = document.querySelector(".location-search");
city.addEventListener("submit", changeCity);

function ChangeToC() {
  let tempElement = document.querySelector("#unit-change");
  tempElement.innerHTML = Math.round(cTemp);
  unitLabel.innerText = "°C";

  celciusButton.classList.add("selected");
  fahrenheitButton.classList.remove("selected");

  celciusButton.setAttribute("disabled", true);
  fahrenheitButton.removeAttribute("disabled");
}

function ChangeToF(event) {
  let tempElement = document.querySelector("#unit-change");
  let fTemp = (cTemp * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fTemp);
  unitLabel.innerText = "°F";

  celciusButton.classList.remove("selected");
  fahrenheitButton.classList.add("selected");

  celciusButton.removeAttribute("disabled");
  fahrenheitButton.setAttribute("disabled", true);
}

let cTemp = null;

let celciusButton = document.querySelector(".c-button");
celciusButton.addEventListener("click", ChangeToC);

let fahrenheitButton = document.querySelector(".f-button");
fahrenheitButton.addEventListener("click", ChangeToF);

let unitLabel = document.querySelector(".unit-text");

displayForcast();
