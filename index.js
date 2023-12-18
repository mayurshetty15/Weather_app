const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));
const port = 3000;

const API_KEY = "00117dcfb435b3846ef99021935f2f2c";
// Define a route for the home page
app.get("/", (req, res) => {
  res.render(__dirname + `/views/pages/home.ejs`);
});
// Define a route for the root path of the application
app.get("/weather", (req, res) => {
  const address = req.query.address || "bengaluru"; // Read the address query parameter from the request
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${address}&units=metric&appid=${API_KEY}`;
  console.log(url);

  // Make an HTTP GET request to the API using axios
  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      const presentWeather = String(data.weather[0].main);
      const presentWeatherStr = presentWeather.toLowerCase();

      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString(
        undefined,
        {
          timeZone: "Asia/Kolkata",
        }
      );
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
        undefined,
        {
          timeZone: "Asia/Kolkata",
        }
      );

      const ash =  "../images/ash.png";
      const cloudy = "../images/cloudy.png";
      const dust = "../images/dust.png";
      const fog = "../images/fog.png";
      const clearNight = path.join(__dirname + "/views/images/nightclear.png");
      const rain ="../images/rain.png";
      const snow = "../images/snow.png";
      
      const sunny = "../images/sunny.png";
      const thunder = "../images/thunder.png";
      const tornado ="../images/tornado.png";

      let weatherImg = sunny;

      if (presentWeatherStr === "thunderstorm") {
        weatherImg = thunder;
      } else if (
        presentWeatherStr === "drizzle" ||
        presentWeatherStr === "rain"
      ) {
        weatherImg = rain;
      } else if (presentWeatherStr === "snow") {
        weatherImg = snow;
      } else if (
        presentWeatherStr === "mist" ||
        presentWeatherStr === "smoke" ||
        presentWeatherStr === "haze" ||
        presentWeatherStr === "fog"
      ) {
        weatherImg = fog;
      } else if (presentWeatherStr === "dust" || presentWeatherStr === "sand") {
        weatherImg = dust;
      } else if (
        presentWeatherStr === "ash" ||
        presentWeatherStr === "squall"
      ) {
        weatherImg = ash;
      } else if (presentWeatherStr === "clouds") {
        weatherImg = cloudy;
      } else if (presentWeatherStr === "tornado") {
        weatherImg = tornado;
      }

      const renderData = {
        presentWeather: presentWeather,
        presentWeatherImg: weatherImg,
        description: data.weather[0].description,
        temp: data.main.temp,
        minTemp: data.main.temp_min,
        maxTemp: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        cityName: data.name,
        sunsetTime: sunset,
        sunriseTime: sunrise,
        visibility: data.visibility,
      };
      res.render(__dirname + `/views/pages/index.ejs`, renderData);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred while fetching weather data");
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
