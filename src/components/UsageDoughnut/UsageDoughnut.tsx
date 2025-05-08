// UsageDoughnut.tsx
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

type DoughnutDataItem = {
  label: string;
  value: number;
};

type UsageDoughnutProps = {
  data: DoughnutDataItem[];
  title?: string;
  cutout?: string | number;
  radius?: string | number;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  unit?: string; // Например: "ч", "км", "%"
  hideTooltip?: boolean;
};

// Стандартные цвета для диаграммы (примерно 10 штук)
const defaultColors = [
  '#36A2EB', // blue
  '#FF5733', // red/orange
  '#4CAF50', // green
  '#FFC107', // yellow
  '#9C27B0', // purple
  '#E91E63', // pink
  '#00BCD4', // cyan
  '#FF9800', // deep orange
  '#795548', // brown
  '#607D8B', // grey-blue
];

const UsageDoughnut: React.FC<UsageDoughnutProps> = ({
  data,
  title = '',
  cutout = '80%',
  radius = '90%',
  showLegend = true,
  legendPosition = 'top',
  unit = '',
  hideTooltip = false,
}) => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const textColor = theme === 'dark' ? '#fff' : '#333';
  const tooltipBgColor = theme === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const borderColor = theme === 'dark' ? '#222' : '#fff';

  // Форматирование больших чисел для подписей
  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
  };

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: defaultColors.slice(0, data.length),
        borderColor,
        borderWidth: 2,
        cutout,
        radius,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: showLegend,
        position: legendPosition,
        labels: {
          color: textColor,
          padding: 10,
          font: { size: 11 },
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,

        },
      },
      title: {
        display: !!title,
        text: title,
        color: textColor,
        font: { size: 16 },
        padding: { top: 0, bottom: 20 },
      },
      tooltip: {
        enabled: !hideTooltip,
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatNumber(value)}${unit} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return <Doughnut options={options} data={chartData} />;
};

export default UsageDoughnut;