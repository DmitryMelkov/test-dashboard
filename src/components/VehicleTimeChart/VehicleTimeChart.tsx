import React from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { RootState } from '../../store';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReportData {
  date: string;
  idle_time: number;
  motohours: number;
  trip_time: number;
}

const VehicleTimeChart: React.FC<{ data: ReportData[] }> = ({ data }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Цвета для разных тем
  const textColor = theme === 'dark' ? '#fff' : '#333';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tooltipBgColor = theme === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)';

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
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        text: 'Распределение времени работы транспортного средства',
        color: textColor,
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Часы',
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default VehicleTimeChart;