import React from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { RootState } from '../../store';
import { CarReport } from '../../types/CarReport';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VehicleTimeChart: React.FC<{ data: CarReport[] }> = ({ data }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Фильтруем данные, чтобы показать только машины с ненулевыми значениями
  const filteredData = data.filter(
    item => item.car_data.idle_time > 0 || item.car_data.motohours > 0
  );

  // Сортируем по убыванию общего времени (моточасы + простой)
  const sortedData = [...filteredData].sort(
    (a, b) => (b.car_data.motohours + b.car_data.idle_time) - (a.car_data.motohours + a.car_data.idle_time)
  );

  // Цвета для разных тем
  const textColor = theme === 'dark' ? '#fff' : '#333';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tooltipBgColor = theme === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)';

  const chartData = {
    labels: sortedData.map(item => item.car_name),
    datasets: [
      {
        label: 'Моточасы (ч)',
        data: sortedData.map(item => item.car_data.motohours),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Время простоя (ч)',
        data: sortedData.map(item => item.car_data.idle_time),
        backgroundColor: '#FF5733',
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
        text: '',
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
        callbacks: {
          afterBody: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const motohours = sortedData[dataIndex].car_data.motohours;
            const idleTime = sortedData[dataIndex].car_data.idle_time;
            const total = motohours + idleTime;
            return `Всего: ${total.toFixed(1)} ч`;
          },
        },
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