// src/App.js
import React, { useEffect, useState } from 'react';
import { getCurrentWeather, getHistoricalWeather } from './services/weatherService';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [city, setCity] = useState('Hyderabad');
  const [current, setCurrent] = useState(null);
  const [historical, setHistorical] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
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
        console.error('Error fetching weather:', error);
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
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Weather App</h1>
      <input value={city} onChange={(e) => setCity(e.target.value)} />
      {current && (
        <div>
          <h2>{current.name}</h2>
          <p>Temp: {current.main.temp}°C</p>
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
