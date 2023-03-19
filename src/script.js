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

let celciusButton = document.querySelector(".c-button");
celciusButton.addEventListener("click", ChangeToC);

let fahrenheitButton = document.querySelector(".f-button");
fahrenheitButton.addEventListener("click", ChangeToF);

let unitLabel = document.querySelector(".unit-text");

function displayForcast(response) {
  let forcastElement = document.querySelector("#forcast");

  let forcastHTML = "";

  response.data.daily.forEach(function (day, index) {
    if (index === 0) {
      return;
    }
    forcastHTML =
      forcastHTML +
      `    
  <div class="row mt-3 text-center align-items-center daily">
          <div class="col-4 align-items-center"><p>${
            days[new Date(day.time * 1000).getDay()]
          }</p>
          </div>
          <div class="col-4 align-items-center">
            <img
              src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                day.condition.icon
              }.png"
              alt="current-conditions"
              id="daily-icon"
            />
            <p class="daily-description">${day.condition.description}</p>
          </div>
          <div class="col-4 align-items-center">
            <p> <span class="forcast-high">
            <span class="temp-unit">    ${Math.round(
              day.temperature.maximum
            )}</span>° / </span> 
            <span class="forcast-min">
            <span class="temp-unit">${Math.round(
              day.temperature.minimum
            )}</span>° </span></p>
          </div>
        </div>
        `;
  });

  forcastElement.innerHTML = forcastHTML;
}

function showForcast(response) {
  let todaysHigh = document.querySelector(".today-high");
  todaysHigh.innerHTML = Math.round(response.data.daily[0].temperature.maximum);
  let todaysLow = document.querySelector(".today-low");
  todaysLow.innerHTML = Math.round(response.data.daily[0].temperature.minimum);
  displayForcast(response);
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
  let todaysTemp = document.querySelector(".todays-temp");
  todaysTemp.innerHTML = Math.round(response.data.temperature.current);
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
  let todaysHigh = document.querySelector(".today-high");
  todaysHigh.innerHTML = Math.round(response.data.daily[0].temperature.maximum);
  let todaysLow = document.querySelector(".today-low");
  todaysLow.innerHTML = Math.round(response.data.daily[0].temperature.minimum);
  displayForcast(response);
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
  let todaysTemp = document.querySelector(".todays-temp");
  todaysTemp.innerHTML = Math.round(response.data.temperature.current);
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
  document.querySelectorAll(".temp-unit").forEach((element) => {
    let currentValue = parseInt(element.innerText.trim());
    let cTemp = ((currentValue - 32) * 5) / 9;

    element.innerText = Math.round(cTemp);
  });
  unitLabel.innerText = "°C";

  celciusButton.classList.add("selected");
  fahrenheitButton.classList.remove("selected");

  celciusButton.setAttribute("disabled", true);
  fahrenheitButton.removeAttribute("disabled");
}

function ChangeToF(event) {
  document.querySelectorAll(".temp-unit").forEach((element) => {
    let currentValue = parseInt(element.innerText.trim());

    let fTemp = (currentValue * 9) / 5 + 32;

    element.innerText = Math.round(fTemp);
  });

  unitLabel.innerText = "°F";

  celciusButton.classList.remove("selected");
  fahrenheitButton.classList.add("selected");

  celciusButton.removeAttribute("disabled");
  fahrenheitButton.setAttribute("disabled", true);
}
