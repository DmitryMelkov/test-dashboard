import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReportData {
  date: string;
  idle_time: number;
  motohours: number;
  trip_time: number;
}

interface VehicleTimeChartProps {
  data: ReportData[];
}

const VehicleTimeChart: React.FC<VehicleTimeChartProps> = ({ data }) => {
  // Подготовка данных для графика
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Время простоя (ч)',
        data: data.map(item => item.idle_time),
        backgroundColor: '#FF5733',
      },
      {
        label: 'Моточасы (ч)',
        data: data.map(item => item.motohours),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Время поездки (ч)',
        data: data.map(item => item.trip_time),
        backgroundColor: '#FFCD56',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Распределение времени работы транспортного средства',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Часы',
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default VehicleTimeChart;