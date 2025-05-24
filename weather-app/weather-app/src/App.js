import React, { useEffect, useState } from 'react';
import { getCurrentWeather, getHistoricalWeather } from './services/weatherService';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [city, setCity] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [current, setCurrent] = useState(null);
  const [historical, setHistorical] = useState([]);

  useEffect(() => {
    // Get location on first load
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const currentData = await getCurrentWeather(`${lat},${lon}`);
        setCity(currentData.name);
      },
      () => {
        // Fallback to Hyderabad
        setCity('Hyderabad');
      }
    );
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;
      try {
        const currentData = await getCurrentWeather(city);
        setCurrent(currentData);

        const now = Math.floor(Date.now() / 1000);
        const pastDays = [1, 2, 3, 4, 5];

        const data = await Promise.all(
          pastDays.map(async (d) => {
            const dt = now - d * 86400;
            const res = await getHistoricalWeather(currentData.coord.lat, currentData.coord.lon, dt);
            return {
              date: new Date(dt * 1000).toLocaleDateString(),
              temp: res.current.temp,
            };
          })
        );

        setHistorical(data.reverse());
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchWeather();
  }, [city]);

  const chartData = {
    labels: historical.map((h) => h.date),
    datasets: [
      {
        label: 'Temp (°C)',
        data: historical.map((h) => h.temp),
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity) {
      setCity(inputCity);
      setInputCity('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Weather App</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>

      {current && (
        <div style={{ marginTop: 20 }}>
          <h2>{current.name}</h2>
          <p>Temperature: {current.main.temp}°C</p>
          <p>Weather: {current.weather[0].description}</p>
        </div>
      )}

      <div style={{ maxWidth: '600px', marginTop: 30 }}>
        <h3>Last 5 Days Temperature</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default App;
