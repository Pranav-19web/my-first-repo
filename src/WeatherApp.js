import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_KEY = "480219e368965b5e5bbd0eb2e63c71fd"; // Use your API key here

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = () => {
    if (!city) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    setError("");
    setWeather(null);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weather data");
        return res.json();
      })
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch weather data. Please check city name or try later.");
      });
  };

  // Prepare chart data when weather is available
  const chartData = weather
    ? {
        labels: ["Min Temp", "Current Temp", "Max Temp"],
        datasets: [
          {
            label: "Temperature (°C)",
            data: [weather.main.temp_min, weather.main.temp, weather.main.temp_max],
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: `Temperature in ${city}` },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Weather App</h2>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <button onClick={getWeather} style={{ width: "100%", padding: 10 }}>
        Get Weather
      </button>

      {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}

      {weather && (
        <>
          <div style={{ marginTop: 20, textAlign: "left" }}>
            <h3>Current Weather in {weather.name}</h3>
            <p>Temperature: {weather.main.temp} °C</p>
            <p>Condition: {weather.weather[0].description}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </div>

          <div style={{ marginTop: 40 }}>
            <Bar data={chartData} options={options} />
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherApp;
