import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { RootState } from '../../store';
import { CarReport } from '../../types/CarReport';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VehicleActivityChart: React.FC<{ data: CarReport[] }> = ({ data }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Группируем данные по месяцам
  const monthlyData = useMemo(() => {
    const monthsMap = new Map<string, Set<string>>(); // Месяц -> Set машин

    data.forEach(item => {
      if (item.car_data.motohours > 0 || item.car_data.idle_time > 0) {
        const date = new Date(item.car_data.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthsMap.has(monthKey)) {
          monthsMap.set(monthKey, new Set());
        }
        monthsMap.get(monthKey)?.add(item.car_name);
      }
    });

    // Получаем все уникальные машины
    const allCars = new Set<string>();
    data.forEach(item => allCars.add(item.car_name));
    const totalCars = allCars.size;

    // Сортируем месяцы по возрастанию
    const sortedMonths = Array.from(monthsMap.keys()).sort();

    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(parseInt(year), parseInt(monthNum) - 1, 1).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
      }),
      activeCars: sortedMonths.map(month => monthsMap.get(month)?.size || 0),
      totalCars: Array(sortedMonths.length).fill(totalCars)
    };
  }, [data]);

  // Цвета для разных тем
  const textColor = theme === 'dark' ? '#fff' : '#333';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tooltipBgColor = theme === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)';

  const chartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Всего машин',
        data: monthlyData.totalCars,
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0,
        pointRadius: 3,
        fill: false
      },
      {
        label: 'Активные машины',
        data: monthlyData.activeCars,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 3,
        fill: false
      }
    ]
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
        suggestedMax: Math.max(...monthlyData.totalCars) + 2,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Количество машин',
          color: textColor,
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default VehicleActivityChart;