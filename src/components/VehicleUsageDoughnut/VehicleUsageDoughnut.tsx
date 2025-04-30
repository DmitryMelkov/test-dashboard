import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { RootState } from '../../store';
import { CarReport } from '../../types/CarReport';

ChartJS.register(ArcElement, Tooltip, Legend);

const VehicleUsageDoughnut: React.FC<{ data: CarReport[] }> = ({ data }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Рассчитываем средние значения
  const { avgMotohours, avgIdleTime } = useMemo(() => {
    const filteredData = data.filter(
      item => item.car_data.motohours > 0 || item.car_data.idle_time > 0
    );

    if (filteredData.length === 0) {
      return { avgMotohours: 0, avgIdleTime: 0 };
    }

    const totalMotohours = filteredData.reduce(
      (sum, item) => sum + item.car_data.motohours,
      0
    );
    const totalIdleTime = filteredData.reduce(
      (sum, item) => sum + item.car_data.idle_time,
      0
    );

    return {
      avgMotohours: totalMotohours / filteredData.length,
      avgIdleTime: totalIdleTime / filteredData.length,
    };
  }, [data]);

  // Цвета для разных тем
  const textColor = theme === 'dark' ? '#fff' : '#333';
  const tooltipBgColor = theme === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)';

  const chartData = {
    labels: ['Средние моточасы', 'Средний простой'],
    datasets: [
      {
        data: [avgMotohours, avgIdleTime],
        backgroundColor: ['#36A2EB', '#FF5733'],
        borderColor: theme === 'dark' ? '#222' : '#fff',
        borderWidth: 2,
        cutout: '80%',
        radius: '90%',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Легенда теперь сверху
        labels: {
          color: textColor,
          padding: 20,
          font: {
            size: 12,
          },
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true, // Используем точечный стиль для элементов легенды
        },
      },
      title: {
        display: true,
        text: '',
        color: textColor,
        font: {
          size: 16,
        },
        padding: {
          top: 0,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value.toFixed(1)} ч (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0, // Убираем границу у сегментов
      },
    },
  };

  return <Doughnut options={options} data={chartData} />;
};

export default VehicleUsageDoughnut;