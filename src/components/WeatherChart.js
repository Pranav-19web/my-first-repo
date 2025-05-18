import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) =>
      new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((item) => item.temp),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Hourly Temperature",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default WeatherChart;
