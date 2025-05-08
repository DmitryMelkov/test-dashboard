import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Стандартные цвета для диаграммы
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

export interface BarChartDataset<T> {
  label: string;
  field: keyof T;
}

interface BarChartProps<T> {
  data: T[];
  datasets: BarChartDataset<T>[];
  title: string;
  unit?: string;
  theme?: 'light' | 'dark';
  labelField?: keyof T;
}

const BarChart = <T extends Record<string, any>>({
  data,
  datasets,
  title,
  unit = 'Р',
  theme = 'light',
  labelField = 'date',
}: BarChartProps<T>) => {
  if (!data || data.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  const chartData: ChartData<'bar'> = {
    labels: data.map((item) => item[labelField]?.toString() || ''),
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: data.map((item) => {
        const value = item[dataset.field];
        return typeof value === 'number' ? value : 0;
      }),
      backgroundColor: defaultColors[index % defaultColors.length],
      borderColor: 'transparent',
      borderWidth: 0,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#fff' : '#333',
        },
      },
      title: {
        display: true,
        text: title,
        color: theme === 'dark' ? '#fff' : '#333',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} ${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: theme === 'dark' ? '#fff' : '#333',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: theme === 'dark' ? '#fff' : '#333',
          callback: function (value) {
            return `${value} ${unit}`;
          },
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;