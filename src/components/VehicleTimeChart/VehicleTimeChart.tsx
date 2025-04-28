import React from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { RootState } from '../../store';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CarData {
  car_name: string;
  wln_id: number;
  car_data: {
    idle_time: number;
    motohours: number;
  };
}

const VehicleTimeChart: React.FC<{ data: CarData[] }> = ({ data }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Фильтруем данные, чтобы показать только машины с ненулевыми значениями
  const filteredData = data.filter(
    item => item.car_data.idle_time > 0 || item.car_data.motohours > 0
  );

  // Сортируем по убыванию моточасов
  const sortedData = [...filteredData].sort(
    (a, b) => b.car_data.motohours - a.car_data.motohours
  );

  // Цвета для разных тем
  const textColor = theme === 'dark' ? '#fff' : '#333';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tooltipBgColor = theme === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)';

  const chartData = {
    labels: sortedData.map(item => item.car_name),
    datasets: [
      {
        label: 'Время простоя (ч)',
        data: sortedData.map(item => item.car_data.idle_time),
        backgroundColor: '#FF5733',
      },
      {
        label: 'Моточасы (ч)',
        data: sortedData.map(item => item.car_data.motohours),
        backgroundColor: '#36A2EB',
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
        text: 'Распределение моточасов и времени простоя по машинам',
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
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        min: 0,
        max: 24,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          stepSize: 4,
        },
        title: {
          display: true,
          text: 'Часы',
          color: textColor,
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default VehicleTimeChart;