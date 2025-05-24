// src/services/weatherService.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = async (city) => {
  const res = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return res.data;
};

export const getHistoricalWeather = async (lat, lon, dt) => {
  const res = await axios.get(`${BASE_URL}/onecall/timemachine`, {
    params: {
      lat,
      lon,
      dt,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return res.data;
};
