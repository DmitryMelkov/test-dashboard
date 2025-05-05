import React from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { RootState } from '../../store';
import { CarReport } from '../../types/CarReport';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VehicleMileageChart: React.FC<{ data: CarReport[] }> = ({ data }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Фильтруем данные, чтобы показать только машины с ненулевым пробегом
  const filteredData = data.filter(item => item.car_data.millage > 0);

  // Сортируем по убыванию пробега
  const sortedData = [...filteredData].sort(
    (a, b) => b.car_data.millage - a.car_data.millage
  );

  // Цвета для разных тем
  const textColor = theme === 'dark' ? '#fff' : '#333';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tooltipBgColor = theme === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)';

  const chartData = {
    labels: sortedData.map(item => item.car_name),
    datasets: [
      {
        label: 'Пробег (км)',
        data: sortedData.map(item => item.car_data.millage),
        backgroundColor: '#4BC0C0',
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
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw} км`;
          },
        },
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
        type: 'linear' as const,
        min: 0,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          callback: function(this: any, value: string | number) {
            if (typeof value === 'number') {
              return `${value} км`;
            }
            return value;
          },
        },
        title: {
          display: true,
          text: 'Пробег',
          color: textColor,
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default VehicleMileageChart;