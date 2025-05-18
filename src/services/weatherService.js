const API_KEY = '480219e368965b5e5bbd0eb2e63c71fd'; // your OpenWeatherMap API key

export async function fetchCurrentWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  const data = await response.json();
  return data;
}
